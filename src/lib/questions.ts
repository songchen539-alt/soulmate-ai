// 📋 AI人格测试题库
import { Question } from './types'

export const questions: Question[] = [
  {
    id: 1,
    text: '朋友失恋找你倾诉，你会？',
    category: '情感',
    options: [
      { text: '分析分手原因，给出理性建议', value: 1, label: 'A' },
      { text: '安静陪着他/她，听TA说完', value: 3, label: 'B' },
      { text: '约TA出去玩，转移注意力', value: 5, label: 'C' },
      { text: '分享自己类似的经历', value: 4, label: 'D' },
      { text: '帮TA分析对错，指出问题', value: 2, label: 'E' }
    ]
  },
  {
    id: 2,
    text: '周末你最想做的事是？',
    category: '社交',
    options: [
      { text: '在家看书/看电影，享受独处', value: 2, label: 'A' },
      { text: '约朋友聚会、桌游', value: 5, label: 'B' },
      { text: '去探索一家新店、新地方', value: 4, label: 'C' },
      { text: '整理房间，规划下周', value: 1, label: 'D' },
      { text: '和特别的人一起，干啥都行', value: 3, label: 'E' }
    ]
  },
  {
    id: 3,
    text: '面对一个重大决定，你通常？',
    category: '理性',
    options: [
      { text: '列清单分析利弊，数据说话', value: 5, label: 'A' },
      { text: '听从内心的感觉', value: 1, label: 'B' },
      { text: '咨询信任的朋友意见', value: 3, label: 'C' },
      { text: '先试再说，边做边调整', value: 4, label: 'D' },
      { text: '拖延到最后一刻再决定', value: 2, label: 'E' }
    ]
  },
  {
    id: 4,
    text: '你对旅行的态度是？',
    category: '冒险',
    options: [
      { text: '详细规划好每一天的行程', value: 2, label: 'A' },
      { text: '随心所欲，走到哪玩到哪', value: 5, label: 'B' },
      { text: '预订好机票住宿，其他随意', value: 3, label: 'C' },
      { text: '喜欢熟悉的城市，不爱折腾', value: 1, label: 'D' },
      { text: '想去各种小众、刺激的地方', value: 4, label: 'E' }
    ]
  },
  {
    id: 5,
    text: '别人对你的评价最接近？',
    category: '敏感',
    options: [
      { text: '理性冷静，逻辑清晰', value: 3, label: 'A' },
      { text: '温柔体贴，善解人意', value: 4, label: 'B' },
      { text: '活泼开朗，气氛担当', value: 5, label: 'C' },
      { text: '独立自主，有主见', value: 2, label: 'D' },
      { text: '细腻敏感，观察入微', value: 1, label: 'E' }
    ]
  },
  {
    id: 6,
    text: '恋爱中你最看重什么？',
    category: '情感',
    options: [
      { text: '精神共鸣，三观一致', value: 3, label: 'A' },
      { text: '被理解、被在乎的感觉', value: 4, label: 'B' },
      { text: '一起开心、一起成长', value: 5, label: 'C' },
      { text: '彼此的独立空间', value: 1, label: 'D' },
      { text: '稳定和安全感', value: 2, label: 'E' }
    ]
  },
  {
    id: 7,
    text: '遇到压力时你通常会？',
    category: '敏感',
    options: [
      { text: '自己消化，不想让别人担心', value: 2, label: 'A' },
      { text: '找朋友倾诉', value: 4, label: 'B' },
      { text: '用运动/爱好释放', value: 5, label: 'C' },
      { text: '分析问题根源，逐个解决', value: 1, label: 'D' },
      { text: '吃好吃的/购物犒劳自己', value: 3, label: 'E' }
    ]
  },
  {
    id: 8,
    text: '你在群体中通常扮演什么角色？',
    category: '社交',
    options: [
      { text: '组织者，安排一切', value: 4, label: 'A' },
      { text: '倾听者，默默支持', value: 2, label: 'B' },
      { text: '开心果，活跃气氛', value: 5, label: 'C' },
      { text: '观察者，先看再参与', value: 1, label: 'D' },
      { text: '协调者，调和矛盾', value: 3, label: 'E' }
    ]
  },
  {
    id: 9,
    text: '你相信一见钟情吗？',
    category: '冒险',
    options: [
      { text: '相信，感觉对了就是对了', value: 5, label: 'A' },
      { text: '不太信，感情需要慢慢培养', value: 1, label: 'B' },
      { text: '相信有好感，但不确定是爱', value: 3, label: 'C' },
      { text: '更相信日久生情', value: 2, label: 'D' },
      { text: '看缘分，不排斥任何可能', value: 4, label: 'E' }
    ]
  },
  {
    id: 10,
    text: '你对未来的规划是？',
    category: '理性',
    options: [
      { text: '有清晰的5年计划', value: 5, label: 'A' },
      { text: '大致方向有，细节边走边看', value: 3, label: 'B' },
      { text: '随遇而安，享受当下', value: 1, label: 'C' },
      { text: '有目标但经常调整', value: 4, label: 'D' },
      { text: '正在探索中，不急', value: 2, label: 'E' }
    ]
  }
]
