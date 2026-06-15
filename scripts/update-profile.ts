#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../src/config/profile.json');

interface SocialItem {
  platform: string;
  url: string;
}

interface Skill {
  name: string;
  level: string;
  technologies: string[];
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
}

interface ProfileConfig {
  profile: {
    name: string;
    title: string;
    location: string;
    about: string;
  };
  social: SocialItem[];
  skills: Skill[];
  projects: Project[];
  experience: Record<string, unknown>[];
}

function validateConfig(config: ProfileConfig): string[] {
  const requiredFields: (keyof ProfileConfig)[] = ['profile', 'social', 'skills', 'projects', 'experience'];
  const errors: string[] = [];

  requiredFields.forEach(field => {
    if (!config[field]) {
      errors.push(`缺少必填字段: ${field}`);
    }
  });

  if (config.profile) {
    const profileFields: (keyof ProfileConfig['profile'])[] = ['name', 'title', 'location', 'about'];
    profileFields.forEach(field => {
      if (!config.profile[field]) {
        errors.push(`profile.${field} 是必填字段`);
      }
    });
  }

  if (config.social) {
    if (!Array.isArray(config.social) || config.social.length === 0) {
      errors.push('social 必须是一个非空数组');
    } else {
      config.social.forEach((item, index) => {
        if (!item.platform || !item.url) {
          errors.push(`social[${index}] 缺少 platform 或 url 字段`);
        }
      });
    }
  }

  if (config.skills) {
    if (!Array.isArray(config.skills) || config.skills.length === 0) {
      errors.push('skills 必须是一个非空数组');
    } else {
      config.skills.forEach((skill, index) => {
        if (!skill.name || !skill.level || !skill.technologies) {
          errors.push(`skills[${index}] 缺少必填字段`);
        }
      });
    }
  }

  if (config.projects) {
    if (!Array.isArray(config.projects) || config.projects.length === 0) {
      errors.push('projects 必须是一个非空数组');
    } else {
      config.projects.forEach((project, index) => {
        if (!project.title || !project.description || !project.technologies) {
          errors.push(`projects[${index}] 缺少必填字段`);
        }
      });
    }
  }

  return errors;
}

function main() {
  console.log('🔍 验证个人资料配置...\n');

  try {
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config: ProfileConfig = JSON.parse(configContent);

    const errors = validateConfig(config);

    if (errors.length > 0) {
      console.error('❌ 配置验证失败:\n');
      errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }

    const jsonContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(CONFIG_PATH, jsonContent, 'utf8');

    console.log('✅ 配置文件验证成功!');
    console.log('📝 配置文件已格式化\n');

    console.log('📊 配置摘要:');
    console.log(`  - 姓名: ${config.profile.name}`);
    console.log(`  - 职位: ${config.profile.title}`);
    console.log(`  - 社交链接: ${config.social.length} 个`);
    console.log(`  - 技能类别: ${config.skills.length} 个`);
    console.log(`  - 项目数量: ${config.projects.length} 个`);
    console.log(`  - 工作经历: ${config.experience.length} 条\n`);

    console.log('💡 提示: 运行 npm run dev 查看更新后的主页\n');

  } catch (error: unknown) {
    console.error('❌ 处理配置文件时出错:');
    console.error((error as Error).message);
    process.exit(1);
  }
}

main();
