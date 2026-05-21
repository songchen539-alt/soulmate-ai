# SoulMate AI — 后续迭代路线

---

## 指标追踪（MVP上线后关注）

| 指标 | 说明 | 目标工具 |
|------|------|---------|
| **completion rate** | 完成5轮对话的用户比例 | Posthog / Mixpanel |
| **share rate** | 分享Soul Report的用户比例 | Posthog |
| **drop-off** | 每一步的流失率 | Vercel Analytics |
| **emotional engagement** | 对话长度 / 平均回复字数 | 自定义埋点 |

## 分析工具接入

### Posthog（推荐，开源免费额度高）
```
npm install posthog-js
```
- 用户行为追踪
- 漏斗分析（chat → analyze → share）
- 热力图
- 自部署可选

### Vercel Analytics（最简单）
```
npm install @vercel/analytics
```
- 无需配置
- 基础PV/UV
- 开箱即用

### Mixpanel（进阶）
- 高级用户分群
- 留存分析
- 事件自定義

---

## 下一阶段功能

- [ ] Posthog 事件追踪
- [ ] 漏斗分析看板
- [ ] A/B测试（对话轮数）
- [ ] 分享转化优化
- [ ] TikTok内容裂变系统
- [ ] Relationship Copilot
- [ ] 匹配算法v1
