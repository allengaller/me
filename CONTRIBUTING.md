# Contributing to ME

感谢你对 ME 项目的关注！

## 开发环境

```bash
# 前置要求
node >= 18
npm >= 9

# 安装依赖（包含 workspace packages）
npm install

# 构建 core 包
npm run build:core

# 启动开发服务器
npm run dev
```

## 项目结构

```
me/
├── src/                    # Astro 前端源码
│   ├── components/         # UI 组件 (.astro)
│   ├── pages/              # 路由页面 (.astro)
│   ├── scripts/            # 页面逻辑模块 (.js)
│   ├── utils/              # 工具函数 (.ts)
│   ├── styles/             # 全局样式和主题
│   ├── config/             # 配置文件
│   └── layouts/            # 布局组件
├── packages/core/          # TypeScript 核心库 (类型、校验、存储)
├── public/                 # 静态资源
├── scripts/                # 维护脚本
└── dist/                   # 构建输出 (git-ignored)
```

## 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (localhost:4321) |
| `npm run build` | 构建生产版本 |
| `npm run build:core` | 构建 packages/core |
| `npm run test` | 运行测试 |
| `npm run test:watch` | 监听模式测试 |
| `npm run lint` | ESLint 检查 |
| `npm run format` | Prettier 格式化 |

## 代码规范

- **TypeScript**: 新文件请使用 `.ts` 扩展名
- **Astro 组件**: 使用 `.astro` 扩展名
- **样式**: 使用 CSS 自定义属性，遵循现有主题系统
- **向导页面**: 使用 `src/utils/wizard-engine.ts` 共享引擎
- **测试**: 关键工具函数需附带 `.test.ts` 文件

## 提交规范

- `feat:` 新功能
- `fix:` 修复
- `refactor:` 重构
- `docs:` 文档
- `test:` 测试
- `chore:` 维护

## Pull Request

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feat/my-feature`
3. 提交更改: `git commit -m 'feat: add my feature'`
4. 推送分支: `git push origin feat/my-feature`
5. 创建 Pull Request

## License

MIT License - 提交代码即表示同意以 MIT 协议发布。
