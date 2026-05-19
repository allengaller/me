import { describe, it, expect } from 'vitest';
import { generateSoulMd } from './soul-generator';

describe('soul-generator', () => {
  const minimalProfile = {
    name: 'Test User',
    title: 'Engineer',
    location: 'Test City',
    about: 'A test bio.',
    avatar: 'https://example.com/avatar.jpg',
    social: [
      { platform: 'GitHub', url: 'https://github.com/test' },
    ],
    skills: [
      { name: 'JavaScript', level: 'Advanced', technologies: ['Node.js', 'React'] },
    ],
    projects: [
      {
        title: 'Test Project',
        description: 'A test project.',
        technologies: ['TypeScript'],
        github: 'https://github.com/test/project',
        highlights: ['100 stars'],
      },
    ],
    experience: [
      {
        title: 'Senior Engineer',
        company: 'Test Corp',
        period: '2020 - Present',
        description: 'Building things.',
        achievements: ['Shipped v1.0'],
      },
    ],
  };

  it('should generate markdown with all sections', () => {
    const md = generateSoulMd(minimalProfile);

    expect(md).toContain('# SOUL.md - Test User');
    expect(md).toContain('## 🎯 Identity');
    expect(md).toContain('Test User');
    expect(md).toContain('Engineer');
    expect(md).toContain('## 🔗 Connect');
    expect(md).toContain('GitHub');
    expect(md).toContain('## 💡 Skills');
    expect(md).toContain('JavaScript');
    expect(md).toContain('## 🚀 Projects');
    expect(md).toContain('Test Project');
    expect(md).toContain('## 💼 Experience');
    expect(md).toContain('Senior Engineer @ Test Corp');
    expect(md).toContain('## 📊 Meta');
  });

  it('should handle empty profile gracefully', () => {
    const md = generateSoulMd({});
    expect(md).toContain('# SOUL.md - Anonymous');
    expect(md).toContain('No bio provided.');
    expect(md).toContain('No social links provided.');
    expect(md).toContain('No skills provided.');
    expect(md).toContain('No projects provided.');
    expect(md).toContain('No experience provided.');
  });

  it('should include lobster communities section', () => {
    const profile = {
      ...minimalProfile,
      lobsterCommunities: [
        { platform: 'Lobster', id: 'testuser', tags: ['developer'] },
      ],
    };
    const md = generateSoulMd(profile);
    expect(md).toContain('## 🦞 Lobster Communities');
    expect(md).toContain('Lobster');
    expect(md).toContain('testuser');
  });

  it('should include project highlights', () => {
    const md = generateSoulMd(minimalProfile);
    expect(md).toContain('100 stars');
    expect(md).toContain('https://github.com/test/project');
  });
});
