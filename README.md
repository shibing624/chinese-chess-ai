# 🏮 中国象棋AI人机对弈网站

<div align="center">

![Chinese Chess](https://img.shields.io/badge/Game-Chinese%20Chess-red?style=for-the-badge&logo=chess)
![AI Algorithm](https://img.shields.io/badge/AI-Alpha--Beta%20Pruning-blue?style=for-the-badge&logo=brain)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow?style=for-the-badge&logo=javascript)

**基于极小化极大算法 + Alpha-Beta剪枝的智能中国象棋对弈系统**

[🎮 演示网站](https://shibing624.github.io/chinese-chess-ai/) • [🧠 算法原理](## 🧠 核心算法)

</div>

---

## 🎯 核心功能
- 🎮 **完整象棋规则** - 支持所有棋子移动规则和特殊规则
- 🤖 **智能AI对手** - 基于经典博弈算法，4-6层搜索深度
- 🧠 **多维评估** - 综合棋子价值、位置、机动性等因素
- ⏱️ **实时计时** - 双方计时系统，增加对弈紧张感
- 💡 **智能提示** - AI为玩家提供走法建议
- 📋 **完整记录** - 走法历史记录，支持悔棋功能

## 🎮 演示网站

[https://shibing624.github.io/chinese-chess-ai/](https://shibing624.github.io/chinese-chess-ai/)

## 🚀 快速开始

### 方法一：直接运行（推荐）
```bash
# 克隆项目
git clone https://github.com/shibing624/chinese-chess-ai.git
cd chinese-chess-ai

# 直接用浏览器打开 index.html 即可开始游戏！
open index.html  # macOS
# 或双击 index.html 文件
```

### 方法二：本地服务器
如果遇到CORS限制，可以启动本地服务器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx http-server -p 8000

# 然后访问 http://localhost:8000
```

## 🧠 核心算法

### 极小化极大算法 (Minimax)
```
function minimax(position, depth, maximizingPlayer):
    if depth == 0 or game_over:
        return evaluate(position)
    
    if maximizingPlayer:
        maxEval = -∞
        for each child of position:
            eval = minimax(child, depth-1, false)
            maxEval = max(maxEval, eval)
        return maxEval
    else:
        minEval = +∞
        for each child of position:
            eval = minimax(child, depth-1, true)
            minEval = min(minEval, eval)
        return minEval
```

### Alpha-Beta剪枝优化
- **剪枝效率**: 最优情况下搜索节点数从 O(b^d) 降至 O(b^(d/2))
- **搜索深度**: 默认4层，可调整至6层
- **移动排序**: 优先搜索吃子和强子移动，提高剪枝效率

### 智能评估函数

| 评估维度 | 权重 | 说明 |
|---------|------|------|
| **物质价值** | 最高 | 将10000、车1000、炮550、马400、相/士250、兵150 |
| **位置价值** | 高 | 不同棋子在不同位置的战略价值 |
| **机动性** | 中 | 可移动位置数量，反映灵活性 |
| **控制力** | 中 | 威胁对方棋子的能力 |
| **将军威胁** | 高 | 进攻和防守将/帅的能力 |


## 📁 项目结构

```
chinese-chess-ai/
├── 📄 index.html          # 主页面 - 游戏界面
├── 🎨 style.css           # 样式文件 - 棋盘和UI样式
├── 🎮 main.js             # 主控制器 - 游戏流程控制
├── ♟️  chess.js           # 象棋引擎 - 规则和逻辑
├── 🤖 ai.js               # AI模块 - 算法实现
├── 🔊 audio.js            # 音效管理 - 声音效果
├── 🖼️  ui.js              # UI渲染 - 界面渲染
├── 📋 README.md           # 项目文档
└── 📜 LICENSE             # 开源协议
```

## 🎮 使用说明

### 基本操作
1. **🔴 红方先行** - 玩家控制红方棋子
2. **👆 点击选择** - 点击己方棋子进行选中
3. **✨ 高亮提示** - 选中后显示可移动位置
4. **🎯 移动棋子** - 点击高亮位置完成移动
5. **⚔️ 吃子操作** - 点击对方棋子位置进行吃子

### 功能按钮

| 按钮 | 功能 | 说明 |
|------|------|------|
| 🆕 **新游戏** | 重新开始 | 重置棋盘，开始新的对局 |
| ↩️ **悔棋** | 撤销走法 | 撤销最近两步（玩家+AI各一步） |
| 💡 **提示** | AI建议 | 获取AI推荐的最佳走法 |
| 🔊 **音效** | 声音开关 | 开启/关闭游戏音效 |

### 🎵 音效系统

我们的音效系统使用 Web Audio API 实时生成，包含：

- 🎶 **选中音效** - 轻快的提示音 (440Hz)
- 🎵 **移动音效** - 清脆的落子声 (330Hz)
- 💥 **吃子音效** - 低沉的碰撞声 (220Hz)
- ⚠️ **将军音效** - 紧急警告音 (880Hz)
- 🎉 **胜利音效** - 上升旋律 (C大调)
- 😔 **失败音效** - 下降旋律
- 🤝 **和棋音效** - 平稳音调
- ↩️ **悔棋音效** - 倒退音效
- 🆕 **新游戏** - 清脆开始音

## ⚙️ 自定义配置

### 调整AI难度
在 `ai.js` 文件中修改搜索深度：

```javascript
// 在 ChessAI 类的构造函数中
this.maxDepth = 4; // 调整这个值

// 难度对照表：
// 深度 3: 简单 (0.1-0.5秒)
// 深度 4: 中等 (0.5-2秒) ← 默认
// 深度 5: 困难 (2-8秒)
// 深度 6: 专家 (8-30秒)
```

### 自定义评估权重
在 `ai.js` 的 `evaluatePosition` 方法中调整：

```javascript
// 评估权重配置
const weights = {
    material: 1.0,      // 物质价值权重
    position: 0.3,      // 位置价值权重
    mobility: 0.2,      // 机动性权重
    control: 0.15,      // 控制力权重
    kingThreat: 0.4     // 将军威胁权重
};
```

## 🔧 开发指南

### 添加新功能
1. **修改规则** → 编辑 `chess.js`
2. **改进AI** → 编辑 `ai.js`
3. **美化界面** → 编辑 `style.css`
4. **扩展功能** → 编辑 `main.js`

### 调试AI算法
打开浏览器控制台查看详细信息：
- 🔍 搜索深度和候选走法
- 📊 每个走法的评分
- 🎯 最佳走法选择
- 📈 搜索节点统计
- ✂️ 剪枝效率统计
- ⏱️ 搜索耗时分析

## 🤔 常见问题

<details>
<summary><strong>❓ AI响应太慢怎么办？</strong></summary>

降低搜索深度可以显著提高响应速度：
```javascript
this.maxDepth = 3; // 从4降到3，速度提升4-8倍
```
</details>

<details>
<summary><strong>❓ AI太强/太弱怎么调整？</strong></summary>

通过搜索深度控制难度：
- 深度2-3：适合初学者
- 深度4：适合中等水平（默认）
- 深度5-6：适合高水平玩家
</details>

<details>
<summary><strong>❓ 如何提高AI棋力？</strong></summary>

1. 增加搜索深度（最直接）
2. 优化评估函数权重
3. 改进移动排序策略
4. 添加开局库和残局库
</details>

<details>
<summary><strong>❓ 为什么选择纯前端实现？</strong></summary>

- ✅ 部署简单，无需服务器
- ✅ 响应速度快，无网络延迟
- ✅ 隐私保护，数据不上传
- ✅ 离线可用，随时随地对弈
</details>

## 🎯 性能优化

- **🔄 Alpha-Beta剪枝** - 平均减少60-90%的搜索节点
- **📊 移动排序** - 优先搜索有希望的走法，提高剪枝效率
- **⚡ 异步计算** - AI思考不阻塞UI，保持界面流畅
- **💾 位置缓存** - 预计算常用位置评估，加速计算

## 🏆 技术亮点

1. **🧠 经典算法** - 使用经过数十年验证的博弈算法
2. **⚡ 高效剪枝** - 通过移动排序大幅提升剪枝效率
3. **🎯 智能评估** - 多维度综合评估，棋力强劲
4. **🚀 纯前端** - 无服务器依赖，部署简单
5. **🔧 完整引擎** - 支持所有象棋规则和特殊情况
6. **📊 详细调试** - 丰富的调试信息，便于优化
7. **🎵 实时音效** - Web Audio API动态生成，响应迅速

## 📈 算法性能

| 搜索深度 | 平均节点数 | 思考时间 | 棋力水平 | 适用场景 |
|---------|-----------|---------|---------|---------|
| 3层 | ~1,000 | 0.1-0.5s | 初级 | 快速对弈 |
| 4层 | ~8,000 | 0.5-2s | 中级 | 日常对弈 |
| 5层 | ~50,000 | 2-8s | 高级 | 认真对弈 |
| 6层 | ~300,000 | 8-30s | 专家 | 深度分析 |

## 📧 联系方式

- 问题反馈（建议）
  ：[![GitHub issues](https://img.shields.io/github/issues/shibing624/chinese-chess-ai.svg)](https://github.com/shibing624/chinese-chess-ai/issues)
- 邮箱联系: xuming: xuming624@qq.com
- 微信联系: 添加我的 *微信号: xuming624，备注：姓名-公司-技术交流* 加入技术交流群。

<img src="https://github.com/shibing624/agentica/blob/main/docs/wechat.jpeg" width="200" />


## 📄 开源协议

本项目采用教育用途开源协议，仅供学习和研究使用。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

<div align="center">

**🎮 享受智能象棋对弈的乐趣！**

Made with ❤️ by AI Chess Team

[⬆️ 回到顶部](#-中国象棋ai对弈系统)

</div>