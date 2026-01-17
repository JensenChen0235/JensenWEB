# Lusion-Clone 项目说明（全项目级 Spec）

本文件解释整个 `lusion-clone` 目录结构与代码编排方式，
涵盖 `src/`、`public/`、构建与配置文件。

> 范围说明：不包含 `node_modules/` 内部实现，仅做依赖清单层面的说明。

---

## 1. 项目入口与构建链路

- `index.html`
  - Vite HTML 入口，挂载点为 `#root`。
  - `<script type="module" src="/src/main.jsx">` 启动 React。

- `src/main.jsx`
  - React 启动入口：`createRoot(...).render(<App />)`。
  - 引入全局样式 `src/styles/global.css`。

- `src/App.jsx`
  - React Router 路由表。
  - `/` -> `Home`
  - `/projects/:id` -> `ProjectDetail`
  - 使用 `ScrollToTop` 统一处理路由跳转的滚动行为。

- `vite.config.js`
  - Vite 默认配置，使用 `@vitejs/plugin-react`。

- `eslint.config.js`
  - ESLint 配置：React Hooks + React Refresh。
  - 忽略 `dist`。

- `package.json`
  - 关键依赖：React 19、Vite、React Router、GSAP、Framer Motion、
    Lenis、Three.js、R3F、Rapier、Postprocessing、Lottie。

---

## 2. 公共资源（public/）

用于在运行时通过 `/xxx` 直接访问的静态资源：

- 3D/视觉素材：`public/*.png`
  - `public/1.png` ~ `public/8.png`
  - `public/Terabox1.png` ~ `public/Terabox5.png`
- 音频素材：
  - `public/bgm.mp3`（背景音乐）
  - `public/bubble.mp3`、`public/bubble2.mp3`（交互气泡声）
  - `public/bricks.mp3`（点击/冲击声）
  - `public/focus.mp3`（卡片 hover 声）

这些资源被多个组件通过 `new Audio("/xxx.mp3")` 或 `<img src="/...">` 引用。

---

## 3. 全局样式与行为

- `src/styles/global.css`
  - 重置样式、字体与全局颜色变量。
  - Lenis 的辅助样式类（`.lenis-*`）。

- `src/hooks/useLenis.js`
  - 初始化平滑滚动（Lenis）。
  - 通过 `window.lenis` 暴露实例，供其他组件控制滚动状态。

- `src/components/ScrollToTop.jsx`
  - 路由切换时，优先处理 hash 跳转（`#featured-work`）。
  - 若 Lenis 存在，优先调用 `lenis.scrollTo(...)`。

---

## 4. 数据层（内容配置）

- `src/data/project.js`
  - `projectsData`：项目字典，以 `id` 为键。
  - `projectsList`：`Object.values(projectsData)` 供列表使用。
  - 每个项目包含：主题色、文案、服务标签、图片、布局类型、sections 等。
  - `sections` 支持多种模块类型（`tb-*`, `ui-waterfall`, `showcase`,
    `accordion`, `insight`, `dribbble`, `prototype`, `app`, `web` 等）。

- `src/data/lottie/*.json`
  - Lottie 动画数据（用于 `ProjectDetail` 的 UI Waterfall 模块）。

---

## 5. 页面结构

### 5.1 首页（src/pages/Home.jsx）

整体结构：

- `<Canvas3D />`：背景粒子层（三维点云）
- `<Header />`：全局导航 + 菜单
- `<Hero3D />`：三维主视觉，支持点击互动与配色切换
- `<AboutSection />`：品牌介绍与照片堆叠
- `<FeaturedWork />`：项目列表卡片
- `<VideoSection />`：滚动触发的视频展示块
- `<Footer />`：订阅与底部信息

交互补充：

- 全局 hover 音效：监听 `mouseover` 触发 `/bubble.mp3`。
- 接收 `hero3d-color` 事件更新 `activeColor`，供子组件染色。

样式文件：

- `src/pages/Home.css`
- `src/components/*.css`（见组件说明）

### 5.2 项目详情页（src/pages/ProjectDetail.jsx）

功能概览：

- 基于路由 `id` 读取 `projectsData`。
- 通过 `AnimatePresence` 控制加载期与内容入场。
- 核心版块：Header、Hero、Gallery（sections）、Overlay、Next Footer。
- 内置多套 section 渲染逻辑，基于 `section.type` 分支。

关键交互：

- 进入页面前重置滚动位置（配合 Lenis）。
- `ui-waterfall` 点击展示 Overlay（内部演示+文案+复制代码）。
- `showcase`、`accordion`、`insight` 使用索引状态管理选中项。

样式文件：

- `src/pages/ProjectDetail.css`

---

## 6. 组件系统

### 6.1 Header 区域

- `src/components/Header/Header.jsx`
  - Logo + SoundButton + TalkButton + Menu Trigger
  - 接收 `hero3d-color` 用于动态主题色

- `src/components/Header/Menu.jsx`
  - 全屏菜单浮层（AnimatePresence）
  - 三块卡片：导航、订阅、Labs

- `src/components/Header/SoundButton.jsx`
  - 音频开关，控制 `window.soundEnabled` 和 `window.bgmAudio`

- `src/components/Header/TalkButton.jsx`
  - 交互按钮，hover 时背景染色

对应样式：

- `src/components/Header/*.css`

### 6.2 Hero / 3D 场景

- `src/components/Hero.jsx`
  - GSAP 文字入场 + 滚动视差（当前首页未直接使用）

- `src/components/Hero3D.jsx`
  - R3F + Rapier 物理交互场景
  - 点击切换颜色并施加冲击波
  - 背景光晕 shader + 自适应相机 + 环境光设置

- `src/components/Canvas3D.jsx`
  - Three.js 点云背景，跟随鼠标轻微偏移

对应样式：

- `src/components/Hero.css`
- `src/components/Hero3D.css`
- `src/components/Canvas3D.css`

### 6.3 内容模块

- `src/components/AboutSection.jsx`
  - 标题分段动画
  - 照片堆叠切换（3 张）
  - “VIEW PROFILE” 按钮带 hover 动效

- `src/components/FeaturedWork.jsx`
  - 列表渲染 `projectsList`
  - Hover 音效 + GSAP 滚动入场

- `src/components/ProjectCard.jsx`
  - 卡片 hover 动画（图像模糊+位移）

- `src/components/VideoSection.jsx`
  - GSAP ScrollTrigger 渐入
  - 播放按钮占位（无真实播放逻辑）

对应样式：

- `src/components/AboutSection.css`
- `src/components/FeaturedWork.css`
- `src/components/ProjectCard.css`
- `src/components/VideoSection.css`

### 6.4 Footer 与其他

- `src/components/Footer.jsx`
  - 双区块：白色订阅区 + 黑色过渡区
  - 滚动驱动进度条与文字 reveal

- `src/components/Loader.jsx`
  - 页面加载条（目前 `Home` 未使用）

- `src/components/CurvedLine.jsx`
  - SVG 路径绘制（未在 `Home` 中引用）

- `src/components/ui/Arrow.jsx`
  - 通用箭头图标组件

对应样式：

- `src/components/Footer.css`
- `src/components/Loader.css`

---

## 7. 路由与交互事件流

核心事件链路：

- `Hero3D` 点击 -> 更新颜色 -> 触发 `window` 事件：
  - `hero3d-color` 被 `Header` 与 `Home` 监听，统一主题色。

滚动/导航链路：

- `useLenis` 提供平滑滚动。
- `ScrollToTop` 处理路由切换的滚动重置或 hash 定位。
- `ProjectDetail` 在页面切换时强制停/启 Lenis 以避免闪烁。

音效链路：

- `SoundButton` 控制 `window.soundEnabled`。
- `Home` / `FeaturedWork` / `Hero3D` 根据开关播放 hover/click 音效。

---

## 8. CSS 与视觉系统

全局基准：

- 字体与基础颜色定义于 `src/styles/global.css`。
- 组件均采用自有 CSS 文件隔离样式。

主题化方式：

- `ProjectDetail` 通过 CSS 变量注入主题色与阴影配置：
  - `--project-theme`, `--project-text`, `--project-shadow-*` 等。

---

## 9. 文件清单（源码）

### 根目录

- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `eslint.config.js`
- `README.md`

### src/

- `src/main.jsx`
- `src/App.jsx`
- `src/styles/global.css`
- `src/hooks/useLenis.js`
- `src/utils/animations.js`（当前为空）
- `src/data/project.js`
- `src/data/lottie/*.json`
- `src/pages/Home.jsx`
- `src/pages/Home.css`
- `src/pages/ProjectDetail.jsx`
- `src/pages/ProjectDetail.css`
- `src/components/*`（见组件章节）

### public/

- `public/*.png`
- `public/*.mp3`

---

## 10. 可选扩展文档（如果你需要）

如果你还希望更深层的 “逐文件级说明”，我可以生成：

1) 每个组件的 props/状态/事件清单  
2) `ProjectDetail` 每一种 `section.type` 的 DOM 合约与 CSS 依赖  
3) 3D 场景的物理参数与 shader 说明  
4) 资产来源、替换规则与压缩建议

