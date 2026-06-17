# YouTube Transcript Summarizer

基于 **React + TypeScript** 的 Chrome 扩展，用于提取 YouTube 视频字幕并通过 **DeepSeek API** 生成 AI 总结与对话。

## 功能

1. 点击扩展图标，打开侧边栏
2. 点击 **提取 Transcript** 从当前 YouTube 视频页面读取字幕
3. 预览完整字幕文稿，可一键复制
4. 点击 **AI Summary** 进入 DeepSeek 对话界面，自动生成内容总结
5. 可继续与 AI 交流，或点击 **End Chat** 开始新的提取流程

## 技术栈

- React 19 + TypeScript
- Vite（构建 Chrome Extension）
- Chrome Extension Manifest V3
- DeepSeek Chat API

## 安装与使用

### 1. 安装依赖

```bash
npm install
node scripts/generate-icons.mjs
npm run build
```

### 2. 加载扩展到 Chrome

1. 打开 `chrome://extensions/`
2. 开启右上角 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择项目中的 `dist` 文件夹

### 3. 配置 DeepSeek API Key

1. 在 [DeepSeek 平台](https://platform.deepseek.com/api_keys) 获取 API Key
2. 打开扩展侧边栏，点击右上角 ⚙ 设置
3. 输入并保存 API Key

### 4. 提取字幕

1. 打开任意 YouTube 视频页面（`youtube.com/watch?v=...`）
2. 建议先展开视频下方的 **Transcript / 转录文稿** 面板
3. 点击扩展图标，打开侧边栏
4. 点击 **提取 Transcript**

## 开发

```bash
npm run dev   # 监听模式构建
```

修改代码后，在 `chrome://extensions/` 点击扩展的刷新按钮。

## 字幕 DOM 选择器

扩展从以下 DOM 结构提取字幕：

- 容器：`div[target-id="PAmodern_transcript_view"]`
- 片段：`.ytwTranscriptSegmentViewModelHost` 内的 `span` 文本

## 项目结构

```
src/
├── background/       # Service Worker
├── content/          # YouTube 页面 Content Script
├── components/       # React UI 组件
├── popup/            # 侧边栏 React 应用
├── services/         # DeepSeek API
└── types/            # TypeScript 类型
```

## 注意事项

- 必须在 YouTube **视频播放页** 使用，不支持其他页面
- API Key 仅保存在本地 `chrome.storage`，不会上传
- DeepSeek API 调用会产生费用，请注意用量
