/**
 * Reliable Engine — "靠谱模式" wizard logic
 *
 * Extracts all JavaScript from reliable.astro into a standalone module
 * using the shared wizard-engine.js.
 */

import { createWizard, esc } from '../utils/wizard-engine';

// --- Chapter definitions ---
export const CHAPTERS = [
  { id: 'identity', title: 'Self-Identity', titleZh: '\u81EA\u6211\u8BA4\u77E5', icon: '\u{1F3AF}' },
  { id: 'sociology', title: 'Sociology', titleZh: '\u793E\u4F1A\u5B66\u89C6\u89D2', icon: '\u{1F310}' },
  { id: 'psychology', title: 'Psychology', titleZh: '\u5FC3\u7406\u5B66\u89C6\u89D2', icon: '\u{1F9E0}' },
  { id: 'management', title: 'Management', titleZh: '\u7BA1\u7406\u5B66\u89C6\u89D2', icon: '\u{1F4CA}' },
  { id: 'evidence', title: 'Evidence', titleZh: '\u884C\u4E3A\u8BC1\u636E', icon: '\u{1F3AF}' },
  { id: 'philosophy', title: 'Philosophy', titleZh: '\u9760\u8C31\u54F2\u5B66', icon: '\u{2728}' },
];

// --- Question definitions (18 questions) ---
export const QUESTIONS = [
  { chapter: 'identity', question: '\u4F60\u662F\u8C01\uFF1F\u8BF7\u7528\u4E00\u53E5\u8BDD\u4ECB\u7ECD\u81EA\u5DF1\u7684\u6838\u5FC3\u8EAB\u4EFD\uFF0C\u5305\u62EC\u540D\u5B57\u3001\u804C\u4E1A\u548C\u6700\u91CD\u8981\u7684\u4E00\u4E2A\u6807\u7B7E\u3002', hint: 'This becomes the hero of your homepage.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u662F\u5F20\u4F1F\uFF0C\u4E00\u4E2A\u76F8\u4FE1\u201C\u8BF4\u5230\u505A\u5230\u201D\u6BD4\u4EFB\u4F55\u6280\u672F\u90FD\u91CD\u8981\u7684\u540E\u7AEF\u5DE5\u7A0B\u5E08...' },
  { chapter: 'identity', question: '\u4F60\u5982\u4F55\u5B9A\u4E49\u201C\u9760\u8C31\u201D\uFF1F\u5728\u4F60\u7684\u4E16\u754C\u89C2\u91CC\uFF0C\u4EC0\u4E48\u53EB\u505A\u9760\u8C31\u7684\u4EBA\uFF1F', hint: 'Your personal definition of reliability.', placeholder: '\u4F8B\u5982\uFF1A\u9760\u8C31\u4E0D\u662F\u4E0D\u72AF\u9519\uFF0C\u800C\u662F\u72AF\u4E86\u9519\u80FD\u7AD9\u51FA\u6765\u8D1F\u8D23\u3001\u4E0D\u7528\u522B\u4EBA\u64E6\u5C3E\u5DF4...' },
  { chapter: 'identity', question: '\u4F60\u8EAB\u8FB9\u7684\u4EBA\u4F1A\u600E\u4E48\u63CF\u8FF0\u4F60\u7684\u6027\u683C\uFF1F\u4F60\u5DF2\u7ECF\u5EFA\u7ACB\u4E86\u600E\u6837\u7684\u53E3\u7891\uFF1F', hint: 'Social proof -- how others see your reliability.', placeholder: '\u4F8B\u5982\uFF1A\u540C\u4E8B\u8BF4\u6211\u662F\u201C\u5B9A\u6D77\u795E\u9488\u201D\uFF0C\u53EA\u8981\u4EA4\u7ED9\u6211\u7684\u4E8B\u60C5\u5C31\u4E0D\u4F1A\u6389\u94FE\u5B50...' },
  { chapter: 'sociology', question: '\u4F60\u5982\u4F55\u5728\u793E\u4F1A\u5173\u7CFB\u4E2D\u5EFA\u7ACB\u548C\u7EF4\u62A4\u4FE1\u4EFB\uFF1F\u4F60\u7684\u4FE1\u4EFB\u6784\u5EFA\u7B56\u7565\u662F\u4EC0\u4E48\uFF1F', hint: 'Social capital theory perspective.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u76F8\u4FE1\u4FE1\u4EFB\u662F\u4E00\u7B14\u4E00\u7B14\u5B58\u8D77\u6765\u7684\u3002\u6211\u6BCF\u6B21\u7B54\u5E94\u7684\u4E8B\u60C5\uFF0C\u54EA\u6015\u518D\u5C0F\uFF0C\u4E5F\u4F1A\u505A\u5230...' },
  { chapter: 'sociology', question: '\u5728\u56E2\u961F\u4E2D\u4F60\u81EA\u7136\u627F\u62C5\u4EC0\u4E48\u89D2\u8272\uFF1F\u5F53\u591A\u4EBA\u534F\u4F5C\u65F6\uFF0C\u4F60\u662F\u5982\u4F55\u4FDD\u8BC1\u96C6\u4F53\u53EF\u9760\u6027\u7684\uFF1F', hint: 'Team dynamics and collective reliability.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u901A\u5E38\u662F\u90A3\u4E2A\u201C\u6700\u540E\u5173\u201D\u7684\u4EBA\u3002\u522B\u4EBA\u63D0\u65B0\u60F3\u6CD5\uFF0C\u6211\u8D1F\u8D23\u8BA9\u5B83\u843D\u5730...' },
  { chapter: 'sociology', question: '\u5F53\u4F60\u65E0\u6CD5\u5151\u73B0\u627F\u8BFA\u65F6\uFF0C\u4F60\u4F1A\u600E\u4E48\u5904\u7406\uFF1F\u4F60\u7684\u8865\u6551\u673A\u5236\u662F\u4EC0\u4E48\uFF1F', hint: 'Trust repair and accountability.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u4F1A\u7B2C\u4E00\u65F6\u95F4\u544A\u77E5\u76F8\u5173\u4EBA\uFF0C\u8BF4\u660E\u539F\u56E0\uFF0C\u63D0\u51FA\u66FF\u4EE3\u65B9\u6848\uFF0C\u800C\u4E0D\u662F\u7B49\u522B\u4EBA\u53D1\u73B0...' },
  { chapter: 'psychology', question: '\u662F\u4EC0\u4E48\u5185\u5728\u52A8\u529B\u9A71\u52A8\u4F60\u59CB\u7EC8\u5982\u4E00\u5730\u5151\u73B0\u627F\u8BFA\uFF1F\u4F60\u7684\u8D23\u4EFB\u611F\u6765\u6E90\u4E8E\u54EA\u91CC\uFF1F', hint: 'Intrinsic motivation and conscientiousness.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u8BA4\u4E3A\u6BCF\u4E00\u6B21\u8BF4\u5230\u505A\u5230\u90FD\u662F\u5728\u5B58\u6B3E\u2014\u2014\u5B58\u7684\u662F\u522B\u4EBA\u5BF9\u6211\u7684\u4FE1\u4EFB...' },
  { chapter: 'psychology', question: '\u5728\u9AD8\u538B\u529B\u73AF\u5883\u4E0B\uFF0C\u4F60\u5982\u4F55\u4FDD\u6301\u7A33\u5B9A\u8F93\u51FA\u800C\u4E0D\u964D\u4F4E\u8D28\u91CF\uFF1F\u4F60\u7684\u60C5\u7EEA\u7BA1\u7406\u7B56\u7565\u662F\u4EC0\u4E48\uFF1F', hint: 'Emotional regulation under pressure.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u4F1A\u5148\u62C6\u89E3\u95EE\u9898\uFF0C\u5217\u51FA\u6700\u5DEE\u60C5\u51B5\uFF0C\u7136\u540E\u4ECE\u6700\u5DEE\u60C5\u51B5\u5F80\u4E0A\u89E3\u51B3\u3002\u8FD9\u6837\u5FC3\u91CC\u6709\u5E95\uFF0C\u624B\u4E0A\u4E0D\u614C...' },
  { chapter: 'psychology', question: '\u9762\u5BF9\u4E0D\u786E\u5B9A\u6027\u65F6\uFF0C\u4F60\u5982\u4F55\u505A\u51FA\u522B\u4EBA\u53EF\u4EE5\u4F9D\u8D56\u7684\u51B3\u7B56\uFF1F', hint: 'Decision-making under uncertainty.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u7528\u201C70%\u786E\u5B9A\u5C31\u884C\u52A8\u201D\u539F\u5219\u3002\u4E0D\u6C42\u5341\u5168\u5341\u7F8E\uFF0C\u4F46\u6C42\u6BCF\u4E00\u6B65\u90FD\u6709\u6839\u636E...' },
  { chapter: 'management', question: '\u4F60\u5982\u4F55\u786E\u4FDD\u9879\u76EE\u51C6\u65F6\u9AD8\u8D28\u91CF\u4EA4\u4ED8\uFF1F\u4F60\u7684\u4EA4\u4ED8\u6846\u67B6\u662F\u4EC0\u4E48\uFF1F', hint: 'Delivery management and execution.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u7528\u201C\u53CC\u5468\u671F\u201D\u7BA1\u7406\u6CD5\uFF0C\u5185\u5468\u671F\u662F\u81EA\u5DF1\u7684\u5B89\u5168\u8FB9\u9645\uFF0C\u5916\u5468\u671F\u662F\u627F\u8BFA\u7ED9\u522B\u4EBA\u7684\u65F6\u95F4...' },
  { chapter: 'management', question: '\u4F60\u5982\u4F55\u5411\u522B\u4EBA\u6C9F\u901A\u8FDB\u5EA6\u548C\u98CE\u9669\uFF1F\u4F60\u7684\u900F\u660E\u5EA6\u539F\u5219\u662F\u4EC0\u4E48\uFF1F', hint: 'Communication and transparency in management.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u575A\u6301\u201C\u574F\u6D88\u606F\u65E9\u8BF4\u201D\u539F\u5219\u3002\u95EE\u9898\u4E0D\u4F1A\u56E0\u4E3A\u85CF\u7740\u800C\u6D88\u5931\uFF0C\u53EA\u4F1A\u8D8A\u6765\u8D8A\u5927...' },
  { chapter: 'management', question: '\u4F60\u5982\u4F55\u5E26\u9886\u522B\u4EBA\u53D8\u5F97\u66F4\u9760\u8C31\uFF1F\u4F60\u4F1A\u5EFA\u7ACB\u600E\u6837\u7684\u7CFB\u7EDF\u548C\u673A\u5236\uFF1F', hint: 'Building reliable systems and mentoring.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u4F1A\u628A\u201C\u5982\u4F55\u505A\u5230\u9760\u8C31\u201D\u5199\u6210SOP\uFF0C\u8BA9\u56E2\u961F\u6BCF\u4E2A\u4EBA\u90FD\u80FD\u590D\u5236\u8FD9\u79CD\u80FD\u529B...' },
  { chapter: 'evidence', question: '\u8BF7\u8BB2\u4E00\u4E2A\u4F60\u7684\u9760\u8C31\u8D77\u5230\u5173\u952E\u4F5C\u7528\u7684\u6545\u4E8B\u3002\u5F53\u65F6\u53D1\u751F\u4E86\u4EC0\u4E48\uFF1F', hint: 'A concrete story that proves your reliability.', placeholder: '\u4F8B\u5982\uFF1A\u4E00\u6B21\u7EBF\u4E0A\u6545\u969C\uFF0C\u51CC\u6668\u4E09\u70B9\u6211\u7B2C\u4E00\u4E2A\u5230\u573A\uFF0C\u72EC\u81EA\u62A2\u4FEE\u5230\u65E9\u4E0A\u4E03\u70B9\u6062\u590D\u670D\u52A1...' },
  { chapter: 'evidence', question: '\u63CF\u8FF0\u4E00\u6B21\u9760\u8C31\u5F88\u96BE\u4F46\u4F60\u4ECD\u7136\u505A\u5230\u7684\u7ECF\u5386\u3002\u4EC0\u4E48\u652F\u6491\u4F60\u575A\u6301\u4E0B\u6765\uFF1F', hint: 'Reliability under extreme difficulty.', placeholder: '\u4F8B\u5982\uFF1A\u5BA2\u6237\u4E34\u65F6\u53D8\u66F4\u9700\u6C42\uFF0C\u622A\u6B62\u65F6\u95F4\u6CA1\u53D8\u3002\u6211\u8FDE\u7EED\u4E09\u5929\u52A0\u73ED\u5230\u51CC\u6668\uFF0C\u4F46\u6700\u7EC8\u6309\u65F6\u4EA4\u4ED8\u4E86\u65E0\u7F3A\u9677\u7684\u4EA7\u54C1...' },
  { chapter: 'evidence', question: '\u4F60\u6709\u54EA\u4E9B\u575A\u6301\u4E86\u5F88\u591A\u5E74\u7684\u4E60\u60EF\u6216\u627F\u8BFA\uFF0C\u8BC1\u660E\u4F60\u7684\u957F\u671F\u53EF\u9760\u6027\uFF1F', hint: 'Long-term consistency as evidence.', placeholder: '\u4F8B\u5982\uFF1A\u6211\u5DF2\u7ECF\u8FDE\u7EED10\u5E74\u6BCF\u5468\u5199\u6280\u672F\u535A\u5BA2\uFF0C\u4ECE\u672A\u65AD\u66F4\u3002\u8FD9\u4E0D\u662F\u7EA6\u675F\uFF0C\u662F\u5BF9\u81EA\u5DF1\u7684\u627F\u8BFA...' },
  { chapter: 'philosophy', question: '\u7528\u4E00\u53E5\u8BDD\u6982\u62EC\u4F60\u7684\u201C\u9760\u8C31\u54F2\u5B66\u201D\u3002\u5982\u679C\u53EA\u80FD\u7559\u4E00\u53E5\u8BDD\u7ED9\u4E16\u754C\uFF0C\u4F60\u4F1A\u8BF4\u4EC0\u4E48\uFF1F', hint: 'Your distilled reliability philosophy.', placeholder: '\u4F8B\u5982\uFF1A\u9760\u8C31\u4E0D\u662F\u80FD\u529B\uFF0C\u662F\u9009\u62E9\u3002\u6BCF\u4E00\u6B21\u9009\u62E9\u8D1F\u8D23\uFF0C\u5C31\u662F\u5728\u5B9A\u4E49\u4F60\u662F\u8C01...' },
  { chapter: 'philosophy', question: '\u5982\u679C\u8981\u7ED9\u60F3\u53D8\u5F97\u66F4\u9760\u8C31\u7684\u4EBA\u4E00\u4E2A\u5EFA\u8BAE\uFF0C\u4F60\u4F1A\u8BF4\u4EC0\u4E48\uFF1F', hint: 'Your mentorship on reliability.', placeholder: '\u4F8B\u5982\uFF1A\u5148\u5B66\u4F1A\u5BF9\u81EA\u5DF1\u9760\u8C31\u3002\u8FDE\u81EA\u5DF1\u7684\u627F\u8BFA\u90FD\u505A\u4E0D\u5230\u7684\u4EBA\uFF0C\u522B\u4EBA\u4E0D\u53EF\u80FD\u4FE1\u4EFB\u4F60...' },
  { chapter: 'philosophy', question: '\u56DE\u671B\u4F60\u7684\u4EBA\u751F\u8F68\u8FF9\uFF0C\u201C\u9760\u8C31\u201D\u8FD9\u4E2A\u7279\u8D28\u5982\u4F55\u5851\u9020\u4E86\u4F60\u7684\u8DEF\u5F84\uFF1F', hint: 'Life trajectory shaped by reliability.', placeholder: '\u4F8B\u5982\uFF1A\u6BCF\u4E00\u6B21\u5347\u804C\u3001\u6BCF\u4E00\u4E2A\u673A\u4F1A\uFF0C\u90FD\u4E0D\u662F\u56E0\u4E3A\u6211\u6700\u806A\u660E\uFF0C\u800C\u662F\u56E0\u4E3A\u6211\u6700\u53EF\u4EE5\u88AB\u4FE1\u4EFB...' },
];

// --- Helper ---
const a = (answers, i) => (answers[i] || '').trim();
const has = (answers, i) => a(answers, i).length > 0;

// --- Generate standalone HTML homepage ---
export function generateHTML(answers) {
  const identity = a(answers, 0);
  const name = identity.split(/[,.\\uff0c\\u3002]/)[0].trim() || 'Your Name';
  const tagline = a(answers, 1);
  const reputation = a(answers, 2);
  const sociTrust = a(answers, 3);
  const sociTeam = a(answers, 4);
  const sociCommit = a(answers, 5);
  const psyMotivation = a(answers, 6);
  const psyStress = a(answers, 7);
  const psyDecision = a(answers, 8);
  const mgmtDelivery = a(answers, 9);
  const mgmtComm = a(answers, 10);
  const mgmtMentor = a(answers, 11);
  const evStory = a(answers, 12);
  const evHard = a(answers, 13);
  const evLong = a(answers, 14);
  const philosophy = a(answers, 15);
  const advice = a(answers, 16);
  const trajectory = a(answers, 17);

  const section = (icon, label, cards) => {
    const filled = cards.filter(Boolean);
    if (filled.length === 0) return '';
    return `\n  <section>\n    <div class="section-label">${icon} ${label}</div>\n    <div class="dimensions">${filled.join('')}</div>\n  </section>`;
  };

  const dimCard = (title, content) => content
    ? `<div class="dim-card"><h3>${esc(title)}</h3><p>${esc(content)}</p></div>`
    : '';

  const tlItem = (title, content) => content
    ? `<div class="tl-item"><h4>${esc(title)}</h4><p>${esc(content)}</p></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(name)} - Reliable</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0a0b;--bg-card:#131316;--bg-card-hover:#1a1a1f;
  --border:#1f1f25;--border-accent:#2a2a35;
  --text:#e8e6e3;--text-secondary:#9a9a9e;--text-muted:#5a5a60;
  --accent:#c9a962;--accent-dim:rgba(201,169,98,0.08);--accent-border:rgba(201,169,98,0.2);
  --font-serif:'Noto Serif SC',Georgia,serif;
  --font-sans:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono','Fira Code',monospace;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--font-sans);line-height:1.7;-webkit-font-smoothing:antialiased}
::selection{background:var(--accent);color:var(--bg)}
a{color:var(--accent);text-decoration:none}
.page{max-width:860px;margin:0 auto;padding:0 2rem}
header.page-header{padding:8rem 0 4rem;text-align:center;position:relative}
header.page-header::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:60px;height:1px;background:var(--accent)}
.badge{display:inline-block;font-family:var(--font-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.2em;color:var(--accent);border:1px solid var(--accent-border);padding:0.3rem 0.8rem;border-radius:2px;margin-bottom:2rem}
h1.hero-name{font-family:var(--font-serif);font-size:clamp(2rem,5vw,3.5rem);font-weight:700;color:var(--text);letter-spacing:0.04em;margin-bottom:0.75rem}
.tagline{font-size:1.05rem;color:var(--text-secondary);max-width:560px;margin:0 auto 2rem;line-height:1.8;font-style:italic}
.philosophy-quote{font-family:var(--font-serif);font-size:1.2rem;color:var(--accent);font-style:italic;max-width:500px;margin:0 auto;padding:1.5rem 2rem;border-left:2px solid var(--accent-border)}
section{padding:3rem 0}
section+section{border-top:1px solid var(--border)}
.section-label{font-family:var(--font-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.18em;color:var(--accent);margin-bottom:1.5rem;display:flex;align-items:center;gap:0.6rem}
.section-label::after{content:'';flex:1;height:1px;background:var(--border)}
.dimensions{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.dim-card{background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:1.5rem;transition:border-color 0.3s}
.dim-card:hover{border-color:var(--border-accent)}
.dim-card h3{font-family:var(--font-serif);font-size:1rem;color:var(--text);margin-bottom:0.5rem}
.dim-card p{font-size:0.88rem;color:var(--text-secondary);line-height:1.75}
.timeline{position:relative;padding-left:2rem}
.timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--border)}
.tl-item{position:relative;margin-bottom:2rem;padding-left:1.5rem}
.tl-item::before{content:'';position:absolute;left:-2rem;top:0.5rem;width:7px;height:7px;border-radius:50%;background:var(--accent);transform:translateX(-3px)}
.tl-item h4{font-family:var(--font-serif);font-size:0.95rem;color:var(--text);margin-bottom:0.3rem}
.tl-item p{font-size:0.88rem;color:var(--text-secondary);line-height:1.75}
.reputation-box{background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:2rem;text-align:center}
.reputation-box blockquote{font-family:var(--font-serif);font-size:1.1rem;color:var(--text);font-style:italic;line-height:1.7;margin-bottom:0.75rem}
.reputation-box cite{font-size:0.8rem;color:var(--text-muted);font-style:normal}
.advice-section{background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:6px;padding:2rem}
.advice-section h3{font-family:var(--font-serif);font-size:1.1rem;color:var(--accent);margin-bottom:0.75rem}
.advice-section p{font-size:0.9rem;color:var(--text-secondary);line-height:1.8}
footer{text-align:center;padding:4rem 0 3rem;color:var(--text-muted);font-size:0.75rem;font-family:var(--font-mono);letter-spacing:0.05em}
footer span{color:var(--accent)}
@media(max-width:640px){
  .dimensions{grid-template-columns:1fr}
  header.page-header{padding:5rem 0 3rem}
}
</style>
</head>
<body>
<div class="page">
  <header class="page-header">
    <div class="badge">Reliable / \u9760\u8C31</div>${identity ? `
    <h1 class="hero-name">${esc(identity)}</h1>` : ''}
    ${tagline ? `<p class="tagline">${esc(tagline)}</p>` : ''}
    ${philosophy ? `<blockquote class="philosophy-quote">\u201C${esc(philosophy)}\u201D</blockquote>` : ''}
  </header>
${section('\u{1F310}', 'Sociology / \u793E\u4F1A\u5B66\u89C6\u89D2', [
  dimCard('\u4FE1\u4EFB\u6784\u5EFA', sociTrust),
  dimCard('\u56E2\u961F\u89D2\u8272', sociTeam),
  dimCard('\u627F\u8BFA\u7BA1\u7406', sociCommit),
])}
${section('\u{1F9E0}', 'Psychology / \u5FC3\u7406\u5B66\u89C6\u89D2', [
  dimCard('\u5185\u5728\u52A8\u529B', psyMotivation),
  dimCard('\u538B\u529B\u7BA1\u7406', psyStress),
  dimCard('\u51B3\u7B56\u53EF\u9760\u6027', psyDecision),
])}
${section('\u{1F4CA}', 'Management / \u7BA1\u7406\u5B66\u89C6\u89D2', [
  dimCard('\u4EA4\u4ED8\u6846\u67B6', mgmtDelivery),
  dimCard('\u900F\u660E\u6C9F\u901A', mgmtComm),
  dimCard('\u590D\u5236\u9760\u8C31', mgmtMentor),
])}
${evStory || evHard || evLong ? `
  <section>
    <div class="section-label">\u{1F3AF} Evidence / \u884C\u4E3A\u8BC1\u636E</div>
    <div class="timeline">${tlItem('\u5173\u952E\u65F6\u523B', evStory)}${tlItem('\u56F0\u96BE\u575A\u5B88', evHard)}${tlItem('\u957F\u671F\u575A\u6301', evLong)}</div>
  </section>` : ''}${reputation ? `
  <section>
    <div class="section-label">\u{1F4AC} Reputation / \u53E3\u7891</div>
    <div class="reputation-box">
      <blockquote>${esc(reputation)}</blockquote>
      <cite>\u2014 \u6765\u81EA\u5468\u56F4\u4EBA\u7684\u8BC4\u4EF7</cite>
    </div>
  </section>` : ''}${advice ? `
  <section>
    <div class="section-label">\u{1F4A1} Mentorship / \u5FAE\u5BFA\u4ED6\u4EBA</div>
    <div class="advice-section">
      <h3>\u7ED9\u60F3\u53D8\u5F97\u66F4\u9760\u8C31\u7684\u4EBA</h3>
      <p>${esc(advice)}</p>
    </div>
  </section>` : ''}${trajectory ? `
  <section>
    <div class="section-label">\u{2728} Trajectory / \u4EBA\u751F\u8F68\u8FF9</div>
    <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.85;max-width:620px">${esc(trajectory)}</p>
  </section>` : ''}
  <footer>
    Generated by <span>ME / \u9760\u8C31\u6A21\u5F0F</span>
  </footer>
</div>
</body>
</html>`;
}

// --- Generate Markdown ---
export function generateMarkdown(answers) {
  const identity = a(answers, 0);
  const name = identity.split(/[,.\\uff0c\\u3002]/)[0].trim() || 'Your Name';
  const now = new Date().toISOString().split('T')[0];
  const L = [];

  L.push(`# ${name} -- \u9760\u8C31\u4E2A\u4EBA\u4E3B\u9875`);
  L.push('');
  if (has(answers, 1)) { L.push(`> ${a(answers, 1)}`); L.push(''); }
  if (has(answers, 15)) { L.push(`\u201C${a(answers, 15)}\u201D`); L.push(''); }
  L.push('---');
  L.push('');

  if (has(answers, 3) || has(answers, 4) || has(answers, 5)) {
    L.push('## \u{1F310} \u793E\u4F1A\u5B66\u89C6\u89D2 (Sociology)');
    L.push('');
    if (has(answers, 3)) { L.push('### \u4FE1\u4EFB\u6784\u5EFA'); L.push(''); L.push(a(answers, 3)); L.push(''); }
    if (has(answers, 4)) { L.push('### \u56E2\u961F\u89D2\u8272'); L.push(''); L.push(a(answers, 4)); L.push(''); }
    if (has(answers, 5)) { L.push('### \u627F\u8BFA\u7BA1\u7406'); L.push(''); L.push(a(answers, 5)); L.push(''); }
  }

  if (has(answers, 6) || has(answers, 7) || has(answers, 8)) {
    L.push('## \u{1F9E0} \u5FC3\u7406\u5B66\u89C6\u89D2 (Psychology)');
    L.push('');
    if (has(answers, 6)) { L.push('### \u5185\u5728\u52A8\u529B'); L.push(''); L.push(a(answers, 6)); L.push(''); }
    if (has(answers, 7)) { L.push('### \u538B\u529B\u7BA1\u7406'); L.push(''); L.push(a(answers, 7)); L.push(''); }
    if (has(answers, 8)) { L.push('### \u51B3\u7B56\u53EF\u9760\u6027'); L.push(''); L.push(a(answers, 8)); L.push(''); }
  }

  if (has(answers, 9) || has(answers, 10) || has(answers, 11)) {
    L.push('## \u{1F4CA} \u7BA1\u7406\u5B66\u89C6\u89D2 (Management)');
    L.push('');
    if (has(answers, 9)) { L.push('### \u4EA4\u4ED8\u6846\u67B6'); L.push(''); L.push(a(answers, 9)); L.push(''); }
    if (has(answers, 10)) { L.push('### \u900F\u660E\u6C9F\u901A'); L.push(''); L.push(a(answers, 10)); L.push(''); }
    if (has(answers, 11)) { L.push('### \u590D\u5236\u9760\u8C31'); L.push(''); L.push(a(answers, 11)); L.push(''); }
  }

  if (has(answers, 12) || has(answers, 13) || has(answers, 14)) {
    L.push('## \u{1F3AF} \u884C\u4E3A\u8BC1\u636E (Evidence)');
    L.push('');
    if (has(answers, 12)) { L.push('### \u5173\u952E\u65F6\u523B'); L.push(''); L.push(a(answers, 12)); L.push(''); }
    if (has(answers, 13)) { L.push('### \u56F0\u96BE\u575A\u5B88'); L.push(''); L.push(a(answers, 13)); L.push(''); }
    if (has(answers, 14)) { L.push('### \u957F\u671F\u575A\u6301'); L.push(''); L.push(a(answers, 14)); L.push(''); }
  }

  if (has(answers, 2)) { L.push('## \u{1F4AC} \u53E3\u7891 (Reputation)'); L.push(''); L.push(a(answers, 2)); L.push(''); }
  if (has(answers, 16)) { L.push('## \u{1F4A1} \u5FAE\u5BFA\u4ED6\u4EBA (Mentorship)'); L.push(''); L.push(a(answers, 16)); L.push(''); }
  if (has(answers, 17)) { L.push('## \u{2728} \u4EBA\u751F\u8F68\u8FF9 (Trajectory)'); L.push(''); L.push(a(answers, 17)); L.push(''); }

  L.push('---');
  L.push('');
  L.push(`*Generated ${now} via [ME / \u9760\u8C31\u6A21\u5F0F](https://github.com/allengaller/me).*`);

  return L.join('\n');
}

// --- Custom preview renderer ---
function renderReliablePreview(previewContent, answers, questions, chapters, escFn) {
  const parts = [];
  let lastCh = '';

  const identity = (answers[0] || '').trim();
  const name = identity.split(/[,.\uff0c\u3002]/)[0].trim() || 'You';
  const tagline = (answers[1] || '').trim();
  const reputation = (answers[2] || '').trim();
  const philosophy = (answers[15] || '').trim();

  parts.push(`<div class="pv-hero">`);
  parts.push(`<div class="pv-name">${escFn(name)}</div>`);
  if (tagline) parts.push(`<div class="pv-tagline">${escFn(tagline)}</div>`);
  if (philosophy) parts.push(`<div class="pv-philosophy">\u201C${escFn(philosophy)}\u201D</div>`);
  parts.push(`</div>`);

  const sectionMap = {
    'sociology': { icon: '\u{1F310}', label: 'Sociology' },
    'psychology': { icon: '\u{1F9E0}', label: 'Psychology' },
    'management': { icon: '\u{1F4CA}', label: 'Management' },
    'evidence': { icon: '\u{1F3AF}', label: 'Evidence' },
  };

  for (let i = 3; i < questions.length; i++) {
    const ans = answers[i];
    if (!ans || !ans.trim()) continue;
    const q = questions[i];
    const ch = chapters.find(c => c.id === q.chapter);

    if (q.chapter !== lastCh && sectionMap[q.chapter]) {
      const sec = sectionMap[q.chapter];
      parts.push(`<h4 class="pv-chapter">${sec.icon} ${sec.label} / ${ch.titleZh}</h4>`);
      lastCh = q.chapter;
    }
    if (q.chapter === lastCh && sectionMap[q.chapter]) {
      parts.push(`<p class="pv-paragraph">${escFn(ans.trim())}</p>`);
    }
  }

  if (reputation) {
    parts.push(`<h4 class="pv-chapter">\u{1F4AC} Reputation</h4>`);
    parts.push(`<p class="pv-paragraph">${escFn(reputation)}</p>`);
  }

  previewContent.innerHTML = parts.length <= 1
    ? '<div class="rl-preview-empty">Your reliable personal homepage will take shape here...</div>'
    : parts.join('');
  previewContent.scrollTop = previewContent.scrollHeight;
}

// --- Multi-tab export support ---
let exportTab = 'html';

function getExportContent(answers) {
  return exportTab === 'html' ? generateHTML(answers) : generateMarkdown(answers);
}

// --- Initialize wizard ---
const wizard = createWizard({
  storageKey: 'me_reliable',
  questions: QUESTIONS,
  chapters: CHAPTERS,
  generateExport: getExportContent,
  exportFilename: 'reliable-homepage.html',
  exportMime: 'text/html',
  renderPreview: renderReliablePreview,
  emptyPreview: 'Your reliable personal homepage will take shape here...',
});

// --- Tab switching ---
function initTabs() {
  document.querySelectorAll('.rl-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.rl-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      exportTab = tab.dataset.tab;
      const ext = exportTab === 'html' ? 'html' : 'md';
      // Update export area if modal is open
      const exportArea = document.getElementById('exportArea');
      if (exportArea && exportArea.closest('.rl-modal')?.style.display === 'flex') {
        exportArea.value = getExportContent(wizard.getState().answers);
      }
    });
  });
}

wizard.init();
initTabs();
