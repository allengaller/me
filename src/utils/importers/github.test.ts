import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importFromGitHub } from './github';

describe('github importer', () => {
  const mockUserData = {
    name: 'Test User',
    login: 'testuser',
    location: 'Test City',
    bio: 'A developer',
    avatar_url: 'https://avatars.example.com/test',
    email: 'test@example.com',
    html_url: 'https://github.com/testuser',
  };

  const mockReposData = [
    {
      name: 'cool-project',
      description: 'A cool project',
      language: 'TypeScript',
      html_url: 'https://github.com/testuser/cool-project',
      homepage: 'https://cool.example.com',
      stargazers_count: 42,
      forks_count: 7,
      fork: false,
    },
    {
      name: 'forked-repo',
      description: 'A fork',
      language: 'JavaScript',
      html_url: 'https://github.com/testuser/forked-repo',
      homepage: '',
      stargazers_count: 0,
      forks_count: 0,
      fork: true,
    },
    {
      name: 'another-project',
      description: null,
      language: 'Python',
      html_url: 'https://github.com/testuser/another-project',
      homepage: '',
      stargazers_count: 10,
      forks_count: 3,
      fork: false,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function mockFetchSuccess() {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('/repos?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReposData),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      });
    }));
  }

  it('should throw error for empty username', async () => {
    await expect(importFromGitHub('')).rejects.toThrow('GitHub username is required');
  });

  it('should throw error for null/undefined username', async () => {
    await expect(importFromGitHub(null as any)).rejects.toThrow('GitHub username is required');
    await expect(importFromGitHub(undefined as any)).rejects.toThrow('GitHub username is required');
  });

  it('should strip @ prefix from username', async () => {
    mockFetchSuccess();
    await importFromGitHub('@testuser');
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser');
  });

  it('should trim whitespace from username', async () => {
    mockFetchSuccess();
    await importFromGitHub('  testuser  ');
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser');
  });

  it('should throw not found error for 404 response', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: false, status: 404 })
    ));
    await expect(importFromGitHub('nonexistent')).rejects.toThrow('not found');
  });

  it('should throw API error for non-404 error status', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ));
    await expect(importFromGitHub('testuser')).rejects.toThrow('GitHub API error: 500');
  });

  it('should throw wrapped error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.reject(new TypeError('Failed to fetch'))
    ));
    await expect(importFromGitHub('testuser')).rejects.toThrow('Failed to import from GitHub');
  });

  it('should return profile with correct structure on success', async () => {
    mockFetchSuccess();
    const result = await importFromGitHub('testuser');
    expect(result.profile.name).toBe('Test User');
    expect(result.profile.location).toBe('Test City');
    expect(result.profile.about).toBe('A developer');
    expect(result.profile.avatar).toBe('https://avatars.example.com/test');
    expect(result.profile.contact).toBe('test@example.com');
  });

  it('should include GitHub social link', async () => {
    mockFetchSuccess();
    const result = await importFromGitHub('testuser');
    expect(result.social).toHaveLength(1);
    expect(result.social[0].platform).toBe('GitHub');
    expect(result.social[0].url).toBe('https://github.com/testuser');
  });

  it('should infer skills from repo languages', async () => {
    mockFetchSuccess();
    const result = await importFromGitHub('testuser');
    expect(result.skills.length).toBeGreaterThan(0);
    expect(result.skills[0].name).toBe('Languages');
    expect(result.skills[0].technologies).toContain('TypeScript');
    expect(result.skills[0].technologies).toContain('Python');
    expect(result.skills[0].technologies).toContain('JavaScript');
  });

  it('should exclude forked repos from projects', async () => {
    mockFetchSuccess();
    const result = await importFromGitHub('testuser');
    const projectNames = result.projects.map((p: any) => p.title);
    expect(projectNames).not.toContain('forked-repo');
    expect(projectNames).toContain('cool-project');
  });

  it('should map repo data to project structure correctly', async () => {
    mockFetchSuccess();
    const result = await importFromGitHub('testuser');
    const project = result.projects.find((p: any) => p.title === 'cool-project');
    expect(project).toBeDefined();
    expect(project.description).toBe('A cool project');
    expect(project.technologies).toEqual(['TypeScript']);
    expect(project.github).toBe('https://github.com/testuser/cool-project');
    expect(project.live).toBe('https://cool.example.com');
    expect(project.highlights).toContain('42 stars');
    expect(project.highlights).toContain('7 forks');
  });

  it('should fallback to login when name is null', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('/repos?')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockUserData, name: null }),
      });
    }));
    const result = await importFromGitHub('testuser');
    expect(result.profile.name).toBe('testuser');
  });

  it('should use bio fallback when bio is null', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('/repos?')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockUserData, bio: null }),
      });
    }));
    const result = await importFromGitHub('testuser');
    expect(result.profile.about).toContain('@testuser');
  });

  it('should return empty skills when repos have no language', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('/repos?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { ...mockReposData[0], language: null, fork: false },
          ]),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUserData) });
    }));
    const result = await importFromGitHub('testuser');
    expect(result.skills).toHaveLength(0);
  });
});
