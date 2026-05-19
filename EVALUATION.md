# ME - 个人档案生成器 项目全面评估报告

> 评估日期: 2026-05-18
> 评估方法: project-evaluation skill (7 维度框架)

## 一、项目概况

ME 是一个基于 Astro 4.x 构建的个人档案生成工具，提供 6 步向导创建 SOUL.md 格式档案，支持 GitHub 导入、多格式导出，以及两个独立的自我探索模式（"靠谱模式" 18 题、"自我蒸馏" 12 题）。

| 指标 | 值 |
|------|------|
| 技术栈 | Astro 4.x, 原生 CSS, localStorage, GitHub API, TypeScript + Zod |
| 代码规模 | src/ 56 文件 ~16,427 LOC; packages/core 12 文件 |
| Git 成熟度 | 9 次提交, 单分支 (main) |
| 构建工具 | Vite (Astro 内置) |
| 部署 | GitHub Pages (GitHub Actions) |

## 二、架构评估                           评分：4/10

### 优点
- [+] Astro 静态输出天然快速，零服务端依赖
- [+] 组件目录结构清晰 (homepage/wizard/import/export/resume/ui)
- [+] CSS 自定义属性实现主题系统，设计感良好
- [+] packages/core 中的类型定义非常完整（10 个维度、Evidence 系统、版本控制），说明有长期架构思考

### 问题
- [-] 严重代码膨胀: reliable.astro 876 行、distill.astro 705 行、github.astro 581 行，大量 JS 直接内嵌在 Astro 页面的 `<script>` 标签中，没有抽离为独立模块
- [-] 三套向导系统（wizard/、reliable.、distill.）各自独立，状态管理、导航、预览、导出逻辑大量重复，没有共享抽象
- [-] packages/core（TypeScript + Zod）与 src/ 前端（JavaScript）完全断开 —— core 的类型和校验 schema 从未被前端引用，变成了空中楼阁
- [-] 配置中存在 Vite workaround（external: aria-query/axobject-query），说明依赖关系有问题未根本解决
- [-] 没有 workspace 配置（pnpm-workspace.yaml 或 npm workspaces），packages/core 无法被主项目自动 link

## 三、代码质量                           评分：4/10

### 优点
- [+] storage.js 结构清晰，版本控制、防抖保存、错误处理都有
- [+] soul-generator.js 使用模板字符串，逻辑可读
- [+] CSS 代码整洁，字体选择 (Cinzel + IBM Plex Sans + Fira Code) 品质感强

### 问题
- [-] 无 TypeScript: src/ 全部是 .js，Layout.astro 中却混用了 TypeScript 语法（setLanguage(newLang: string)）—— 这只在 Astro 编译时有效，util 文件无此保护
- [-] profile.json 仍是占位符数据 ("Your Name", "Tech Startup", "yourusername")，未填入真实信息
- [-] astro.config.mjs 的 site 仍为 'https://yourusername.dev'
- [-] distill.astro 和 reliable.astro 中存在 XSS 隐患：esc() 函数只做了基础 HTML 转义，innerHTML 直接拼接用户输入
- [-] 无 lint 配置（无 .eslintrc、无 prettier）
- [-] .DS_Store 已存在于仓库中（尽管 .gitignore 有规则，说明曾被 force-add 或在规则添加前提交）
- [-] 内联 SVG 在 profile.json 中重复存储，应抽为独立文件

## 四、测试覆盖                           评分：1/10

无任何测试文件。无 `*.test.*`、无 `*.spec.*`。
packages/core 的 validate.ts 有 validateHub 函数，但无对应测试。
package.json 无 test 脚本。
对一个工具类项目而言，零测试意味着任何改动都无法验证正确性。

## 五、安全性                             评分：6/10

### 优点
- [+] 纯客户端应用，无服务端数据，无 API key 暴露风险
- [+] GitHub 导入使用公开 API，无 OAuth token 泄露问题
- [+] localStorage 隔离，数据不离开浏览器

### 问题
- [-] 用户输入通过 innerHTML 拼接（distill.astro, reliable.astro），虽有 esc() 但覆盖不全面，且无 CSP 头保护
- [-] GitHub API 调用无认证头，受速率限制（60 次/小时），高频使用会触发 403
- [-] 导出的 HTML 模板（generateHTML）直接内嵌用户数据，生成的文件若被托管可能携带 XSS payload

## 六、性能                               评分：7/10

### 优点
- [+] Astro SSG 输出纯静态 HTML，首次加载极快
- [+] compressHTML: true 减小了输出体积
- [+] CSS 动画使用 transform/opacity，GPU 加速

### 问题
- [-] Google Fonts 同步加载三组字体，可能阻塞首屏渲染
- [-] 每个页面都是独立 HTML，无代码分割（对 SSG 来说影响有限）

## 七、开发体验                           评分：4/10

### 优点
- [+] README 写得详细，有使用指南、项目结构、部署说明
- [+] GitHub Actions 部署流程完整
- [+] 脚本工具齐全（update:profile, add:project, validate, skills）

### 问题
- [-] 缺少 LICENSE 文件（README 声称 MIT 但文件不存在）
- [-] 无 CONTRIBUTING.md
- [-] 无 pre-commit hooks、无 CI 之外的质量门禁
- [-] packages/core 完全无法运行：未配置 workspace，无 build 产物
- [-] 没有 type-check / lint / format 脚本

## 总评：4.3/10

这是一个有野心但处于极早期的项目。产品设计和视觉品味出色——从字体选择、主题系统、交互设计（双栏实时预览、分步向导）到"靠谱模式"的概念设计都体现了清晰的产品思维。

但工程实现严重落后于设计愿景。三套向导各自为战、零测试覆盖、packages/core 成了孤岛、大量 JS 内联在页面中无法复用。项目目前处于"概念验证"阶段，离可维护的生产代码还有很大距离。

### 最突出的优势
1. **设计品味** —— 主题系统、字体搭配、动画效果都在线
2. **产品概念** —— "靠谱模式"/"自我蒸馏" 是独特的差异化功能
3. **packages/core 的类型设计** —— 10 维度模型、Evidence 系统、Zod 校验，架构思考先行

### 最需要改进的方面（优先级排序）
1. 抽取共享逻辑 —— 三套向导的状态管理/导航/预览/导出应抽为可复用组件或 composable
2. 接入 packages/core —— 配置 workspace，让前端使用 TypeScript 类型和 Zod 校验
3. 添加测试 —— 至少为 utils/ 写单元测试
4. 消除内联脚本 —— 将 reliable.astro/distill.astro 的 JS 逻辑抽为独立模块
5. 清理占位符 —— profile.json、astro.config site URL、LICENSE 文件、.DS_Store
