/**
 * SEO 配置文件 - 关键词库、元数据、结构化数据
 */

// 关键词库 - 按优先级和类别组织
export const keywordLibrary = {
  zh: {
    primary: ['专注时钟', '白噪音', '专注力', '番茄钟', '工作效率'],
    longTail: [
      '在线专注时钟',
      '免费白噪音应用',
      '提升专注力工具',
      '番茄工作法计时器',
      '办公室白噪音',
      '学习集中力应用',
      '睡眠白噪音',
      '冥想音乐应用',
      '自然声音生成器',
      '焦点管理工具'
    ],
    sounds: ['雨声', '森林鸟鸣', '海浪声', '城市噪音', '雷声', '风声', '流水声', '动物叫声'],
    features: ['自定义混音', '多种主题', '计时器', '多语言支持', '响应式设计', '离线使用'],
    useCase: [
      '工作专注',
      '学习复习',
      '深度思考',
      '冥想放松',
      '改善睡眠',
      '瑜伽练习',
      '编程工作',
      '写作创作',
      '考试备考',
      '午休放松'
    ]
  },
  en: {
    primary: ['focus timer', 'white noise', 'concentration', 'pomodoro', 'productivity'],
    longTail: [
      'online focus timer',
      'free white noise app',
      'productivity tool',
      'pomodoro technique timer',
      'office white noise',
      'study concentration app',
      'sleep white noise',
      'meditation music app',
      'nature sound generator',
      'focus management tool'
    ],
    sounds: ['rain sound', 'forest birds', 'ocean waves', 'city noise', 'thunder', 'wind', 'water stream', 'animal sounds'],
    features: ['custom mix', 'multiple themes', 'timer', 'multi-language', 'responsive design', 'offline mode'],
    useCase: [
      'work focus',
      'study review',
      'deep thinking',
      'meditation relaxation',
      'sleep improvement',
      'yoga practice',
      'programming work',
      'creative writing',
      'exam preparation',
      'midday relaxation'
    ]
  }
};

// 常见问题 Schema 数据
export const faqSchema = {
  zh: [
    {
      question: '如何使用 Stay Focused 提升专注力？',
      answer: '选择您喜欢的白噪音背景声，设置专注时间（25/45/60分钟），然后开始工作。白噪音会屏蔽外界干扰，帮助您进入专注状态。'
    },
    {
      question: 'Stay Focused 支持哪些白噪音？',
      answer: '我们提供40+种白噪音，包括自然声音（雨声、森林鸟鸣、海浪）、城市噪音、动物叫声等。您还可以自定义混合多种声音。'
    },
    {
      question: '是否可以保存我的混音方案？',
      answer: '是的！您可以创建和保存自己的声音混合方案，下次使用时可以直接加载。所有数据都存储在您的本地浏览器中。'
    },
    {
      question: 'Stay Focused 完全免费吗？',
      answer: '是的，Stay Focused 完全免费，无需注册，无广告打扰。所有功能都可以免费使用。'
    },
    {
      question: '可以离线使用吗？',
      answer: '支持！一旦加载完成，您可以离线使用 Stay Focused。所有声音文件都会被缓存。'
    },
    {
      question: '支持哪些语言？',
      answer: '目前支持中文和英文。我们计划在未来添加更多语言版本。'
    }
  ],
  en: [
    {
      question: 'How do I use Stay Focused to improve concentration?',
      answer: 'Select your preferred white noise background sound, set your focus time (25/45/60 minutes), and start working. The white noise will mask outside distractions and help you enter a focused state.'
    },
    {
      question: 'What white noise options are available in Stay Focused?',
      answer: 'We provide 40+ white noise sounds including natural sounds (rain, forest birds, ocean waves), city noise, animal sounds, and more. You can also create custom sound mixes.'
    },
    {
      question: 'Can I save my sound mix settings?',
      answer: 'Yes! You can create and save your custom sound mixes. Your saved mixes will be available next time you visit. All data is stored locally in your browser.'
    },
    {
      question: 'Is Stay Focused completely free?',
      answer: 'Yes, Stay Focused is completely free with no registration required and no ads. All features are available at no cost.'
    },
    {
      question: 'Can I use it offline?',
      answer: 'Yes! Once loaded, you can use Stay Focused offline. All sound files are cached for offline access.'
    },
    {
      question: 'What languages are supported?',
      answer: 'Currently, we support Chinese and English. We plan to add more languages in the future.'
    }
  ]
};

// SEO 元数据配置
export const seoMetadata = {
  zh: {
    siteName: 'Stay Focused',
    siteDescription: 'Stay Focused 是专业的在线专注时钟和白噪音应用',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
    twitterHandle: '@stayfocused',
    authorName: 'Stay Focused Team',
    organizationName: 'Stay Focused',
    organizationLogo: 'https://shutong.work/logo.svg',
    organizationUrl: 'https://shutong.work/'
  },
  en: {
    siteName: 'Stay Focused',
    siteDescription: 'Stay Focused is a professional online focus timer and white noise app',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    twitterHandle: '@stayfocused',
    authorName: 'Stay Focused Team',
    organizationName: 'Stay Focused',
    organizationLogo: 'https://shutong.work/logo.svg',
    organizationUrl: 'https://shutong.work/'
  }
};

// 页面路由的 SEO 配置
export const pageMetadata = {
  home: {
    zh: {
      title: 'Stay Focused - 专注时钟 & 白噪音 | 免费提升专注力工具',
      description: 'Stay Focused是一款免费的在线专注时钟和白噪音应用，提供40+自然声音和城市噪音，支持自定义混音、番茄工作法计时器、多种主题。帮助您提升工作效率、改善睡眠、深度冥想。无需注册，完全免费！',
      keywords: '专注时钟,白噪音,专注力,番茄钟,工作效率,自然声音,雨声,森林,海浪,专注音乐,在线工具,免费应用,浏览器应用,离线使用',
      ogImage: 'https://shutong.work/og-image-zh.png',
      canonical: 'https://shutong.work/'
    },
    en: {
      title: 'Stay Focused - Focus Timer & White Noise | Free Productivity Booster',
      description: 'Stay Focused is a free online focus timer and white noise app with 40+ natural sounds. Features Pomodoro timer, custom sound mixing, multiple themes, and offline mode. Perfect for work, study, meditation, and better sleep. No signup required!',
      keywords: 'focus timer,white noise,concentration,pomodoro,productivity,natural sounds,rain,forest,ocean waves,focus music,online tool,free app,browser app,offline mode',
      ogImage: 'https://shutong.work/og-image-en.png',
      canonical: 'https://shutong.work/'
    }
  }
};

// 应用功能特性的结构化数据
export const applicationFeatures = {
  zh: [
    '40+ 种白噪音和自然声音',
    '自定义声音混音器',
    '灵活的专注计时器（25/45/60分钟）',
    '保存和加载混音方案',
    '5+ 种应用主题',
    '多语言支持（中文/英文）',
    '响应式设计，完美适配移动设备',
    '完全免费，无广告',
    '隐私优先，本地数据存储',
    '离线模式支持',
    '键盘快捷键支持',
    '音量控制和音质优化'
  ],
  en: [
    '40+ white noise and nature sounds',
    'Custom sound mixer',
    'Flexible focus timer (25/45/60 minutes)',
    'Save and load sound mixes',
    '5+ application themes',
    'Multi-language support (Chinese/English)',
    'Responsive design for mobile and desktop',
    'Completely free with no ads',
    'Privacy-first with local data storage',
    'Offline mode support',
    'Keyboard shortcuts',
    'Volume control and audio optimization'
  ]
};

// 结构化数据中的聚合评分
export const ratingData = {
  ratingValue: '4.8',
  ratingCount: '250',
  bestRating: '5',
  worstRating: '1'
};

// 社交媒体分享文案
export const socialShareText = {
  zh: {
    twitter: '🎵 Stay Focused - 用白噪音和专注时钟提升工作效率！40+种自然声音，免费无广告。立即尝试 → https://shutong.work',
    facebook: '💼 Stay Focused：专业的在线专注工具。包含专注计时器、白噪音应用、多种主题。无需注册，完全免费！',
    linkedin: '🚀 推荐一个提升专注力的工具：Stay Focused。在线专注时钟 + 白噪音应用，帮助你进入深度工作状态。'
  },
  en: {
    twitter: '🎵 Stay Focused - Boost your productivity with white noise & focus timer! 40+ nature sounds, free & ad-free. Try now → https://shutong.work',
    facebook: '💼 Stay Focused: Your professional focus tool online. Focus timer, white noise, multiple themes. Free, no signup required!',
    linkedin: '🚀 Check out Stay Focused - an online focus timer & white noise app that helps you enter deep work mode.'
  }
};
