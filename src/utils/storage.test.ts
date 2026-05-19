import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  getDraftTimestamp,
} from './storage';

// Mock localStorage
const store = {};
const localStorageMock = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => { store[key] = value; }),
  removeItem: vi.fn((key) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('saveDraft', () => {
    it('should save data to localStorage', () => {
      const data = { name: 'test', age: 25 };
      const result = saveDraft(data);
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledOnce();
    });

    it('should wrap data with version and timestamp', () => {
      const data = { name: 'test' };
      saveDraft(data);
      const saved = JSON.parse(store['me_wizard_draft']);
      expect(saved).toHaveProperty('version', '1.0');
      expect(saved).toHaveProperty('timestamp');
      expect(saved).toHaveProperty('data', data);
    });
  });

  describe('loadDraft', () => {
    it('should return null when no draft exists', () => {
      expect(loadDraft()).toBeNull();
    });

    it('should return data for matching version', () => {
      const data = { name: 'test' };
      saveDraft(data);
      const loaded = loadDraft();
      expect(loaded).toEqual(data);
    });

    it('should return null for version mismatch', () => {
      store['me_wizard_draft'] = JSON.stringify({
        version: '999.0',
        timestamp: Date.now(),
        data: {},
      });
      expect(loadDraft()).toBeNull();
    });

    it('should handle corrupt data gracefully', () => {
      store['me_wizard_draft'] = 'not json';
      expect(loadDraft()).toBeNull();
    });
  });

  describe('clearDraft', () => {
    it('should remove the draft from localStorage', () => {
      saveDraft({ test: true });
      const result = clearDraft();
      expect(result).toBe(true);
      expect(store['me_wizard_draft']).toBeUndefined();
    });
  });

  describe('hasDraft', () => {
    it('should return false when no draft', () => {
      expect(hasDraft()).toBe(false);
    });

    it('should return true when draft exists', () => {
      saveDraft({ test: true });
      expect(hasDraft()).toBe(true);
    });
  });

  describe('getDraftTimestamp', () => {
    it('should return null when no draft', () => {
      expect(getDraftTimestamp()).toBeNull();
    });

    it('should return the timestamp of the saved draft', () => {
      const before = Date.now();
      saveDraft({ test: true });
      const after = Date.now();
      const ts = getDraftTimestamp();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });
  });
});
