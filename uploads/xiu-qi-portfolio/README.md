# 修琪 · Personal Portfolio

一个基于 Vite + React 的个人简历网站。

## 📂 项目结构

```
.
├── index.html                 入口 HTML(含 Google Fonts 链接)
├── package.json               依赖清单
├── vite.config.js             Vite 配置
├── public/                    静态资源(直接通过 / 访问)
│   ├── photo1.jpg             首页轮播照片 1(玩具店 1)
│   ├── photo2.jpg             首页轮播照片 2(红心气球)
│   ├── photo3.jpg             首页轮播照片 3(玩具店 2)
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx               React 入口
    ├── App.jsx                根组件
    ├── styles/
    │   └── global.css         所有样式(包括响应式、动效 keyframes)
    ├── hooks/
    │   └── useScrollReveal.js Scroll-driven 词级揭示 hook
    └── components/
        ├── CustomCursor.jsx   自定义光标 + 点击粒子特效
        ├── TopBar.jsx         顶部导航
        ├── PageIndicator.jsx  右侧页面指示器小圆点
        ├── Hero.jsx           第一页(曲线文字 + 照片切换 + 视差)
        ├── About.jsx          第二页(介绍 + 优势 + AI Agent 占位 + 技能)
        ├── Works.jsx          第三页(三段工作经历时间线)
        └── Footer.jsx         教育 + 联系方式
```

## 🚀 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器(默认 http://localhost:5173)
npm run dev

# 3. 构建生产版本(输出到 dist/)
npm run build

# 4. 本地预览构建结果
npm run preview
```

## 📦 主要依赖

- **React 19** + **Vite 8** - 框架与构建工具
- **framer-motion** - 动画(预装,可用于未来的页面过渡)
- **gsap** - 时间轴动画(预装,可用于复杂滚动动效)
- **three** + **@react-three/fiber** + **@react-three/drei** - 3D 场景(预装,可用于背景特效)

## 🎨 设计风格

- **配色**: 米驼色背景 + 衬线大字 + 黄绿/橙红强调色
- **字体**: DM Serif Display(英文衬线) + Noto Serif SC(中文衬线) + Inter(辅助)
- **核心动效**:
  - 第一页: 大字标题沿曲线无限循环(SVG textPath),三张照片自动+滚轮+点击切换,鼠标视差,Ken-Burns 缓推
  - 第二页/第三页: ScrollReveal 词级揭示(逐字逐词从模糊+半透明渐变到清晰)
  - 全局: 自定义光标(黑点+追随圆环)、点击粒子爆开特效

## 🤖 AI Agent 占位

`src/components/About.jsx` 中的 `<aside class="agent-slot">` 区域是为未来接入 AI Agent 预留的占位 UI。
当前是静态的对话框样式,可对接 Dify / Coze / OpenAI 等 API。

## 📝 内容来源

所有文字内容来自简历 PDF。原始单文件 HTML 版本可在 `_legacy/resume.html` 找到(已从此包中移除,在原项目目录里)。

## 🔧 浏览器兼容

现代浏览器(Chrome 90+ / Safari 14+ / Firefox 90+)。
桌面端体验最佳。移动端 viewport < 1024px 时光标 / 视差等效果会自动降级。
