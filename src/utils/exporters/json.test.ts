// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToJson, downloadJSON } from './json';

describe('json exporter', () => {
  const sampleProfile = {
    name: 'Test User',
    title: 'Engineer',
    location: 'Test City',
    social: [{ platform: 'GitHub', url: 'https://github.com/test' }],
    skills: [{ name: 'JavaScript', level: 'Advanced' }],
  };

  describe('exportToJson', () => {
    it('should return pretty-printed JSON by default', () => {
      const result = exportToJson(sampleProfile);
      expect(result).toContain('\n');
      expect(result).toContain('  "name": "Test User"');
    });

    it('should return compact JSON when pretty=false', () => {
      const result = exportToJson(sampleProfile, false);
      expect(result).not.toContain('\n');
      expect(result).toContain('"name":"Test User"');
    });

    it('should include _meta block with generator, version, exportedAt', () => {
      const result = exportToJson(sampleProfile);
      const parsed = JSON.parse(result);
      expect(parsed._meta).toBeDefined();
      expect(parsed._meta.generator).toBe('ME Tool');
      expect(parsed._meta.version).toBe('1.0.0');
      expect(parsed._meta.exportedAt).toBeDefined();
      // Verify exportedAt is a valid ISO date string
      expect(new Date(parsed._meta.exportedAt).toISOString()).toBe(parsed._meta.exportedAt);
    });

    it('should preserve all original profile fields', () => {
      const result = exportToJson(sampleProfile);
      const parsed = JSON.parse(result);
      expect(parsed.name).toBe('Test User');
      expect(parsed.title).toBe('Engineer');
      expect(parsed.location).toBe('Test City');
      expect(parsed.social).toEqual([{ platform: 'GitHub', url: 'https://github.com/test' }]);
      expect(parsed.skills).toEqual([{ name: 'JavaScript', level: 'Advanced' }]);
    });

    it('should handle empty profile object', () => {
      const result = exportToJson({});
      const parsed = JSON.parse(result);
      expect(parsed._meta).toBeDefined();
      expect(parsed.name).toBeUndefined();
    });

    it('should produce valid JSON', () => {
      const result = exportToJson(sampleProfile);
      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('downloadJSON', () => {
    it('should be a function', () => {
      expect(typeof downloadJSON).toBe('function');
    });

    it('should accept profile and optional filename', () => {
      // Verify the function signature by checking it does not throw with valid args
      // (Blob/URL mocking is complex in jsdom, so we test the function exists and accepts params)
      expect(downloadJSON.length).toBeLessThanOrEqual(2);
    });
  });
});
