import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/useThemeStore';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  themeColor?: string;
}

export const useSEO = (config?: SEOConfig) => {
  const { i18n, t } = useTranslation();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  useEffect(() => {
    // 更新页面标题
    const title = config?.title || (
      i18n.language === 'zh' 
        ? 'Stay Focused - 专注时钟 & 白噪音 | 提升专注力的在线工具'
        : 'Stay Focused - Focus Timer & White Noise | Boost Your Productivity'
    );
    document.title = title;

    // 更新描述
    const description = config?.description || (
      i18n.language === 'zh'
        ? 'Stay Focused是一款免费的在线专注时钟和白噪音应用，提供多种自然声音如雨声、森林鸟鸣、海浪等，帮助您提升专注力、提高工作效率、改善睡眠质量。支持自定义混音、专注计时器和多种主题。'
        : 'Stay Focused is a free online focus timer and white noise app with various natural sounds like rain, forest birds, ocean waves to help you boost concentration, improve productivity and enhance sleep quality. Features custom sound mixing, focus timer and multiple themes.'
    );
    
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }

    // 更新语言属性
    document.documentElement.lang = i18n.language === 'zh' ? 'zh-CN' : 'en';

    // 更新Open Graph标签
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    
    if (ogTitle) {
      ogTitle.setAttribute('content', i18n.language === 'zh' ? 'Stay Focused - 专注时钟 & 白噪音' : 'Stay Focused - Focus Timer & White Noise');
    }
    if (ogDescription) {
      ogDescription.setAttribute('content', i18n.language === 'zh' ? '免费的在线专注时钟和白噪音应用，提供多种自然声音，帮助您提升专注力和工作效率。' : 'Free online focus timer and white noise app with various natural sounds to help boost concentration and productivity.');
    }
    if (ogLocale) {
      ogLocale.setAttribute('content', i18n.language === 'zh' ? 'zh_CN' : 'en_US');
    }

    // 更新Twitter Card标签
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle) {
      twitterTitle.setAttribute('content', i18n.language === 'zh' ? 'Stay Focused - 专注时钟 & 白噪音' : 'Stay Focused - Focus Timer & White Noise');
    }
    if (twitterDescription) {
      twitterDescription.setAttribute('content', i18n.language === 'zh' ? '免费的在线专注时钟和白噪音应用，提供多种自然声音，帮助您提升专注力和工作效率。' : 'Free online focus timer and white noise app with various natural sounds to help boost concentration and productivity.');
    }

    // 根据主题更新主题颜色
    const getThemeColor = () => {
      switch (theme.id) {
        case 'minimal-light':
          return '#10b981'; // 绿色
        case 'ocean':
          return '#2563eb'; // 蓝色
        case 'warm':
          return '#f97316'; // 橙色
        case 'sunset':
          return '#dc2626'; // 红色
        case 'mint':
          return '#10b981'; // 薄荷绿
        default:
          return '#10b981';
      }
    };

    const themeColor = config?.themeColor || getThemeColor();
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const msApplicationTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
    
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeColor);
    }
    if (msApplicationTileColor) {
      msApplicationTileColor.setAttribute('content', themeColor);
    }

    // 更新结构化数据
    const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (structuredDataScript) {
      try {
        const structuredData = JSON.parse(structuredDataScript.textContent || '{}');
        structuredData.name = i18n.language === 'zh' ? 'Stay Focused' : 'Stay Focused';
        structuredData.alternateName = i18n.language === 'zh' ? '专注时钟 & 白噪音' : 'Focus Timer & White Noise';
        structuredData.description = i18n.language === 'zh' 
          ? '免费的在线专注时钟和白噪音应用，提供多种自然声音，帮助您提升专注力和工作效率'
          : 'Free online focus timer and white noise app with various natural sounds to help boost concentration and productivity';
        structuredData.inLanguage = i18n.language === 'zh' ? ['zh-CN', 'en-US'] : ['en-US', 'zh-CN'];
        
        structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
      } catch (error) {
        console.warn('Failed to update structured data:', error);
      }
    }

  }, [i18n.language, theme.id, config, t]);

  // 返回当前SEO信息
  return {
    currentLanguage: i18n.language,
    currentTheme: theme.id,
    updateSEO: (newConfig: SEOConfig) => {
      // 可以用于手动更新SEO信息
      if (newConfig.title) document.title = newConfig.title;
      if (newConfig.description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', newConfig.description);
      }
    }
  };
};