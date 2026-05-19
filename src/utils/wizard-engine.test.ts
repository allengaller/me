// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { esc, createWizard } from './wizard-engine';

describe('wizard-engine', () => {
  describe('esc', () => {
    it('should escape ampersands', () => {
      expect(esc('a & b')).toBe('a &amp; b');
    });

    it('should escape less-than and greater-than', () => {
      expect(esc('<div>test</div>')).toBe('&lt;div&gt;test&lt;/div&gt;');
    });

    it('should escape double quotes', () => {
      expect(esc('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(esc("it's")).toBe('it&#39;s');
    });

    it('should escape newlines to <br>', () => {
      expect(esc('line1\nline2')).toBe('line1<br>line2');
    });

    it('should handle all special characters combined', () => {
      const input = '<script>alert("xss & injection");\nalert(\'more\')</script>';
      const result = esc(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss &amp; injection&quot;);<br>alert(&#39;more&#39;)&lt;/script&gt;');
    });

    it('should convert non-string input to string', () => {
      expect(esc(42 as any)).toBe('42');
      expect(esc(null as any)).toBe('null');
      expect(esc(undefined as any)).toBe('undefined');
    });

    it('should return empty string for empty input', () => {
      expect(esc('')).toBe('');
    });

    it('should handle strings with no special characters', () => {
      expect(esc('hello world')).toBe('hello world');
    });
  });

  describe('createWizard', () => {
    // Helper to create mock DOM elements
    function createMockElement() {
      return {
        textContent: '',
        innerHTML: '',
        value: '',
        placeholder: '',
        style: { visibility: '', display: '' },
        addEventListener: vi.fn(),
        focus: vi.fn(),
        click: vi.fn(),
      };
    }

    function createMockDocument() {
      const elements: Record<string, any> = {};
      const elementIds = [
        'progressFill', 'progressText', 'qaChapter', 'qaQuestion', 'qaHint',
        'qaInput', 'qaShortcut', 'prevBtn', 'nextBtn', 'previewContent',
        'exportModal', 'modalBackdrop', 'modalClose', 'exportArea',
        'copyBtn', 'downloadBtn', 'modalWarn', 'resetBtn', 'resetModal',
        'resetBackdrop', 'resetClose', 'resetCancel', 'resetConfirm', 'exportBtn',
      ];
      elementIds.forEach((id) => {
        elements[id] = createMockElement();
      });
      // Make progressFill.style.width writable
      elements.progressFill.style = {};
      vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
        return elements[id] || null;
      });
      return elements;
    }

    const sampleQuestions = [
      { chapter: 'identity', question: 'What is your name?', hint: 'Your full name', placeholder: 'John Doe' },
      { chapter: 'identity', question: 'What do you do?', hint: 'Your role', placeholder: 'Engineer' },
      { chapter: 'connect', question: 'Your website?', hint: 'URL', placeholder: 'https://...' },
    ];

    const sampleChapters = [
      { id: 'identity', title: 'Identity', titleZh: '身份', icon: '🎯' },
      { id: 'connect', title: 'Connect', titleZh: '联系', icon: '🔗' },
    ];

    const sampleConfig = {
      storageKey: 'test_wizard',
      questions: sampleQuestions,
      chapters: sampleChapters,
      generateExport: vi.fn(() => 'exported content'),
      exportFilename: 'test.md',
      exportMime: 'text/markdown',
    };

    let mockLocalStorage: Record<string, string>;
    let elements: Record<string, any>;

    beforeEach(() => {
      mockLocalStorage = {};
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => mockLocalStorage[key] ?? null);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => { mockLocalStorage[key] = value; });
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => { delete mockLocalStorage[key]; });
      elements = createMockDocument();
      vi.useFakeTimers();
    });

    it('should create a wizard with expected public API', () => {
      const wizard = createWizard(sampleConfig);
      expect(wizard).toHaveProperty('init');
      expect(wizard).toHaveProperty('getState');
      expect(wizard).toHaveProperty('getAnswer');
      expect(wizard).toHaveProperty('hasAnswer');
      expect(wizard).toHaveProperty('answeredCount');
      expect(wizard).toHaveProperty('openExport');
      expect(wizard).toHaveProperty('closeExport');
      expect(wizard).toHaveProperty('setExportTab');
      expect(wizard).toHaveProperty('getExportTab');
      expect(wizard).toHaveProperty('refreshPreview');
      expect(wizard).toHaveProperty('getExportContent');
    });

    it('should initialize with default state', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      const state = wizard.getState();
      expect(state.current).toBe(0);
      expect(state.answers).toEqual({});
    });

    it('should count 0 answered questions initially', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      expect(wizard.answeredCount()).toBe(0);
      expect(wizard.hasAnswer(0)).toBe(false);
    });

    it('should return empty string for unanswered questions', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      expect(wizard.getAnswer(0)).toBe('');
    });

    it('should return null for export tab initially', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      expect(wizard.getExportTab()).toBeNull();
    });

    it('should set and get export tab', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      wizard.setExportTab('markdown');
      expect(wizard.getExportTab()).toBe('markdown');
    });

    it('should call generateExport when getExportContent is called', () => {
      const generateExport = vi.fn(() => 'test output');
      const wizard = createWizard({ ...sampleConfig, generateExport });
      wizard.init();
      const content = wizard.getExportContent();
      expect(generateExport).toHaveBeenCalled();
      expect(content).toBe('test output');
    });

    it('should expose getAnswer for reading stored answers', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      // Before any user input, answers should be empty
      expect(wizard.getAnswer(0)).toBe('');
      expect(wizard.hasAnswer(0)).toBe(false);
    });

    it('should handle corrupt localStorage data gracefully', () => {
      mockLocalStorage['test_wizard'] = 'not valid json{{{';
      const wizard = createWizard(sampleConfig);
      wizard.init();
      const state = wizard.getState();
      expect(state.current).toBe(0);
      expect(state.answers).toEqual({});
    });

    it('should set display flex on export modal when openExport is called', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      wizard.openExport();
      expect(elements.exportModal.style.display).toBe('flex');
    });

    it('should set display none on export modal when closeExport is called', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      wizard.openExport();
      wizard.closeExport();
      expect(elements.exportModal.style.display).toBe('none');
    });

    it('should render the first question on init', () => {
      const wizard = createWizard(sampleConfig);
      wizard.init();
      expect(elements.qaChapter.textContent).toContain('Identity');
      expect(elements.qaQuestion.textContent).toBe('What is your name?');
      expect(elements.qaHint.textContent).toBe('Your full name');
    });
  });
});
