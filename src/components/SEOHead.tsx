import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
  ogImage,
  structuredData
}) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // 更新页面标题
    if (title) {
      document.title = title;
    }

    // 更新描述
    if (description) {
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement('meta');
        descriptionMeta.setAttribute('name', 'description');
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.setAttribute('content', description);
    }

    // 更新关键词
    if (keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', keywords);
    }

    // 更新canonical链接
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // 设置robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // 更新Open Graph图片
    if (ogImage) {
      let ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (!ogImageMeta) {
        ogImageMeta = document.createElement('meta');
        ogImageMeta.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageMeta);
      }
      ogImageMeta.setAttribute('content', ogImage);

      // 同时更新Twitter Card图片
      let twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImageMeta) {
        twitterImageMeta = document.createElement('meta');
        twitterImageMeta.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImageMeta);
      }
      twitterImageMeta.setAttribute('content', ogImage);
    }

    // 添加结构化数据
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"][data-seo-head]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        structuredDataScript.setAttribute('data-seo-head', 'true');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
    }

    // 清理函数
    return () => {
      // 在组件卸载时可以选择性地清理某些meta标签
      if (noindex) {
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (robotsMeta) {
          robotsMeta.setAttribute('content', 'index, follow');
        }
      }
    };
  }, [title, description, keywords, canonical, noindex, ogImage, structuredData, i18n.language]);

  return null; // 这个组件不渲染任何内容
};

// 预定义的SEO配置
export const SEOConfigs = {
  home: {
    zh: {
      title: 'Stay Focused - 专注时钟 & 白噪音 | 提升专注力的在线工具',
      description: 'Stay Focused是一款免费的在线专注时钟和白噪音应用，提供多种自然声音如雨声、森林鸟鸣、海浪等，帮助您提升专注力、提高工作效率、改善睡眠质量。支持自定义混音、专注计时器和多种主题。',
      keywords: '专注时钟,白噪音,专注力,工作效率,番茄钟,自然声音,雨声,森林,海浪,专注音乐,在线工具,免费应用'
    },
    en: {
      title: 'Stay Focused - Focus Timer & White Noise | Boost Your Productivity',
      description: 'Stay Focused is a free online focus timer and white noise app with various natural sounds like rain, forest birds, ocean waves to help you boost concentration, improve productivity and enhance sleep quality. Features custom sound mixing, focus timer and multiple themes.',
      keywords: 'focus timer,white noise,concentration,productivity,pomodoro,natural sounds,rain,forest,ocean waves,focus music,online tool,free app'
    }
  },
  timer: {
    zh: {
      title: '专注计时器 - Stay Focused | 番茄工作法计时器',
      description: '使用Stay Focused的专注计时器，采用番茄工作法提升工作效率。配合白噪音和自然声音，创造完美的专注环境。',
      keywords: '专注计时器,番茄工作法,番茄钟,工作效率,时间管理,专注训练'
    },
    en: {
      title: 'Focus Timer - Stay Focused | Pomodoro Technique Timer',
      description: 'Use Stay Focused focus timer with Pomodoro Technique to boost productivity. Combined with white noise and natural sounds for perfect focus environment.',
      keywords: 'focus timer,pomodoro technique,pomodoro timer,productivity,time management,focus training'
    }
  }
};