// Google Analytics 和其他分析工具的集成

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics 配置
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

// 初始化 Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found');
    return;
  }

  // 加载 Google Analytics 脚本
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  // 初始化 gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });
  `;
  document.head.appendChild(script2);
};

// 页面浏览追踪
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_title,
      page_location: page_location || window.location.href,
    });
  }
};

// 事件追踪
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 自定义事件追踪
export const trackCustomEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};

// 用户行为追踪
export const Analytics = {
  // 音频播放追踪
  trackSoundPlay: (soundName: string, category: string) => {
    trackEvent('play_sound', 'audio', `${category}_${soundName}`);
    trackCustomEvent('sound_interaction', {
      sound_name: soundName,
      sound_category: category,
      action: 'play'
    });
  },

  // 音频停止追踪
  trackSoundStop: (soundName: string, category: string, duration?: number) => {
    trackEvent('stop_sound', 'audio', `${category}_${soundName}`, duration);
    trackCustomEvent('sound_interaction', {
      sound_name: soundName,
      sound_category: category,
      action: 'stop',
      duration: duration
    });
  },

  // 音量调整追踪
  trackVolumeChange: (soundName: string, volume: number) => {
    trackEvent('volume_change', 'audio', soundName, Math.round(volume * 100));
    trackCustomEvent('volume_adjustment', {
      sound_name: soundName,
      volume_level: Math.round(volume * 100)
    });
  },

  // 计时器使用追踪
  trackTimerStart: (duration: number) => {
    trackEvent('timer_start', 'productivity', 'focus_timer', duration);
    trackCustomEvent('timer_interaction', {
      action: 'start',
      duration_minutes: duration
    });
  },

  trackTimerComplete: (duration: number, actualTime: number) => {
    trackEvent('timer_complete', 'productivity', 'focus_timer', duration);
    trackCustomEvent('timer_interaction', {
      action: 'complete',
      planned_duration: duration,
      actual_duration: actualTime,
      completion_rate: Math.round((actualTime / (duration * 60)) * 100)
    });
  },

  trackTimerStop: (duration: number, remainingTime: number) => {
    trackEvent('timer_stop', 'productivity', 'focus_timer', duration);
    trackCustomEvent('timer_interaction', {
      action: 'stop',
      planned_duration: duration,
      remaining_time: remainingTime,
      completion_rate: Math.round(((duration * 60 - remainingTime) / (duration * 60)) * 100)
    });
  },

  // 主题切换追踪
  trackThemeChange: (fromTheme: string, toTheme: string) => {
    trackEvent('theme_change', 'ui', `${fromTheme}_to_${toTheme}`);
    trackCustomEvent('theme_interaction', {
      from_theme: fromTheme,
      to_theme: toTheme
    });
  },

  // 语言切换追踪
  trackLanguageChange: (fromLang: string, toLang: string) => {
    trackEvent('language_change', 'ui', `${fromLang}_to_${toLang}`);
    trackCustomEvent('language_interaction', {
      from_language: fromLang,
      to_language: toLang
    });
  },

  // 混音保存追踪
  trackMixSave: (mixName: string, soundCount: number) => {
    trackEvent('mix_save', 'audio', mixName, soundCount);
    trackCustomEvent('mix_interaction', {
      action: 'save',
      mix_name: mixName,
      sound_count: soundCount
    });
  },

  // 混音加载追踪
  trackMixLoad: (mixName: string, soundCount: number) => {
    trackEvent('mix_load', 'audio', mixName, soundCount);
    trackCustomEvent('mix_interaction', {
      action: 'load',
      mix_name: mixName,
      sound_count: soundCount
    });
  },

  // 用户参与度追踪
  trackEngagement: (action: string, details?: Record<string, any>) => {
    trackCustomEvent('user_engagement', {
      engagement_action: action,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  // 错误追踪
  trackError: (error: string, context?: string) => {
    trackEvent('error', 'system', error);
    trackCustomEvent('error_occurred', {
      error_message: error,
      error_context: context,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href
    });
  },

  // 性能追踪
  trackPerformance: (metric: string, value: number, unit: string = 'ms') => {
    trackCustomEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit,
      timestamp: new Date().toISOString()
    });
  }
};

// Google Search Console 验证
export const addSearchConsoleVerification = (verificationCode: string) => {
  if (!verificationCode) return;
  
  let verificationMeta = document.querySelector('meta[name="google-site-verification"]');
  if (!verificationMeta) {
    verificationMeta = document.createElement('meta');
    verificationMeta.setAttribute('name', 'google-site-verification');
    document.head.appendChild(verificationMeta);
  }
  verificationMeta.setAttribute('content', verificationCode);
};

// 百度统计集成（可选）
export const initBaiduAnalytics = (baiduId: string) => {
  if (!baiduId) return;

  const script = document.createElement('script');
  script.innerHTML = `
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?${baiduId}";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
  `;
  document.head.appendChild(script);
};

// 初始化所有分析工具
export const initAnalytics = () => {
  // 只在生产环境中初始化
  if (import.meta.env.MODE === 'production') {
    initGA();
    
    // 如果有百度统计ID，也初始化百度统计
    const baiduId = import.meta.env.VITE_BAIDU_ANALYTICS_ID;
    if (baiduId) {
      initBaiduAnalytics(baiduId);
    }

    // 如果有Google Search Console验证码，添加验证
    const gscVerification = import.meta.env.VITE_GSC_VERIFICATION;
    if (gscVerification) {
      addSearchConsoleVerification(gscVerification);
    }
  }
};