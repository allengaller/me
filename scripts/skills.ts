#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, '../src/config/profile.json');
const PREFERENCES_PATH = path.join(homedir(), '.config', 'skilltree', 'preferences.json');

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Theme {
  name: string;
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  text: string;
  textDim: string;
  muted: string;
  border: string;
  highlight: string;
  barFill: string;
  barEmpty: string;
  searchMatch: string;
  reset?: string;
  bold?: string;
  dim?: string;
}

type ThemeName = 'dark' | 'light' | 'nord' | 'tokyo';

interface Preferences {
  theme: string;
  keybindings: string;
}

interface Technology {
  name: string;
  progress: number;
  note: string;
}

interface Skill {
  name: string;
  name_zh?: string;
  note?: string;
  level: string;
  level_zh?: string;
  technologies: (string | Technology)[];
}

interface SkillConfig {
  skills: Skill[];
  [key: string]: unknown;
}

interface AppState {
  config: SkillConfig;
  prefs: Preferences;
  theme: Theme;
  levelColors: string[];
  selected: number;
  mode: string;
  searchQuery: string;
  filteredIndices: number[];
  confirmAction: null;
  notification: string | null;
  notificationTime: number;
  viewport: { start: number; end: number };
  commandInput?: string;
  pendingAction?: string;
}

// ─────────────────────────────────────────────────────────────
// THEME ENGINE
// ─────────────────────────────────────────────────────────────

const THEMES: Record<ThemeName, Theme> = {
  dark: {
    name: 'Dark',
    bg: '\x1b[48;5;16m',
    primary: '\x1b[38;5;75m',
    secondary: '\x1b[38;5;110m',
    accent: '\x1b[38;5;141m',
    success: '\x1b[38;5;114m',
    warning: '\x1b[38;5;220m',
    danger: '\x1b[38;5;210m',
    info: '\x1b[38;5;117m',
    text: '\x1b[38;5;251m',
    textDim: '\x1b[38;5;245m',
    muted: '\x1b[38;5;240m',
    border: '\x1b[38;5;238m',
    highlight: '\x1b[38;5;39m',
    barFill: '\x1b[38;5;75m',
    barEmpty: '\x1b[38;5;236m',
    searchMatch: '\x1b[38;5;226m',
  },
  light: {
    name: 'Light',
    bg: '\x1b[48;5;255m',
    primary: '\x1b[38;5;25m',
    secondary: '\x1b[38;5;29m',
    accent: '\x1b[38;5;55m',
    success: '\x1b[38;5;34m',
    warning: '\x1b[38;5;136m',
    danger: '\x1b[38;5;124m',
    info: '\x1b[38;5;25m',
    text: '\x1b[38;5;235m',
    textDim: '\x1b[38;5;59m',
    muted: '\x1b[38;5;247m',
    border: '\x1b[38;5;250m',
    highlight: '\x1b[38;5;26m',
    barFill: '\x1b[38;5;32m',
    barEmpty: '\x1b[38;5;250m',
    searchMatch: '\x1b[38;5;130m',
  },
  nord: {
    name: 'Nord',
    bg: '\x1b[48;5;17m',
    primary: '\x1b[38;5;111m',
    secondary: '\x1b[38;5;108m',
    accent: '\x1b[38;5;139m',
    success: '\x1b[38;5;72m',
    warning: '\x1b[38;5;220m',
    danger: '\x1b[38;5;203m',
    info: '\x1b[38;5;117m',
    text: '\x1b[38;5;223m',
    textDim: '\x1b[38;5;187m',
    muted: '\x1b[38;5;145m',
    border: '\x1b[38;5;59m',
    highlight: '\x1b[38;5;68m',
    barFill: '\x1b[38;5;75m',
    barEmpty: '\x1b[38;5;59m',
    searchMatch: '\x1b[38;5;221m',
  },
  tokyo: {
    name: 'Tokyo',
    bg: '\x1b[48;5;16m',
    primary: '\x1b[38;5;213m',
    secondary: '\x1b[38;5;121m',
    accent: '\x1b[38;5;183m',
    success: '\x1b[38;5;120m',
    warning: '\x1b[38;5;228m',
    danger: '\x1b[38;5;204m',
    info: '\x1b[38;5;117m',
    text: '\x1b[38;5;253m',
    textDim: '\x1b[38;5;245m',
    muted: '\x1b[38;5;240m',
    border: '\x1b[38;5;236m',
    highlight: '\x1b[38;5;141m',
    barFill: '\x1b[38;5;213m',
    barEmpty: '\x1b[38;5;236m',
    searchMatch: '\x1b[38;5;228m',
  },
};

// ─────────────────────────────────────────────────────────────
// PREFERENCES
// ─────────────────────────────────────────────────────────────

function loadPreferences(): Preferences {
  try {
    const dir = path.dirname(PREFERENCES_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(PREFERENCES_PATH)) {
      return JSON.parse(fs.readFileSync(PREFERENCES_PATH, 'utf8'));
    }
  } catch {}
  return { theme: 'dark', keybindings: 'default' };
}

function savePreferences(prefs: Preferences): void {
  try {
    const dir = path.dirname(PREFERENCES_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PREFERENCES_PATH, JSON.stringify(prefs, null, 2));
  } catch {}
}

// ─────────────────────────────────────────────────────────────
// CONFIG & STATE
// ─────────────────────────────────────────────────────────────

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const LEVELS_ZH = ['入门', '中级', '高级', '专家'];
const LEVEL_FILLED = [5, 10, 15, 20];
const LEVEL_COLORS: Record<ThemeName, string[]> = {
  dark:   ['\x1b[38;5;210m', '\x1b[38;5;220m', '\x1b[38;5;117m', '\x1b[38;5;114m'],
  light:  ['\x1b[38;5;124m', '\x1b[38;5;136m', '\x1b[38;5;25m',  '\x1b[38;5;34m'],
  nord:   ['\x1b[38;5;203m', '\x1b[38;5;220m', '\x1b[38;5;117m', '\x1b[38;5;72m'],
  tokyo:  ['\x1b[38;5;204m', '\x1b[38;5;228m', '\x1b[38;5;117m', '\x1b[38;5;120m'],
};

const _DEFAULT_KEYBINDINGS = {
  navigation: { up: ['k', '\x1b[A'], down: ['j', '\x1b[B'] },
  actions: { add: 'a', edit: 'e', delete: 'd', quit: 'q' },
  modes: { search: '/', command: ':' },
};

function loadConfig(): SkillConfig {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function saveConfig(config: SkillConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

// ─────────────────────────────────────────────────────────────
// STATE MANAGER
// ─────────────────────────────────────────────────────────────

function createState(config: SkillConfig, prefs: Preferences): AppState {
  const themeKey = (prefs.theme in LEVEL_COLORS ? prefs.theme : 'dark') as ThemeName;
  return {
    config,
    prefs,
    theme: THEMES[prefs.theme as ThemeName] || THEMES.dark,
    levelColors: LEVEL_COLORS[themeKey],
    selected: config.skills.length > 0 ? 0 : -1,
    mode: 'normal', // normal | search | command | confirm
    searchQuery: '',
    filteredIndices: config.skills.map((_, i) => i),
    confirmAction: null,
    notification: null,
    notificationTime: 0,
    viewport: { start: 0, end: Math.min(config.skills.length, 20) },
  };
}

function getDisplayIndex(state: AppState): number {
  if (state.mode === 'search' && state.searchQuery) {
    return state.filteredIndices[state.selected] ?? -1;
  }
  return state.selected;
}

function filterSkills(skills: Skill[], query: string): number[] {
  if (!query) return skills.map((_, i) => i);
  const q = query.toLowerCase();
  return skills.reduce<number[]>((acc, s, i) => {
    if (
      s.name.toLowerCase().includes(q) ||
      (s.name_zh && s.name_zh.includes(q)) ||
      (s.note && s.note.toLowerCase().includes(q))
    ) {
      acc.push(i);
    }
    return acc;
  }, []);
}

// ─────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, (answer) => { rl.close(); resolve(answer); });
  });
}

function normTech(t: string | Technology): Technology {
  if (typeof t === 'string') return { name: t, progress: 0, note: '' };
  return { name: t.name || '', progress: t.progress ?? 0, note: t.note || '' };
}

function pColor(p: number, theme: Theme): string {
  if (p <= 25) return theme.danger;
  if (p <= 50) return theme.warning;
  if (p <= 75) return theme.info;
  return theme.success;
}

function miniBar(progress: number, theme: Theme): string {
  const filled = Math.round(progress / 10);
  return `${pColor(progress, theme)}${'█'.repeat(filled)}${theme.barEmpty}${'░'.repeat(10 - filled)}`;
}

function makeBar(levelIdx: number, theme: Theme, levelColors: string[]): string {
  const filled = LEVEL_FILLED[levelIdx];
  return `${levelColors[levelIdx]}${'█'.repeat(filled)}${theme.barEmpty}${'░'.repeat(20 - filled)}`;
}

function notify(state: AppState, msg: string, duration = 2000): AppState {
  return { ...state, notification: msg, notificationTime: Date.now() + duration };
}

// ─────────────────────────────────────────────────────────────
// RENDERER
// ─────────────────────────────────────────────────────────────

function clear(): void {
  process.stdout.write('\x1Bc');
}

function clearLine(): void {
  process.stdout.write('\x1b[2K\r');
}

function moveCursor(x: number, y: number): void {
  process.stdout.write(`\x1b[${y};${x}H`);
}

function render(state: AppState): void {
  const { theme, config, prefs } = state;
  const skills = config.skills;
  const selected = getDisplayIndex(state);
  const LC = state.levelColors;
  const isSearch = state.mode === 'search';
  const isCommand = state.mode === 'command';

  clear();

  // ── Header ──────────────────────────────────────────────
  const termWidth = 63;
  console.log();
  console.log(`${theme.border}  ┌${'─'.repeat(61)}┐${theme.reset}`);
  console.log(`${theme.border}  │${theme.reset}  ${theme.secondary}🌳${theme.reset}  ${theme.bold}${theme.primary}SKILL TREE${theme.reset}${' '.repeat(42 - prefs.theme.length)}` +
    `${theme.border}│${theme.reset}`);
  console.log(`${theme.border}  └${'─'.repeat(61)}┘${theme.reset}`);
  console.log();

  // ── Search Bar (when in search mode) ─────────────────────
  if (isSearch) {
    console.log(`  ${theme.border}┌${'─'.repeat(59)}┐${theme.reset}`);
    console.log(`  ${theme.border}│${theme.reset}  ${theme.warning}/${theme.reset} ${theme.text}Search skills...${theme.textDim} ${state.searchQuery}${theme.border}│${theme.reset}`);
    console.log(`  ${theme.border}└${'─'.repeat(59)}┘${theme.reset}`);
    console.log();
  }

  // ── Command Bar (when in command mode) ───────────────────
  if (isCommand) {
    console.log(`  ${theme.border}┌${'─'.repeat(59)}┐${theme.reset}`);
    console.log(`  ${theme.border}│${theme.reset}  ${theme.accent}:${theme.reset} ${theme.text}${state.commandInput || ''}${theme.textDim}_${theme.border}│${theme.reset}`);
    console.log(`  ${theme.border}└${'─'.repeat(59)}┘${theme.reset}`);
    console.log();
  }

  // ── Skill List ───────────────────────────────────────────
  if (skills.length === 0) {
    renderEmptyState(theme);
  } else {
    renderSkillTree(skills, selected, theme, LC, state);
  }

  // ── Status Bar ───────────────────────────────────────────
  console.log();
  renderStatusBar(state);
  console.log();

  // ── Notification ─────────────────────────────────────────
  if (state.notification && Date.now() < state.notificationTime) {
    const n = state.notification;
    const padding = Math.max(0, Math.floor((61 - n.length) / 2));
    console.log(`  ${theme.border}│${theme.reset}${theme.success}${' '.repeat(padding + 2)}${n}${' '.repeat(61 - padding - n.length - 2)}${theme.border}│${theme.reset}`);
  }

  // ── Input Line ───────────────────────────────────────────
  const prompt = isSearch ? `  ${theme.warning}/${theme.reset} ` :
                 isCommand ? `  ${theme.accent}:${theme.reset} ` :
                 `  ${theme.primary}›${theme.reset} `;
  process.stdout.write(prompt);
}

function renderEmptyState(theme: Theme): void {
  console.log(`                 ${theme.secondary}✦${theme.reset}`);
  console.log(`                 ${theme.secondary}│${theme.reset}`);
  console.log(`              ${theme.secondary}╔═══╧═══╗${theme.reset}`);
  console.log(`              ${theme.secondary}║${theme.dim}   🌱   ${theme.secondary}║${theme.reset}`);
  console.log(`              ${theme.secondary}╚═══╤═══╝${theme.reset}`);
  console.log(`                 ${theme.secondary}│${theme.reset}`);
  console.log(`              ${theme.secondary}╔═══╧═══╗${theme.reset}`);
  console.log(`              ${theme.secondary}║ ${theme.text}ROOT ${theme.secondary}║${theme.reset}`);
  console.log(`              ${theme.secondary}╚═══════╝${theme.reset}`);
  console.log();
  console.log(`        ${theme.textDim}Press '${theme.primary}a${theme.textDim}' or '${theme.warning}/${theme.textDim}' to begin${theme.reset}`);
  console.log();
}

function renderSkillTree(skills: Skill[], selected: number, theme: Theme, LC: string[], state: AppState): void {
  const displayIdx = state.mode === 'search' ? state.selected : 0;
  const actualSelected = state.mode === 'search' ? state.filteredIndices[displayIdx] : selected;

  // Tree top decoration
  const leaves = skills.map((s, i) => {
    const li = Math.max(0, LEVELS.indexOf(s.level));
    return `${LC[li]}✦${theme.reset}`;
  });
  console.log(`       ${leaves.join('   ')}`);
  if (skills.length >= 2) console.log(`        ${theme.border}╲   │   ╱${theme.reset}`);
  console.log(`         ${theme.border}│${theme.reset}`);
  console.log();

  skills.forEach((skill, i) => {
    const li = Math.max(0, LEVELS.indexOf(skill.level));
    const isSel = i === actualSelected;
    const isLast = i === skills.length - 1;
    const conn = isLast ? '╰' : '├';
    const cont = isLast ? ' ' : '│';
    const marker = isSel ? `${theme.highlight}●${theme.reset}` : `${theme.textDim}○${theme.reset}`;
    const bar = makeBar(li, theme, LC);

    const ns = isSel ? `${theme.bold}${theme.highlight}` : theme.text;
    const nsfx = skill.name_zh ? ` ${theme.textDim}· ${skill.name_zh}${theme.reset}` : '';

    // Skill name - highlight search matches
    let skillName = skill.name;
    if (state.mode === 'search' && state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const idx = skill.name.toLowerCase().indexOf(q);
      if (idx >= 0) {
        skillName = skill.name.slice(0, idx) +
          `${theme.highlight}${theme.bold}` + skill.name.slice(idx, idx + q.length) +
          `${theme.reset}` + (isSel ? `${theme.highlight}` : theme.text) + skill.name.slice(idx + q.length);
      }
    }

    console.log(`  ${theme.border}│${theme.reset}  ${theme.secondary}${conn}──${theme.reset} ${marker} ${ns}${skillName}${theme.reset}${nsfx}`);
    console.log(`  ${theme.border}│${theme.reset}  ${theme.textDim}${cont}   ${bar} ${LC[li]}${skill.level}${theme.reset}`);

    if (skill.note) {
      console.log(`  ${theme.border}│${theme.reset}  ${theme.textDim}${cont}   ${theme.warning}"${skill.note}"${theme.reset}`);
    }

    const techs = (skill.technologies || []).map(normTech);
    techs.forEach((tech, ti) => {
      const isLastT = ti === techs.length - 1;
      const tc = isLastT ? '└─' : '├─';
      const mb = miniBar(tech.progress, theme);
      const pc = pColor(tech.progress, theme);
      const nt = tech.note ? `  ${theme.warning}"${tech.note}"${theme.reset}` : '';
      const techName = isSel ? `${theme.text}${tech.name}${theme.reset}` : `${theme.textDim}${tech.name}${theme.reset}`;
      console.log(`  ${theme.border}│${theme.reset}  ${theme.textDim}${cont}   ${theme.textDim}${tc}${theme.reset} ${theme.accent}◆${theme.reset} ${techName}  ${mb} ${pc}${tech.progress}%${theme.reset}${nt}`);
    });

    if (!isLast) {
      console.log(`  ${theme.border}│${theme.reset}  ${theme.textDim}${cont}${theme.reset}`);
    }
  });

  console.log(`  ${theme.border}│${theme.reset}`);
  console.log(`  ${theme.border}╰${theme.border}──${theme.secondary}🌳${theme.border}──${theme.reset}`);
}

function renderStatusBar(state: AppState): void {
  const { theme, config, prefs } = state;
  const skills = config.skills;
  const totalTechs = skills.reduce((acc, s) => acc + (s.technologies?.length || 0), 0);
  const avgProgress = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => {
        const techs = (s.technologies || []).map(normTech);
        return acc + (techs.length > 0
          ? techs.reduce((a, t) => a + t.progress, 0) / techs.length : 0);
      }, 0) / skills.length)
    : 0;

  console.log(`${theme.border}  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄${theme.reset}`);

  // Key hints
  const keys = [
    [theme.success, 'a', 'Add'],
    [theme.warning, 'e', 'Edit'],
    [theme.danger, 'd', 'Del'],
    [theme.info, 'j/k', 'Nav'],
    [theme.warning, '/', 'Search'],
    [theme.accent, 't', 'Theme'],
    [theme.textDim, 'q', 'Quit'],
  ];
  console.log(`  ${keys.map(([c, k, l]) => `${c}[${k}]${theme.textDim} ${l}`).join('   ')}${theme.reset}`);

  // Stats line
  console.log(`  ${theme.textDim}${skills.length} skills  ${totalTechs} technologies  ${avgProgress}% avg progress  ${theme.primary}${theme.name}${theme.reset} theme${theme.textDim} | ~/.config/skilltree/preferences.json${theme.reset}`);
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────

async function addSkill(state: AppState): Promise<AppState | null> {
  const { theme, config } = state;
  console.log(`\n  ${theme.success}${theme.bold}+ Add New Skill${theme.reset}\n`);

  const d = { name: '', name_zh: '', note: '', level: 'Intermediate', level_zh: '中级' };
  const name = (await question(`  ${theme.primary}Name (EN)${theme.reset} [${d.name}]: `)).trim() || d.name;
  if (!name) return null;

  const name_zh = (await question(`  ${theme.primary}Name (中文)${theme.reset} [${d.name_zh}]: `)).trim() || d.name_zh;
  const note = (await question(`  ${theme.primary}Note${theme.reset} [${d.note}]: `)).trim() || d.note;

  console.log();
  console.log(`  ${theme.bold}Level:${theme.reset}`);
  const LC = state.levelColors;
  LEVELS.forEach((level, i) => {
    console.log(`    ${theme.secondary}${i + 1}${theme.reset}. ${makeBar(i, theme, LC)} ${LC[i]}${level}${theme.reset} (${LEVELS_ZH[i]})`);
  });
  const li = await question(`  ${theme.primary}Select (1-4)${theme.reset} [2]: `);
  const levelIdx = li.trim() ? Math.min(Math.max(parseInt(li) - 1, 0), 3) : 1;

  const techs = await manageTechs([], theme, state);

  const skill = { name, name_zh, note, level: LEVELS[levelIdx], level_zh: LEVELS_ZH[levelIdx], technologies: techs };
  config.skills.push(skill);
  saveConfig(config);

  console.log(`\n  ${theme.success}✓ "${skill.name}" planted!${theme.reset}`);
  await question(`  ${theme.textDim}Press enter...${theme.reset}`);

  return notify(state, `Added "${skill.name}"`);
}

async function editSkill(state: AppState, index: number): Promise<AppState> {
  const { theme, config } = state;
  if (index < 0 || index >= config.skills.length) return state;

  const existing = config.skills[index];
  console.log(`\n  ${theme.warning}${theme.bold}~ Edit: ${existing.name}${theme.reset}\n`);

  const name = (await question(`  ${theme.primary}Name (EN)${theme.reset} [${existing.name}]: `)).trim() || existing.name;
  const name_zh = (await question(`  ${theme.primary}Name (中文)${theme.reset} [${existing.name_zh}]: `)).trim() || existing.name_zh;
  const note = (await question(`  ${theme.primary}Note${theme.reset} [${existing.note}]: `)).trim() || existing.note;

  console.log();
  console.log(`  ${theme.bold}Level:${theme.reset}`);
  const LC = state.levelColors;
  LEVELS.forEach((level, i) => {
    const sel = level === existing.level ? '←' : ' ';
    console.log(`    ${theme.secondary}${i + 1}${theme.reset}. ${makeBar(i, theme, LC)} ${LC[i]}${level}${theme.reset} (${LEVELS_ZH[i]}) ${theme.textDim}${sel}${theme.reset}`);
  });
  const li = await question(`  ${theme.primary}Select (1-4)${theme.reset} [${LEVELS.indexOf(existing.level) + 1}]: `);
  const levelIdx = li.trim() ? Math.min(Math.max(parseInt(li) - 1, 0), 3) : LEVELS.indexOf(existing.level);

  const techs = await manageTechs(existing.technologies || [], theme, state);

  config.skills[index] = { name, name_zh, note, level: LEVELS[levelIdx], level_zh: LEVELS_ZH[levelIdx], technologies: techs };
  saveConfig(config);

  console.log(`\n  ${theme.success}✓ "${name}" updated!${theme.reset}`);
  await question(`  ${theme.textDim}Press enter...${theme.reset}`);

  return notify(state, `Updated "${name}"`);
}

async function deleteSkill(state: AppState, index: number): Promise<AppState> {
  const { theme, config } = state;
  if (index < 0 || index >= config.skills.length) return state;

  const skill = config.skills[index];
  console.log(`\n  ${theme.danger}${theme.bold}× Delete: ${skill.name}${theme.reset}`);
  const confirm = (await question(`  ${theme.textDim}Confirm? (y/N):${theme.reset} `)).toLowerCase();

  if (confirm === 'y') {
    config.skills.splice(index, 1);
    saveConfig(config);
    console.log(`  ${theme.success}✓ Deleted${theme.reset}`);
    await question(`  ${theme.textDim}Press enter...${theme.reset}`);
    return notify(state, `Deleted "${skill.name}"`);
  }

  console.log(`  ${theme.textDim}Cancelled${theme.reset}`);
  await question(`  ${theme.textDim}Press enter...${theme.reset}`);
  return state;
}

async function manageTechs(technologies: (string | Technology)[], theme: Theme, state: AppState): Promise<Technology[]> {
  let techs = technologies.map(normTech);

  while (true) {
    console.log(`\n  ${theme.bold}Technologies:${theme.reset}`);
    if (techs.length === 0) {
      console.log(`    ${theme.textDim}(empty)${theme.reset}`);
    } else {
      techs.forEach((t, i) => {
        const mb = miniBar(t.progress, theme);
        const nt = t.note ? `  ${theme.warning}"${t.note}"${theme.reset}` : '';
        console.log(`    ${theme.secondary}${i + 1}${theme.reset}. ${theme.accent}◆${theme.reset} ${t.name}  ${mb} ${pColor(t.progress, theme)}${t.progress}%${theme.reset}${nt}`);
      });
    }
    const input = await question(`\n  ${theme.success}+${theme.reset} add  ${theme.warning}N${theme.reset} edit  ${theme.danger}-N${theme.reset} del  ${theme.bold}Enter${theme.reset} done > `);
    const cmd = input.trim();
    if (!cmd) break;

    if (cmd === '+') {
      console.log(`\n  ${theme.success}+ New technology:${theme.reset}`);
      const tech = await inputTech(null, theme);
      if (tech) techs.push(tech);
    } else if (cmd.startsWith('-')) {
      const idx = parseInt(cmd.slice(1)) - 1;
      if (idx >= 0 && idx < techs.length) {
        console.log(`  ${theme.success}✓ Removed "${techs[idx].name}"${theme.reset}`);
        techs.splice(idx, 1);
      } else {
        console.log(`  ${theme.textDim}Invalid index${theme.reset}`);
      }
    } else {
      const idx = parseInt(cmd) - 1;
      if (idx >= 0 && idx < techs.length) {
        console.log(`\n  ${theme.warning}~ Edit: ${techs[idx].name}${theme.reset}`);
        const updated = await inputTech(techs[idx], theme);
        if (updated) techs[idx] = updated;
      } else {
        console.log(`  ${theme.textDim}Invalid index${theme.reset}`);
      }
    }
  }
  return techs;
}

async function inputTech(existing: Technology | null, theme: Theme): Promise<Technology | null> {
  const d = existing || { name: '', progress: 0, note: '' };
  const name = (await question(`    ${theme.primary}Name${theme.reset} [${d.name}]: `)).trim() || d.name;
  if (!name) return null;
  const ps = (await question(`    ${theme.primary}Progress (0-100)${theme.reset} [${d.progress}]: `)).trim();
  const progress = ps ? Math.min(Math.max(parseInt(ps) || 0, 0), 100) : d.progress;
  const rawNote = (await question(`    ${theme.primary}Note${theme.reset} [${d.note}]: `)).trim();
  const note = rawNote === '' ? (d.note || '') : rawNote;
  return { name, progress, note };
}

async function handleCommand(state: AppState, cmd: string): Promise<AppState> {
  const { theme, prefs, config } = state;
  const parts = cmd.trim().slice(1).split(/\s+/);
  const action = parts[0]?.toLowerCase();
  const arg = parts.slice(1).join(' ');

  switch (action) {
    case 'theme':
    case 't': {
      const names = Object.keys(THEMES);
      const current = names.indexOf(prefs.theme);
      if (arg) {
        const next = names.find(n => n.startsWith(arg.toLowerCase()));
        if (next) {
          prefs.theme = next;
          savePreferences(prefs);
          const newState = createState(config, prefs);
          return notify(newState, `Theme: ${THEMES[next].name}`);
        }
        return notify(state, `Unknown theme. Options: ${names.join(', ')}`);
      }
      const nextTheme = names[(current + 1) % names.length];
      prefs.theme = nextTheme;
      savePreferences(prefs);
      const cycledState = createState(config, prefs);
      return notify(cycledState, `Theme: ${THEMES[nextTheme].name}`);
    }
    case 'quit':
    case 'q':
      return { ...state, mode: 'quit' };
    case 'help':
    case 'h':
    case '?':
      return notify(state, 'Commands: :theme, :quit, :help');
    case 'add':
    case 'a':
      return { ...state, mode: 'normal', pendingAction: 'add' };
    default:
      return notify(state, `Unknown: ${action}. Try :help`);
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

async function main() {
  if (!process.stdin.isTTY) {
    console.error('Please run in a terminal');
    process.exit(1);
  }

  const prefs = loadPreferences();
  const config = loadConfig();
  let state = createState(config, prefs);

  render(state);

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  let busy = false;
  let searchBuf = '';
  let commandBuf = '';

  process.stdin.on('data', async (data) => {
    if (busy) return;
    const key = data.toString();

    // Clear notification on any key
    if (state.notification && Date.now() >= state.notificationTime) {
      state = { ...state, notification: null };
    }

    // Handle quit
    if (key === 'q' || key === '\x03') {
      clear();
      console.log(`\n  ${state.theme.secondary}🌳 Goodbye!${state.theme.reset}\n`);
      process.exit(0);
    }

    // Search mode
    if (state.mode === 'search') {
      if (key === '\x1b[C' || key === '\x1b[D' || key === '\t') {
        // ignore
      } else if (key === '\x7f' || key === '\x08') {
        // backspace
        searchBuf = searchBuf.slice(0, -1);
        state = { ...state, searchQuery: searchBuf, filteredIndices: filterSkills(config.skills, searchBuf), selected: 0 };
        render(state);
      } else if (key === '\x1b' || key === '\x1b[') {
        // escape - exit search
        state = { ...state, mode: 'normal', searchQuery: '', selected: state.filteredIndices[0] ?? state.selected };
        searchBuf = '';
        render(state);
      } else if (key === '\r' || key === '\n') {
        // enter - exit search with selection
        state = { ...state, mode: 'normal', selected: state.filteredIndices[0] ?? state.selected };
        searchBuf = '';
        render(state);
      } else if (key.length === 1) {
        searchBuf += key;
        state = { ...state, searchQuery: searchBuf, filteredIndices: filterSkills(config.skills, searchBuf), selected: 0 };
        render(state);
      }
      return;
    }

    // Command mode
    if (state.mode === 'command') {
      if (key === '\x1b' || key === '\x1b[') {
        state = { ...state, mode: 'normal', commandInput: '' };
        commandBuf = '';
        render(state);
      } else if (key === '\r' || key === '\n') {
        state = await handleCommand(state, commandBuf);
        commandBuf = '';
        if (state.mode === 'quit') {
          clear();
          console.log(`\n  ${state.theme.secondary}🌳 Goodbye!${state.theme.reset}\n`);
          process.exit(0);
        }
        state = { ...state, mode: 'normal', commandInput: '' };
        render(state);
      } else if (key === '\x7f' || key === '\x08') {
        commandBuf = commandBuf.slice(0, -1);
        state = { ...state, commandInput: commandBuf };
        render(state);
      } else if (key.length === 1) {
        commandBuf += key;
        state = { ...state, commandInput: commandBuf };
        render(state);
      }
      return;
    }

    // Normal mode
    if (key === '/') {
      state = { ...state, mode: 'search', searchQuery: '', selected: 0 };
      searchBuf = '';
      render(state);
      return;
    }

    if (key === ':') {
      state = { ...state, mode: 'command', commandInput: '' };
      commandBuf = '';
      render(state);
      return;
    }

    if (key === 't') {
      const names = Object.keys(THEMES);
      const current = names.indexOf(prefs.theme);
      const nextTheme = names[(current + 1) % names.length];
      prefs.theme = nextTheme;
      savePreferences(prefs);
      state = createState(config, prefs);
      state = notify(state, `Theme: ${THEMES[nextTheme].name}`);
      render(state);
      return;
    }

    if (key === 'k' || key === '\x1b[A') {
      const len = state.mode === 'search' ? state.filteredIndices.length : config.skills.length;
      if (len === 0) return;
      state = { ...state, selected: Math.max(0, state.selected - 1) };
      render(state);
    } else if (key === 'j' || key === '\x1b[B') {
      const len = state.mode === 'search' ? state.filteredIndices.length : config.skills.length;
      if (len === 0) return;
      state = { ...state, selected: Math.min(len - 1, state.selected + 1) };
      render(state);
    } else if (key === 'a') {
      busy = true;
      process.stdin.setRawMode(false);
      process.stdin.pause();
      state = await addSkill(state);
      state = { ...state, config: loadConfig(), selected: Math.max(0, config.skills.length - 1) };
      render(state);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      busy = false;
    } else if (key === 'e') {
      const idx = getDisplayIndex(state);
      if (idx < 0 || idx >= config.skills.length) return;
      busy = true;
      process.stdin.setRawMode(false);
      process.stdin.pause();
      await editSkill(state, idx);
      state = { ...state, config: loadConfig() };
      render(state);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      busy = false;
    } else if (key === 'd') {
      const idx = getDisplayIndex(state);
      if (idx < 0 || idx >= config.skills.length) return;
      busy = true;
      process.stdin.setRawMode(false);
      process.stdin.pause();
      await deleteSkill(state, idx);
      state = { ...state, config: loadConfig() };
      state = { ...state, selected: Math.min(state.selected, Math.max(0, config.skills.length - 1)) };
      render(state);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      busy = false;
    }
  });
}

main();
