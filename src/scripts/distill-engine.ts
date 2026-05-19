/**
 * Distill Engine — Self-Distillation wizard logic
 *
 * Extracts all JavaScript from distill.astro into a standalone module
 * using the shared wizard-engine.js.
 */

import { createWizard, esc } from '../utils/wizard-engine';

// --- Chapter definitions ---
export const CHAPTERS = [
  { id: 'identity', title: 'Identity' },
  { id: 'models', title: 'Mental Models' },
  { id: 'decisions', title: 'Decisions' },
  { id: 'expression', title: 'Expression DNA' },
  { id: 'anti', title: 'Anti-patterns' },
  { id: 'boundaries', title: 'Boundaries' },
];

// --- Question definitions (12 questions) ---
export const QUESTIONS = [
  { chapter: 'identity', question: 'Introduce yourself -- who are you, what do you do, what drives you?', hint: 'This becomes your identity card.', placeholder: 'e.g. I am a backend engineer who believes code should be boring and infrastructure should be invisible...' },
  { chapter: 'models', question: "What thinking framework do you keep coming back to? When you face a new problem, what's your first instinct?", hint: 'Your go-to mental model.', placeholder: 'e.g. I always start from first principles. I strip away assumptions and rebuild from the ground up...' },
  { chapter: 'models', question: "What's a belief that shows up everywhere in your life, not just work?", hint: 'A recurring pattern across domains.', placeholder: 'e.g. I believe simplicity is the ultimate sophistication. I apply this to code, writing, even how I pack for trips...' },
  { chapter: 'models', question: 'What do most people consider obvious that you disagree with?', hint: 'Your contrarian edge.', placeholder: 'e.g. Most people think more tools = more productivity. I think the opposite -- fewer tools force clearer thinking...' },
  { chapter: 'decisions', question: "When you're torn between two options, how do you decide?", hint: 'Your decision heuristic.', placeholder: "e.g. I ask myself: which option would I regret NOT taking? That usually surfaces the real priority..." },
  { chapter: 'decisions', question: "Describe a quick decision that turned out well. What was your gut telling you?", hint: 'A decision pattern that works for you.', placeholder: 'e.g. I once chose a smaller team over a bigger budget. My gut said people matter more than resources...' },
  { chapter: 'decisions', question: "What's a decision rule you always follow, even when it's inconvenient?", hint: 'Your non-negotiable principle.', placeholder: "e.g. Never commit to something on the same day it's proposed. Sleep on it, then decide..." },
  { chapter: 'expression', question: "How would your closest friends describe the way you talk? What phrases do you use a lot?", hint: 'Your expression DNA -- tone, rhythm, patterns.', placeholder: 'e.g. I tend to be direct and use analogies. I say "let me push back on that" a lot...' },
  { chapter: 'anti', question: "What's something you see others do that you would absolutely never do?", hint: 'Your anti-patterns -- behaviors you reject.', placeholder: 'e.g. I would never optimize for short-term metrics at the cost of long-term trust...' },
  { chapter: 'anti', question: 'What did you used to value but no longer do? What changed?', hint: 'A value you abandoned -- reveals evolution.', placeholder: "e.g. I used to think being busy was a sign of importance. Now I think it's a sign of bad priorities..." },
  { chapter: 'boundaries', question: 'What are you genuinely not good at, even though people might expect you to be?', hint: 'Honest self-assessment.', placeholder: 'e.g. I am terrible at small talk and networking events, despite being a people person in small groups...' },
  { chapter: 'boundaries', question: 'If you could give your younger self one piece of advice about thinking, what would it be?', hint: 'Your distilled wisdom.', placeholder: "e.g. Don't wait for certainty. You learn more from doing the wrong thing confidently than from analyzing forever..." },
];

// --- Generate SKILL.md content ---
export function generateSKILL(answers, questions, chapters) {
  const a = i => (answers[i] || '').trim();
  const has = i => a(i).length > 0;

  const identity = a(0);
  const name = identity.split(/[.,\uff0c\u3002]/)[0].trim() || 'You';
  const now = new Date().toISOString().split('T')[0];

  const L = [];

  L.push('---');
  L.push(`name: me-perspective`);
  L.push('description: |');
  L.push(`  ${name}'s cognitive operating system.`);
  L.push(`  Self-distilled thinking framework: mental models, decision heuristics,`);
  L.push(`  expression DNA, anti-patterns, and honest boundaries.`);
  L.push(`trigger:`);
  L.push(`  - "think like me"`);
  L.push(`  - "how would I approach"`);
  L.push(`  - "my perspective on"`);
  L.push(`  - "what would I decide"`);
  L.push('---');
  L.push('');

  L.push(`# ${name} -- Cognitive Operating System`);
  L.push('');

  if (has(2)) L.push(`> ${a(2)}`);
  else if (identity) L.push(`> ${identity}`);
  else L.push('> A mind distilled into words.');
  L.push('');

  L.push('## Identity');
  L.push('');
  if (identity) {
    L.push(identity);
    L.push('');
  }

  L.push('## Mental Models');
  L.push('');
  if (has(1)) {
    L.push('### Primary Framework');
    L.push('');
    L.push(a(1));
    L.push('');
  }
  if (has(2)) {
    L.push('### Core Belief (Cross-Domain)');
    L.push('');
    L.push(a(2));
    L.push('');
  }
  if (has(3)) {
    L.push('### Contrarian Edge');
    L.push('');
    L.push(a(3));
    L.push('');
  }

  L.push('## Decision Heuristics');
  L.push('');
  if (has(4)) {
    L.push('### Tiebreaker Rule');
    L.push('');
    L.push(a(4));
    L.push('');
  }
  if (has(5)) {
    L.push('### Pattern Recognition');
    L.push('');
    L.push(`**Case**: ${a(5)}`);
    L.push('');
  }
  if (has(6)) {
    L.push('### Non-Negotiable');
    L.push('');
    L.push(a(6));
    L.push('');
  }

  L.push('## Expression DNA');
  L.push('');
  if (has(7)) L.push(a(7), '');

  L.push('## Anti-patterns');
  L.push('');
  if (has(8)) {
    L.push('### Absolute Never');
    L.push('');
    L.push(a(8));
    L.push('');
  }
  if (has(9)) {
    L.push('### Abandoned Value');
    L.push('');
    L.push(a(9));
    L.push('');
  }

  L.push('## Honest Boundaries');
  L.push('');
  if (has(10)) {
    L.push('### Known Weakness');
    L.push('');
    L.push(a(10));
    L.push('');
  }
  if (has(11)) {
    L.push('### Distilled Wisdom');
    L.push('');
    L.push(a(11));
    L.push('');
  }

  L.push('---');
  L.push('');
  L.push(`*Self-distilled ${now} via [ME](https://github.com/allengaller/me). Inspired by [Nuwa](https://github.com/alchaincyf/nuwa-skill).*`);

  return L.join('\n');
}

// --- Custom preview renderer ---
function renderDistillPreview(previewContent, answers, questions, chapters, escFn) {
  const parts = [];
  let lastCh = '';
  for (let i = 0; i < questions.length; i++) {
    const a = answers[i];
    if (!a || !a.trim()) continue;
    const q = questions[i];
    const ch = chapters.find(c => c.id === q.chapter);
    if (q.chapter !== lastCh) {
      parts.push(`<h4 class="pv-chapter">${ch.title}</h4>`);
      lastCh = q.chapter;
    }
    parts.push(`<p class="pv-paragraph">${escFn(a.trim())}</p>`);
  }
  previewContent.innerHTML = parts.length === 0
    ? '<div class="preview-empty">Your SKILL.md will take shape here as you answer...</div>'
    : parts.join('');
  previewContent.scrollTop = previewContent.scrollHeight;
}

// --- Initialize wizard ---
const wizard = createWizard({
  storageKey: 'me_distill',
  questions: QUESTIONS,
  chapters: CHAPTERS,
  generateExport: generateSKILL,
  exportFilename: 'SKILL.md',
  exportMime: 'text/markdown',
  renderPreview: renderDistillPreview,
  emptyPreview: 'Your SKILL.md will take shape here as you answer...',
});

wizard.init();
