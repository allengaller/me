#!/usr/bin/env node

/**
 * 添加新项目脚本
 * Usage: npm run add:project
 * 交互式地添加新项目到配置文件
 */

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

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function collectProjectInfo() {
  console.log('\n📦 添加新项目\n');

  const project = {
    title: await question('项目名称: '),
    description: await question('项目描述: '),
    technologies: [],
    github: '',
    live: '',
    highlights: []
  };

  // 收集技术栈
  const techInput = await question('技术栈 (用逗号分隔, 例如: Go, Docker, Kubernetes): ');
  if (techInput) {
    project.technologies = techInput.split(',').map(t => t.trim());
  }

  // 可选字段
  project.github = await question('GitHub URL (可选, 直接回车跳过): ') || '';
  project.live = await question('Live URL (可选, 直接回车跳过): ') || '';

  // 收集亮点
  const highlightsInput = await question('项目亮点 (用逗号分隔, 可选): ');
  if (highlightsInput) {
    project.highlights = highlightsInput.split(',').map(h => h.trim());
  }

  return project;
}

async function main() {
  try {
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(configContent);

    const newProject = await collectProjectInfo();

    // 添加到项目列表开头
    config.projects.unshift(newProject);

    // 写回文件
    const jsonContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(CONFIG_PATH, jsonContent, 'utf8');

    console.log('\n✅ 项目添加成功!');
    console.log(`📦 项目: ${newProject.title}`);
    console.log(`🔗 技术栈: ${newProject.technologies.join(', ')}\n`);
    console.log('💡 提示: 运行 npm run dev 查看更新后的主页\n');

  } catch (error) {
    console.error('\n❌ 添加项目时出错:');
    console.error(error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
