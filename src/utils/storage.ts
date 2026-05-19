/**
 * 本地存储管理
 * 用于自动保存和恢复向导进度
 */

const STORAGE_KEY: string = 'me_wizard_draft';
const STORAGE_VERSION = '1.0';

export function saveDraft(data: Record<string, unknown>): boolean {
  try {
    const payload = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Failed to save draft:', error);
    return false;
  }
}

export function loadDraft(): Record<string, unknown> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const payload = JSON.parse(stored);
    
    // 版本检查
    if (payload.version !== STORAGE_VERSION) {
      console.warn('Draft version mismatch, ignoring old draft');
      return null;
    }
    
    return payload.data;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear draft:', error);
    return false;
  }
}

export function hasDraft() {
  return !!localStorage.getItem(STORAGE_KEY);
}

export function getDraftTimestamp() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const payload = JSON.parse(stored);
    return payload.timestamp;
  } catch {
    return null;
  }
}

// 防抖保存
export function debounceSave(data: Record<string, unknown>, delay: number = 1000): void {
  if (typeof window !== 'undefined' && window.debounceTimer) {
    clearTimeout(window.debounceTimer);
  }
  
  if (typeof window !== 'undefined') {
    window.debounceTimer = setTimeout(() => {
      saveDraft(data);
    }, delay);
  }
}
