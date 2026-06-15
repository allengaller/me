// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importFromJson, readJsonFile } from './json';

describe('json importer', () => {
  describe('importFromJson', () => {
    it('should parse valid JSON with complete structure', () => {
      const input = JSON.stringify({
        profile: { name: 'Test', title: 'Engineer', location: 'City' },
        social: [{ platform: 'GitHub', url: 'https://github.com/test' }],
        skills: [{ name: 'JS' }],
        projects: [{ title: 'Project' }],
        experience: [{ title: 'Dev', company: 'Corp' }],
      });
      const result = importFromJson(input);
      expect(result.profile.name).toBe('Test');
      expect(result.social).toHaveLength(1);
      expect(result.skills).toHaveLength(1);
      expect(result.projects).toHaveLength(1);
      expect(result.experience).toHaveLength(1);
    });

    it('should normalize missing arrays to empty arrays', () => {
      const input = JSON.stringify({ profile: { name: 'Test' } });
      const result = importFromJson(input);
      expect(result.social).toEqual([]);
      expect(result.skills).toEqual([]);
      expect(result.projects).toEqual([]);
      expect(result.experience).toEqual([]);
      expect(result.lobsterCommunities).toEqual([]);
    });

    it('should set default empty strings for missing profile fields', () => {
      const input = JSON.stringify({ profile: {} });
      const result = importFromJson(input);
      expect(result.profile.name).toBe('');
      expect(result.profile.title).toBe('');
      expect(result.profile.location).toBe('');
      expect(result.profile.about).toBe('');
      expect(result.profile.avatar).toBe('');
      expect(result.profile.contact).toBe('');
    });

    it('should preserve extra profile fields via spread', () => {
      const input = JSON.stringify({
        profile: { name: 'Test', customField: 'custom value' },
      });
      const result = importFromJson(input);
      expect(result.profile.customField).toBe('custom value');
    });

    it('should throw error for invalid JSON string', () => {
      expect(() => importFromJson('not json')).toThrow('Invalid JSON format');
    });

    it('should handle JSON array without throwing (arrays are objects)', () => {
      const result = importFromJson('[1, 2, 3]');
      expect(result).toBeDefined();
      expect(result.social).toEqual([]);
    });

    it('should throw error for JSON null value', () => {
      expect(() => importFromJson('null')).toThrow('Invalid JSON structure');
    });

    it('should handle JSON with non-array social/skills (normalize to [])', () => {
      const input = JSON.stringify({
        profile: { name: 'Test' },
        social: 'not an array',
        skills: 42,
      });
      const result = importFromJson(input);
      expect(result.social).toEqual([]);
      expect(result.skills).toEqual([]);
    });

    it('should handle JSON string that looks like array by extracting profile', () => {
      // Arrays are objects in JS, so typeof check passes but normalization still works
      const result = importFromJson('{"profile":{"name":"test"},"social":[]}');
      expect(result.profile.name).toBe('test');
      expect(result.skills).toEqual([]);
      expect(result.projects).toEqual([]);
      expect(result.experience).toEqual([]);
    });

    it('should handle profile with lobsterCommunities', () => {
      const input = JSON.stringify({
        profile: { name: 'Test' },
        lobsterCommunities: [{ platform: 'Lobster', id: 'testuser' }],
      });
      const result = importFromJson(input);
      expect(result.lobsterCommunities).toHaveLength(1);
      expect(result.lobsterCommunities[0].id).toBe('testuser');
    });
  });

  describe('readJsonFile', () => {
    function createMockFile(content: string, type: string = 'application/json'): File {
      const blob = new Blob([content], { type });
      return new File([blob], 'test.json', { type });
    }

    it('should reject if file is null', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(readJsonFile(null as any)).rejects.toThrow('valid JSON file');
    });

    it('should reject if file type is not application/json', async () => {
      const file = createMockFile('{}', 'text/plain');
      await expect(readJsonFile(file)).rejects.toThrow('valid JSON file');
    });

    it('should resolve with parsed data for valid JSON file', async () => {
      const data = { profile: { name: 'Test' } };
      const file = createMockFile(JSON.stringify(data));
      const result = await readJsonFile(file);
      expect(result.profile.name).toBe('Test');
    });

    it('should reject for invalid JSON content in file', async () => {
      const file = createMockFile('not valid json');
      await expect(readJsonFile(file)).rejects.toThrow();
    });
  });
});
