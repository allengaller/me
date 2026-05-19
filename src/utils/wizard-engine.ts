/**
 * Wizard Engine — 共享向导状态管理与 UI 驱动
 *
 * 用法:
 *   import { createWizard } from './wizard-engine';
 *   const wizard = createWizard({ storageKey, questions, chapters, ... });
 *
 * 所有 DOM 元素通过 ID 映射，约定命名：
 *   progressFill, progressText, qaChapter, qaQuestion, qaHint,
 *   qaInput, qaShortcut, prevBtn, nextBtn, previewContent,
 *   exportModal, modalBackdrop, modalClose, exportArea,
 *   copyBtn, downloadBtn, modalWarn, resetBtn, resetModal,
 *   resetBackdrop, resetClose, resetCancel, resetConfirm
 */

/**
 * @typedef {Object} Question
 * @property {string} chapter
 * @property {string} question
 * @property {string} [hint]
 * @property {string} [placeholder]
 */

/**
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} title
 * @property {string} [titleZh]
 * @property {string} [icon]
 */

/**
 * @typedef {Object} WizardConfig
 * @property {string} storageKey       - localStorage key
 * @property {Question[]} questions    - question definitions
 * @property {Chapter[]} chapters      - chapter definitions
 * @property {function} generateExport - (answers) => string, generates export content
 * @property {string} [exportFilename] - default download filename
 * @property {string} [exportMime]     - MIME type for download
 * @property {function} [renderPreview] - custom preview renderer; default builds from chapters
 * @property {string} [emptyPreview]   - empty state text for preview
 */

const isMac = typeof navigator !== 'undefined'
  && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '\u2318' : 'Ctrl';

/**
 * Escape HTML special characters
 */
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

/**
 * Create a wizard instance
 * @param {WizardConfig} config
 */
export function createWizard(config) {
  const {
    storageKey,
    questions,
    chapters,
    generateExport,
    exportFilename = 'export.md',
    exportMime = 'text/markdown',
    renderPreview: customPreview,
    emptyPreview = 'Your content will appear here...',
  } = config;

  let current = 0;
  let answers = {};
  let exportTab = null; // for multi-tab exports

  // --- DOM refs ---
  const $ = (id) => document.getElementById(id);

  const els = {
    progressFill: $('progressFill'),
    progressText: $('progressText'),
    qaChapter: $('qaChapter'),
    qaQuestion: $('qaQuestion'),
    qaHint: $('qaHint'),
    qaInput: $('qaInput'),
    qaShortcut: $('qaShortcut'),
    prevBtn: $('prevBtn'),
    nextBtn: $('nextBtn'),
    previewContent: $('previewContent'),
    exportModal: $('exportModal'),
    modalBackdrop: $('modalBackdrop'),
    modalClose: $('modalClose'),
    exportArea: $('exportArea'),
    copyBtn: $('copyBtn'),
    downloadBtn: $('downloadBtn'),
    modalWarn: $('modalWarn'),
    resetBtn: $('resetBtn'),
    resetModal: $('resetModal'),
    resetBackdrop: $('resetBackdrop'),
    resetClose: $('resetClose'),
    resetCancel: $('resetCancel'),
    resetConfirm: $('resetConfirm'),
  };

  // --- State persistence ---
  function loadState() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const d = JSON.parse(raw);
        answers = d.answers || {};
        current = d.current || 0;
      }
    } catch { /* ignore corrupt data */ }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify({ answers, current }));
  }

  function clearState() {
    localStorage.removeItem(storageKey);
    current = 0;
    answers = {};
  }

  // --- Question helpers ---
  function getChapter(id) {
    return chapters.find((c) => c.id === id);
  }

  function getAnswer(i) {
    return (answers[i] || '').trim();
  }

  function hasAnswer(i) {
    return getAnswer(i).length > 0;
  }

  function answeredCount() {
    let n = 0;
    for (let i = 0; i < questions.length; i++) {
      if (hasAnswer(i)) n++;
    }
    return n;
  }

  // --- Rendering ---
  function renderQuestion() {
    const q = questions[current];
    const ch = getChapter(q.chapter);
    const label = ch.titleZh ? `${ch.title} / ${ch.titleZh}` : ch.title;

    els.qaChapter.textContent = label;
    els.qaQuestion.textContent = q.question;
    els.qaHint.textContent = q.hint || '';
    els.qaInput.placeholder = q.placeholder || '';
    els.qaInput.value = answers[current] || '';
    els.qaShortcut.textContent = `${modKey} + Enter`;

    els.progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
    els.progressText.textContent = `${current + 1} / ${questions.length}`;

    els.prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    els.nextBtn.innerHTML =
      current === questions.length - 1
        ? 'Finish <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
        : 'Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';

    renderPreview();
    els.qaInput.focus();
  }

  function renderPreview() {
    if (customPreview) {
      customPreview(els.previewContent, answers, questions, chapters, esc);
      return;
    }

    const parts = [];
    let lastCh = '';
    for (let i = 0; i < questions.length; i++) {
      const a = answers[i];
      if (!a || !a.trim()) continue;
      const q = questions[i];
      const ch = getChapter(q.chapter);
      if (q.chapter !== lastCh) {
        const icon = ch.icon || '';
        const label = icon ? `${icon} ${ch.title}` : ch.title;
        parts.push(`<h4 class="pv-chapter">${label}</h4>`);
        lastCh = q.chapter;
      }
      parts.push(`<p class="pv-paragraph">${esc(a.trim())}</p>`);
    }

    els.previewContent.innerHTML =
      parts.length === 0
        ? `<div class="preview-empty">${emptyPreview}</div>`
        : parts.join('');
    els.previewContent.scrollTop = els.previewContent.scrollHeight;
  }

  // --- Auto-save with debounce ---
  let debounceTimer;
  function saveAnswer() {
    answers[current] = els.qaInput.value;
    saveState();
    renderPreview();
  }

  function debouncedSave() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(saveAnswer, 400);
  }

  // --- Navigation ---
  function goNext() {
    saveAnswer();
    if (current < questions.length - 1) {
      current++;
      renderQuestion();
    } else {
      openExport();
    }
  }

  function goPrev() {
    if (current > 0) {
      saveAnswer();
      current--;
      renderQuestion();
    }
  }

  // --- Export ---
  function getExportContent() {
    return generateExport(answers, questions, chapters);
  }

  function openExport() {
    const content = getExportContent();
    els.exportArea.value = content;
    if (els.modalWarn) {
      els.modalWarn.style.display = answeredCount() === 0 ? 'block' : 'none';
    }
    els.exportModal.style.display = 'flex';
  }

  function closeExport() {
    els.exportModal.style.display = 'none';
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(els.exportArea.value).then(() => {
      els.copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        els.copyBtn.textContent = 'Copy to clipboard';
      }, 2000);
    });
  }

  function download() {
    const ext = exportFilename.split('.').pop();
    const blob = new Blob([els.exportArea.value], { type: exportMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Reset ---
  function openReset() {
    els.resetModal.style.display = 'flex';
  }

  function closeReset() {
    els.resetModal.style.display = 'none';
  }

  function confirmReset() {
    clearState();
    closeReset();
    renderQuestion();
  }

  // --- Event binding ---
  function bindEvents() {
    els.qaInput.addEventListener('input', debouncedSave);
    els.prevBtn.addEventListener('click', goPrev);
    els.nextBtn.addEventListener('click', goNext);

    document.addEventListener('keydown', (e) => {
      if (
        e.target === els.qaInput &&
        e.key === 'Enter' &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        goNext();
      }
    });

    // Export modal
    els.exportBtn = $('exportBtn');
    if (els.exportBtn) els.exportBtn.addEventListener('click', openExport);
    els.modalBackdrop.addEventListener('click', closeExport);
    els.modalClose.addEventListener('click', closeExport);
    els.copyBtn.addEventListener('click', copyToClipboard);
    els.downloadBtn.addEventListener('click', download);

    // Reset modal
    if (els.resetBtn) els.resetBtn.addEventListener('click', openReset);
    if (els.resetBackdrop) els.resetBackdrop.addEventListener('click', closeReset);
    if (els.resetClose) els.resetClose.addEventListener('click', closeReset);
    if (els.resetCancel) els.resetCancel.addEventListener('click', closeReset);
    if (els.resetConfirm) els.resetConfirm.addEventListener('click', confirmReset);
  }

  // --- Public API for multi-tab export ---
  function setExportTab(tab) {
    exportTab = tab;
  }

  function getExportTab() {
    return exportTab;
  }

  // --- Initialize ---
  function init() {
    loadState();
    if (current >= questions.length) current = 0;
    bindEvents();
    renderQuestion();
  }

  return {
    init,
    getState: () => ({ current, answers }),
    getAnswer,
    hasAnswer,
    answeredCount,
    openExport,
    closeExport,
    setExportTab,
    getExportTab,
    refreshPreview: renderPreview,
    getExportContent,
  };
}
