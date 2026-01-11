# 硅谷风格个人主页

> 优雅、专业、赏心悦目的程序员个人主页，基于 Astro + JSON 构建。

## ✨ 特性

- 🎨 **现代化设计** - 硅谷科技风格，深色主题，动态渐变特效
- 📝 **JSON 配置** - 简单易用的配置文件，无需修改任何代码
- 🚀 **极致性能** - Astro 框架构建，加载速度极快
- 📱 **完全响应式** - 完美适配桌面、平板和移动设备
- 🔧 **维护脚本** - 便捷的命令行工具，轻松管理内容
- ♿ **无障碍友好** - 遵循 WCAG 标准，支持键盘导航
- 🎯 **SEO 优化** - 内置最佳实践，提升搜索引擎排名

## 📁 项目结构

```
me/
├── src/
│   ├── config/
│   │   └── profile.json          # 个人配置文件（核心）
│   ├── layouts/
│   │   └── Layout.astro          # HTML 布局模板
│   └── pages/
│       └── index.astro           # 主页（包含样式）
├── public/
│   ├── favicon.svg              # 网站图标
│   └── images/                 # 静态图片目录
│       └── avatar.jpg           # 头像图片
├── scripts/
│   ├── update-profile.js        # 配置更新脚本
│   ├── add-project.js           # 项目添加脚本
│   └── validate.js             # 配置验证脚本
├── astro.config.mjs            # Astro 配置文件
├── package.json                # 项目依赖和脚本
└── README.md                  # 项目文档
```

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. 安装依赖

```bash
npm install
```

### 2. 配置个人信息

编辑 `src/config/profile.json` 文件，更新你的信息：

```json
{
  "profile": {
    "name": "Your Name",
    "title": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "about": "你的个人简介...",
    "contact": "hello@yourname.dev",
    "avatar": "/images/avatar.jpg"
  }
}
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:4321` 查看效果，支持热更新。

### 4. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

## 🔧 维护命令

### 完整命令列表

```bash
# 开发
npm run dev           # 启动开发服务器
npm run build         # 构建生产版本
npm run preview       # 预览生产构建

# 维护
npm run update:profile   # 验证并格式化配置
npm run add:project    # 交互式添加项目
npm run validate       # 验证配置文件
```

### 命令详细说明

#### 1. 更新配置

验证并格式化配置文件，确保语法正确：

```bash
npm run update:profile
```

**输出示例：**
```
🔍 验证个人资料配置...

✅ 配置文件验证成功!
📝 配置文件已格式化

📊 配置摘要:
  - 姓名: Your Name
  - 职位: Senior Software Engineer
  - 社交链接: 4 个
  - 技能类别: 4 个
  - 项目数量: 3 个
  - 工作经历: 3 条

💡 提示: 运行 npm run dev 查看更新后的主页
```

#### 2. 添加项目

交互式添加新项目到配置：

```bash
npm run add:project
```

**交互流程示例：**
```
📦 添加新项目

项目名称: My Awesome Project
项目描述: A full-stack application...
技术栈 (用逗号分隔, 例如: Go, Docker, Kubernetes): React, Node.js, PostgreSQL
GitHub URL (可选, 直接回车跳过): https://github.com/...
Live URL (可选, 直接回车跳过): https://demo.com
项目亮点 (用逗号分隔, 可选): 1M+ users, 99.9% uptime

✅ 项目添加成功!
📦 项目: My Awesome Project
🔗 技术栈: React, Node.js, PostgreSQL

💡 提示: 运行 npm run dev 查看更新后的主页
```

#### 3. 验证配置

检查配置文件的语法和结构完整性：

```bash
npm run validate
```

**验证内容：**
- JSON 语法正确性
- 必填字段完整性
- URL 格式有效性
- 配置结构规范性

## 📝 配置说明

### Profile（个人信息）

```json
{
  "profile": {
    "name": "Your Name",              // 姓名（必填）
    "title": "Senior Software Engineer", // 职位（必填）
    "location": "San Francisco, CA",   // 位置（必填）
    "about": "个人简介...",            // 简介（必填）
    "contact": "email@example.com",     // 邮箱（可选）
    "avatar": "/images/avatar.jpg"      // 头像路径（可选）
  }
}
```

### Social（社交链接）

```json
{
  "social": [
    {
      "platform": "GitHub",                    // 平台名称
      "url": "https://github.com/username",    // 链接地址
      "icon": "<svg>...</svg>"               // SVG 图标代码
    }
  ]
}
```

**支持的社交平台示例：**
- GitHub: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
- LinkedIn: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
- Twitter/X: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
- Email: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`

### Skills（技能）

```json
{
  "skills": [
    {
      "name": "Backend Development",      // 技能类别名称
      "level": "Expert",               // 技能级别（Expert/Advanced/Intermediate/Beginner）
      "technologies": [
        "Go", "Node.js", "Python"     // 技术栈列表
      ]
    }
  ]
}
```

### Projects（项目）

```json
{
  "projects": [
    {
      "title": "项目名称",                          // 项目标题
      "description": "项目详细描述...",              // 项目描述
      "technologies": ["React", "Node.js"],         // 使用的技术
      "github": "https://github.com/...",           // GitHub 仓库（可选）
      "live": "https://demo.com",                 // 在线演示（可选）
      "highlights": [                              // 项目亮点（可选）
        "亮点1",
        "亮点2",
        "亮点3"
      ]
    }
  ]
}
```

### Experience（工作经历）

```json
{
  "experience": [
    {
      "title": "职位名称",                          // 职位
      "company": "公司名称",                        // 公司
      "period": "2022 - Present",                  // 时间段
      "description": "工作描述...",                  // 职责描述
      "achievements": [                             // 主要成就（可选）
        "成就1",
        "成就2",
        "成就3"
      ]
    }
  ]
}
```

## 🎨 自定义样式

### 修改主题颜色

所有样式定义在 `src/pages/index.astro` 的 `<style>` 标签中。

主要颜色变量：

```css
:root {
  --bg-primary: #0a0e27;           /* 主背景色 - 深蓝黑 */
  --bg-secondary: #111827;         /* 次背景色 - 深灰 */
  --bg-tertiary: #1f2937;         /* 三级背景 - 中灰 */
  --text-primary: #f9fafb;         /* 主文本色 - 白色 */
  --text-secondary: #9ca3af;       /* 次文本色 - 浅灰 */
  --text-muted: #6b7280;           /* 弱化文本 - 中灰 */
  --accent: #3b82f6;               /* 强调色 - 蓝色 */
  --accent-glow: rgba(59, 130, 246, 0.3);  /* 强调色光晕 */
  --accent-secondary: #8b5cf6;      /* 次要强调色 - 紫色 */
  --border: rgba(255, 255, 255, 0.1); /* 边框颜色 */
  --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 渐变1 */
  --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);  /* 渐变2 */
  --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);  /* 渐变3 */
}
```

### 修改渐变动画

```css
.gradient-orb {
  animation: float 8s ease-in-out infinite;  /* 动画时长可以调整 */
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);  /* 可以调整移动距离 */
  }
}
```

### 调整卡片样式

```css
.skill-card, .project-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;  /* 圆角大小 */
  padding: 2rem;       /* 内边距 */
}
```

## 📦 添加图片

### 添加头像

1. 将头像图片放到 `public/images/` 目录
2. 建议尺寸：`400x400` 像素（正方形）
3. 支持格式：JPG、PNG、WEBP
4. 在配置中引用：

```json
{
  "profile": {
    "avatar": "/images/avatar.jpg"
  }
}
```

### 添加项目截图

1. 将截图放到 `public/images/` 目录
2. 建议尺寸：`1920x1080` 像素（16:9）
3. 在项目配置中添加截图字段（需要修改模板）

## 🌐 部署指南

### 准备部署

```bash
# 1. 构建生产版本
npm run build

# 2. 检查构建产物
ls dist/
```

### 方案 1: Vercel（推荐）

**优点：** 免费、自动 CI/CD、全球 CDN、HTTPS

**步骤：**

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 部署：
```bash
vercel --prod
```

4. 按提示完成配置，网站将自动部署到 `https://your-project.vercel.app`

**自动化部署（推荐）：**
1. 将代码推送到 GitHub
2. 在 Vercel 控制台导入项目
3. 启用 GitHub 自动部署
4. 每次 push 到 main 分支会自动触发部署

### 方案 2: Netlify

**优点：** 免费、表单功能、函数支持

**步骤：**

1. 构建项目：
```bash
npm run build
```

2. 在 Netlify 控制台创建新站点

3. 上传 `dist/` 目录，或通过 Git 连接

4. 配置构建设置：
```yaml
Build command: npm run build
Publish directory: dist
```

**Netlify CLI 部署：**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 方案 3: GitHub Pages（推荐用于个人主页）

**优点：** 免费、集成 GitHub、自定义域名支持、完美配合 GitHub 托管

**准备工作：**

1. **创建 GitHub 仓库**
   - 登录 GitHub，点击右上角 `+` → `New repository`
   - 仓库名称建议：`yourusername.github.io`（用于用户主页）或 `portfolio`（用于项目页）
   - 设置为 Public（公开）
   - 初始化 README，然后点击 Create repository

2. **上传代码到 GitHub**
   ```bash
   # 初始化 Git（如果还没有）
   git init

   # 添加所有文件
   git add .

   # 提交更改
   git commit -m "Initial commit: Silicon Valley style portfolio"

   # 关联远程仓库（替换你的用户名和仓库名）
   git remote add origin https://github.com/yourusername/your-username.github.io.git

   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

3. **修改 Astro 配置文件**
   编辑 `astro.config.mjs`：
   ```javascript
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://yourusername.github.io',  // 替换为你的 GitHub 用户名
     base: '/',  // 如果仓库名是 username.github.io 则留空，否则写 /repo-name
     build: {
       format: 'file'
     },
     vite: {
       optimizeDeps: {
         exclude: ['aria-query', 'axobject-query']
       }
     }
   });
   ```

   **重要说明：**
   - 如果仓库名是 `yourusername.github.io`，`base` 设为 `'/'`
   - 如果仓库名是其他（如 `portfolio`），`base` 设为 `'/portfolio'`

4. **创建 GitHub Actions 工作流**
   创建 `.github/workflows/deploy.yml`：
   ```bash
   mkdir -p .github/workflows
   ```

   编辑 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     # 每次推送到 main 分支时触发
     push:
       branches: [main]
     # 允许手动触发部署
     workflow_dispatch:

   # 设置权限
   permissions:
     contents: read
     pages: write
     id-token: write

   # 防止并发部署
   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
         # 1. 检出代码
         - name: Checkout
           uses: actions/checkout@v4

         # 2. 设置 Node.js
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'

         # 3. 安装依赖
         - name: Install dependencies
           run: npm ci

         # 4. 构建项目
         - name: Build
           run: npm run build

         # 5. 部署到 GitHub Pages
         - name: Deploy to GitHub Pages
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist

         # 6. 配置和发布 Pages
         - name: Upload artifact
           uses: actions/deploy-pages@v4
   ```

5. **提交并推送工作流文件**
   ```bash
   git add .github/workflows/deploy.yml astro.config.mjs
   git commit -m "Add GitHub Actions deployment workflow"
   git push
   ```

6. **在 GitHub 启用 Pages（详细配置步骤）**

   **第一步：进入仓库设置页面**
   - 访问你的 GitHub 仓库
   - 点击仓库页面右上角的 "Settings" 按钮（⚙️ 图标）

   **第二步：找到 Pages 设置**
   - 在左侧边栏菜单中向下滚动
   - 找到 "Code and automation" 部分
   - 点击 "Pages" 选项（会打开 Pages 设置页面）

   **第三步：配置 Build and deployment（构建和部署）**
   在 "Build and deployment" 部分进行以下配置：

   **① Source（源）：**
   - 点击下拉菜单
   - 选择 "GitHub Actions"（而不是 Deploy from a branch）
   - 这将使用我们在步骤 4 中创建的 GitHub Actions 工作流

   **② Branch（分支）：**
   - 选择 Source 后，"Branch" 选项会自动隐藏
   - 因为选择 GitHub Actions 后，由工作流文件指定分支

   **③ 点击 "Save" 按钮**
   - 点击页面底部的 "Save" 按钮保存设置

   **重要提示：**
   - 如果之前选择了 "Deploy from a branch"，需要先切换到 "GitHub Actions"
   - 切换后，GitHub 会自动运行一次 Actions 工作流
   - 如果之前有 gh-pages 分支，切换到 GitHub Actions 后可以删除该分支

   **第四步：查看部署状态**
   - 保存设置后，页面会显示 "Latest deployment" 最新部署状态
   - 点击 "View deployment" 可以查看部署详情
   - 部署完成通常需要 1-3 分钟

   **第五步：访问你的网站**
   - 在 Pages 设置页面的顶部，你会看到你的网站 URL
   - 格式：`https://yourusername.github.io` 或 `https://yourusername.github.io/repo-name`
   - 点击链接即可访问你的个人主页

   **页面设置说明：**
   
   在同一个 Pages 设置页面，还有其他配置选项：

   **① Custom domain（自定义域名）：**
   - 如果你有自己的域名（如 yourname.com）
   - 在 "Custom domain" 输入框中输入域名
   - 点击 "Add" 添加域名
   - 添加后需要配置 DNS（见后面"自定义域名"章节）

   **② Enforce HTTPS（强制 HTTPS）：**
   - 默认自动勾选，强烈建议保持勾选状态
   - 这会为你的网站提供安全的 HTTPS 连接
   - 如果添加自定义域名，GitHub 会自动配置 SSL 证书

   **③ Source visibility（源可见性）：**
   - 默认为 Public，意味着任何人都可以查看源代码
   - 这是个人主页的最佳选择

7. **等待部署完成**
   - 在仓库的 "Actions" 标签页查看部署进度
   - 部署成功后，点击绿色的勾号查看详情
   - 页面底部会显示部署的 URL

**访问你的网站：**

网站 URL 取决于你的仓库名称：

**场景 1：用户主页（User Pages）**
- 仓库名称：`yourusername.github.io`
- 访问地址：`https://yourusername.github.io`
- 示例：如果你的 GitHub 用户名是 `john`，仓库名是 `john.github.io`
  - 访问地址：`https://john.github.io`

**场景 2：项目主页（Project Pages）**
- 仓库名称：其他名称（如 `portfolio`、`my-website`）
- 访问地址：`https://yourusername.github.io/repo-name`
- 示例：如果你的用户名是 `john`，仓库名是 `portfolio`
  - 访问地址：`https://john.github.io/portfolio`

**配置对照表：**

| 仓库名称 | `site` 配置 | `base` 配置 | 访问地址 |
|---------|-------------|-------------|-----------|
| `username.github.io` | `https://username.github.io` | `/` | `https://username.github.io` |
| `portfolio` | `https://username.github.io` | `/portfolio` | `https://username.github.io/portfolio` |
| `my-site` | `https://username.github.io` | `/my-site` | `https://username.github.io/my-site` |

**重要配置说明：**
- `site`：始终设置为 `https://yourusername.github.io`（你的 GitHub 用户名）
- `base`：
  - 如果仓库名是 `username.github.io`，设置为 `/`（斜杠）
  - 如果仓库名是其他名称，设置为 `/仓库名`（如 `/portfolio`）

**自动部署：**
- 配置完成后，每次你推送代码到 main 分支，GitHub Actions 会自动构建并部署
- 无需手动操作，完全自动化！

**自定义域名（可选）：**

1. 在你的 DNS 提供商处添加 CNAME 记录：
   ```
   类型: CNAME
   名称: @（或 www）
   值: yourusername.github.io
   ```

2. 在 GitHub 仓库的 Pages 设置中：
   - 在 "Custom domain" 输入你的域名（如 `yourname.com`）
   - 点击 Save
   - 等待 DNS 传播（通常几分钟到几小时）

3. 勾选 "Enforce HTTPS"

**完整示例流程：**

```bash
# 1. 克隆或初始化项目
cd /path/to/your/project

# 2. 配置个人信息
# 编辑 src/config/profile.json

# 3. 测试本地构建
npm run build

# 4. 初始化 Git（如果需要）
git init
git add .
git commit -m "Initial commit: Portfolio setup"

# 5. 创建 GitHub 仓库并推送
# 在 GitHub 上创建新仓库后：
git remote add origin https://github.com/yourusername/your-username.github.io.git
git branch -M main
git push -u origin main

# 6. 在 GitHub 仓库中添加工作流文件
# (内容见上面的步骤 4)

# 7. 推送工作流文件
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push

# 8. 在 GitHub 仓库 Settings 中启用 GitHub Actions 作为 Pages 源

# 9. 等待几分钟，访问 https://yourusername.github.io
```

**常见问题排查：**

1. **部署失败（Actions 显示红色 ❌）**

   **问题表现：** GitHub Actions 工作流运行失败

   **排查步骤：**
   - 点击失败的 workflow run（红色的 ❌）
   - 展开失败的步骤查看详细错误信息

   **常见原因和解决方案：**

   a) **Node.js 版本不匹配**
   ```
   错误信息：Error: Node.js version not found
   解决方案：检查工作流文件中的 node-version 是否为 '18'
   ```

   b) **依赖安装失败**
   ```
   错误信息：npm ERR! code ERESOLVE
   解决方案：删除 node_modules 重新安装
   ```
   c) **构建错误**
   ```
   错误信息：Build failed with errors
   解决方案：本地运行 npm run build 检查错误
   ```
   d) **配置文件错误**
   ```
   错误信息：Failed to parse astro.config.mjs
   解决方案：检查 astro.config.mjs 语法是否正确
   ```

2. **访问 404（页面不存在）**

   **问题表现：** 浏览器显示 404 Not Found

   **排查步骤：**

   a) **检查 Pages 设置**
   - 确认 Pages 设置中 Source 已选择为 "GitHub Actions"
   - 如果选择的是 "Deploy from a branch"，需要切换

   b) **检查仓库名称**
   - 确认访问的 URL 与仓库名称一致
   - 例如：如果仓库名是 `portfolio`，URL 应该是 `https://username.github.io/portfolio`

   c) **检查 base 配置**
   - 打开 `astro.config.mjs`
   - 确认 `base` 配置正确
   ```
   仓库名是 username.github.io: base: '/'
   仓库名是 portfolio: base: '/portfolio'
   ```

   d) **等待 DNS 传播**
   - 如果使用了自定义域名，需要等待几分钟到几小时
   - 使用 `nslookup yourname.com` 检查 DNS 是否指向 GitHub

3. **样式加载异常（页面显示但没有样式）**

   **问题表现：** HTML 加载了，但没有任何样式，页面混乱

   **排查步骤：**

   a) **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 是否有 CSS 文件 404 错误

   b) **检查 base 路径配置**
   - 如果仓库名不是 `username.github.io`，必须设置 `base`
   - 例如：仓库名是 `portfolio`，设置 `base: '/portfolio'`

   c) **检查相对路径**
   - 确保所有静态资源使用相对路径（如 `/images/avatar.jpg`）

   d) **清除浏览器缓存**
   - Windows: Ctrl + Shift + Delete
   - Mac: Cmd + Shift + Delete
   - 或使用无痕模式访问

4. **部署缓慢或超时**

   **问题表现：** GitHub Actions 运行时间过长或超时

   **排查步骤：**

   a) **检查构建时间**
   - 正常构建应该在 1-3 分钟内完成
   - 如果超过 10 分钟，可能有问题

   b) **检查依赖大小**
   - node_modules 太大会导致上传慢
   - 使用 npm ci 而不是 npm install

   c) **检查 Actions 限制**
   - GitHub 有并发限制，多个 workflow 同时运行会排队

5. **GitHub Actions 权限错误**

   **问题表现：** Error: Resource not accessible by integration

   **排查步骤：**

   a) **检查仓库权限**
   - Settings → Actions → General
   - 在 "Workflow permissions" 中选择 "Read and write permissions"
   - 保存设置

   b) **检查工作流权限配置**
   - 确保 `.github/workflows/deploy.yml` 中有正确的 permissions 配置：
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

6. **需要重新部署**

   当你修改了内容后，触发重新部署：

   **方法 1：推送代码（推荐）**
   ```bash
   # 添加修改的文件
   git add .

   # 提交更改
   git commit -m "Update content"

   # 推送到 GitHub
   git push

   # GitHub Actions 会自动触发部署
   ```

   **方法 2：手动触发（可选）**
   - 访问仓库的 Actions 标签页
   - 点击左侧的工作流名称（"Deploy to GitHub Pages"）
   - 点击右侧的 "Run workflow" 按钮
   - 选择分支（通常是 main）并运行

   **方法 3：在 GitHub 网页编辑（快速）**
   - 访问仓库
   - 点击要编辑的文件（如 src/config/profile.json）
   - 点击右上角 ✏️ 编辑按钮
   - 修改内容后点击 "Commit changes"
   - 自动触发部署

**分支管理建议：**

```bash
# 创建开发分支
git checkout -b dev

# 在 dev 分支上工作
# ...修改文件...
git add .
git commit -m "Add new project"

# 推送到 GitHub
git push origin dev

# 在 GitHub 上创建 Pull Request
# 合并到 main 后自动触发部署
```

### 方案 4: Cloudflare Pages

**优点：** 全球 CDN、免费 SSL、无限带宽

**步骤：**

1. 创建 Cloudflare 账户并连接 GitHub

2. 在 Cloudflare Pages 控制台创建新项目

3. 选择你的 GitHub 仓库

4. 配置构建设置：
```yaml
Build command: npm run build
Build output directory: dist
```

5. 点击部署

### 方案 5: 传统服务器

**步骤：**

1. 构建项目：
```bash
npm run build
```

2. 使用 FTP/SFTP 或 SSH 上传 `dist/` 目录到服务器

3. 配置 Nginx：
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/your-site/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. 配置 HTTPS（推荐使用 Let's Encrypt）

## 🔍 日常维护

### 更新内容

1. **编辑配置文件**：
   ```bash
   # 直接编辑 src/config/profile.json
   ```

2. **验证配置**：
   ```bash
   npm run validate
   ```

3. **本地预览**：
   ```bash
   npm run dev
   ```

4. **构建并部署**：
   ```bash
   npm run build
   # 然后按照部署方案上传
   ```

### 添加新项目

使用交互式脚本：
```bash
npm run add:project
```

或手动编辑 `src/config/profile.json`，在 `projects` 数组中添加新项。

### 添加新工作经历

直接编辑 `src/config/profile.json`，在 `experience` 数组中添加新项。

### 更新技能

直接编辑 `src/config/profile.json`，在 `skills` 数组中修改或添加新项。

## 🛠️ 故障排除

### 构建失败

```bash
# 清除缓存
rm -rf node_modules .astro dist
npm install

# 重新构建
npm run build
```

### 样式不生效

1. 检查浏览器缓存（Ctrl+Shift+R 强制刷新）
2. 检查 `src/pages/index.astro` 中的样式
3. 使用浏览器开发者工具检查元素

### 配置文件错误

```bash
# 使用验证脚本检查
npm run validate

# 如果有错误，根据提示修复
```

### 部署失败

1. 检查本地构建是否成功：`npm run build`
2. 检查 `dist/` 目录是否存在且包含文件
3. 查看部署平台日志
4. 确认网络连接正常

## 📊 性能优化

### 1. 图片优化

使用 WebP 格式：
```bash
# 安装工具
npm install -g imagemin-cli

# 优化图片
imagemin images/*.jpg --out-dir=optimized/
```

### 2. 构建优化

在 `astro.config.mjs` 中添加：
```javascript
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true
});
```

### 3. CDN 加速

将静态资源托管到 CDN（如 Cloudflare、AWS CloudFront）

## 🔒 安全建议

1. **不要在配置文件中存储敏感信息**（如 API 密钥）
2. **使用 HTTPS**（所有部署方案都支持）
3. **定期更新依赖**：`npm audit fix`
4. **配置 CSP 头**（在服务器或部署平台）

## 📈 监控和分析

### 添加 Google Analytics

在 `src/layouts/Layout.astro` 的 `<head>` 中添加：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 性能监控

使用 Lighthouse 检查性能：
```bash
npm install -g lighthouse
lighthouse https://your-site.com --view
```

## 📚 相关资源

- [Astro 官方文档](https://docs.astro.build)
- [Astro 部署指南](https://docs.astro.build/en/guides/deploy/)
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 License

MIT

## 💡 常见问题

### Q: 如何添加新的社交平台？
A: 在 `social` 数组中添加新对象，需要提供 platform、url 和 icon 字段。

### Q: 可以添加博客功能吗？
A: 可以，使用 Astro 的内容集合（Content Collections）功能。

### Q: 如何修改字体？
A: 在 `src/layouts/Layout.astro` 中添加 Google Fonts 链接，然后在样式中引用。

### Q: 构建产物很大怎么办？
A: 检查是否有大图片未压缩，使用 astro-image 插件优化图片。

---

**Made with ❤️ using Astro**
