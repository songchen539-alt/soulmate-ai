// 🧠 SoulMate AI - 类型定义

// AI人格测试答案
export interface TestAnswer {
  questionId: number
  answer: string | number
  timestamp: string
}

// 完整的测试提交
export interface TestSubmission {
  id?: string
  answers: TestAnswer[]
  created_at?: string
  name?: string
  email?: string
}

// Soul Report - AI生成的人格报告
export interface SoulReport {
  id: string
  created_at: string
  
  // 用户信息
  name?: string
  email?: string
  
  // AI人格分析
  personalityType: string      // e.g. "理性探索者"
  personalityCode: string      // e.g. "INTJ-R" 
  
  // 五维人格数据 (0-100)
  dimensions: {
    rationality: number        // 理性度
    emotionalDepth: number     // 情感深度
    socialEnergy: number       // 社交能量
    adventureSpirit: number    // 冒险精神
    sensitivity: number        // 敏感度
  }
  
  // 深度描述
  summary: string              // 一句话总结
  strengths: string[]          // 优势
  weaknesses: string[]         // 需要注意的
  loveStyle: string            // 恋爱风格
  idealPartner: string         // 理想伴侣特质
  
  // 关系兼容性提示
  compatibilityTips: string[]
  
  // 分享相关
  shareCode: string
  shareCount: number
}

// DeepSeek API 响应
export interface DeepSeekResponse {
  id: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
  }[]
}

// 测试问题
export interface Question {
  id: number
  text: string
  category: '理性' | '情感' | '社交' | '冒险' | '敏感'
  options: {
    text: string
    value: number
    label: string
  }[]
}
