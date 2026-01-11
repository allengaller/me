#!/usr/bin/env node

/**
 * 验证配置文件脚本
 * Usage: npm run validate
 * 验证 JSON 配置文件的语法和结构
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../src/config/profile.json');

function validateJSON(content) {
  try {
    JSON.parse(content);
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [error.message]
    };
  }
}

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function deepValidation(config) {
  const warnings = [];

  // 检查 URL 格式
  if (config.social) {
    config.social.forEach((item, index) => {
      if (item.url && !validateURL(item.url)) {
        warnings.push(`social[${index}].url 格式可能不正确: ${item.url}`);
      }
    });
  }

  if (config.projects) {
    config.projects.forEach((project, index) => {
      if (project.github && !validateURL(project.github)) {
        warnings.push(`projects[${index}].github 格式可能不正确: ${project.github}`);
      }
      if (project.live && !validateURL(project.live)) {
        warnings.push(`projects[${index}].live 格式可能不正确: ${project.live}`);
      }
    });
  }

  return warnings;
}

function main() {
  console.log('🔍 验证配置文件...\n');

  try {
    // 检查文件是否存在
    if (!fs.existsSync(CONFIG_PATH)) {
      console.error('❌ 配置文件不存在:', CONFIG_PATH);
      process.exit(1);
    }

    const content = fs.readFileSync(CONFIG_PATH, 'utf8');

    // 验证 JSON 语法
    const jsonValidation = validateJSON(content);
    if (!jsonValidation.valid) {
      console.error('❌ JSON 语法错误:\n');
      jsonValidation.errors.forEach(error => console.error(`  - ${error}\n`));
      process.exit(1);
    }

    // 解析配置
    const config = JSON.parse(content);

    // 深度验证
    const warnings = deepValidation(config);

    console.log('✅ 配置文件验证通过!\n');

    if (warnings.length > 0) {
      console.log('⚠️  警告:\n');
      warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log('');
    }

    console.log('📊 配置统计:');
    console.log(`  - 文件大小: ${(content.length / 1024).toFixed(2)} KB`);
    console.log(`  - 项目数量: ${config.projects?.length || 0}`);
    console.log(`  - 技能类别: ${config.skills?.length || 0}`);
    console.log(`  - 社交链接: ${config.social?.length || 0}\n`);

    console.log('✨ 配置文件一切正常!\n');

  } catch (error) {
    console.error('❌ 验证失败:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
