#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../src/config/profile.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  live: string;
  highlights: string[];
}

interface ProfileConfig {
  projects: Project[];
  [key: string]: unknown;
}

async function collectProjectInfo(): Promise<Project> {
  console.log('\n📦 添加新项目\n');

  const project: Project = {
    title: await question('项目名称: '),
    description: await question('项目描述: '),
    technologies: [],
    github: '',
    live: '',
    highlights: []
  };

  const techInput = await question('技术栈 (用逗号分隔, 例如: Go, Docker, Kubernetes): ');
  if (techInput) {
    project.technologies = techInput.split(',').map(t => t.trim());
  }

  project.github = await question('GitHub URL (可选, 直接回车跳过): ') || '';
  project.live = await question('Live URL (可选, 直接回车跳过): ') || '';

  const highlightsInput = await question('项目亮点 (用逗号分隔, 可选): ');
  if (highlightsInput) {
    project.highlights = highlightsInput.split(',').map(h => h.trim());
  }

  return project;
}

async function main() {
  try {
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config: ProfileConfig = JSON.parse(configContent);

    const newProject = await collectProjectInfo();

    config.projects.unshift(newProject);

    const jsonContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(CONFIG_PATH, jsonContent, 'utf8');

    console.log('\n✅ 项目添加成功!');
    console.log(`📦 项目: ${newProject.title}`);
    console.log(`🔗 技术栈: ${newProject.technologies.join(', ')}\n`);
    console.log('💡 提示: 运行 npm run dev 查看更新后的主页\n');

  } catch (error: unknown) {
    console.error('\n❌ 添加项目时出错:');
    console.error((error as Error).message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
