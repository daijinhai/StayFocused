/**
 * Web Vitals 性能监控 Hook
 * 用于跟踪和报告 Core Web Vitals 指标
 */

import { useEffect, useCallback, useRef } from 'react';

export interface WebVitalsMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay (已弃用，使用 INP)
  inp?: number; // Interaction to Next Paint
  cls?: number; // Cumulative Layout Shift

  // 其他重要指标
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  loadTime?: number; // 页面完全加载时间

  // 判断值
  isGood?: boolean;
  rating?: 'good' | 'needs-improvement' | 'poor';
}

/**
 * 获取 Web Vitals 评分
 */
function getWebVitalsRating(metrics: WebVitalsMetrics): 'good' | 'needs-improvement' | 'poor' {
  let score = 0;

  // LCP (最大内容绘制) - 应该 ≤ 2.5s 为 good
  if (metrics.lcp) {
    if (metrics.lcp <= 2500) score += 1;
    else if (metrics.lcp <= 4000) score += 0.5;
  }

  // INP (交互到下一次绘制) - 应该 ≤ 200ms 为 good
  if (metrics.inp) {
    if (metrics.inp <= 200) score += 1;
    else if (metrics.inp <= 500) score += 0.5;
  }

  // CLS (累计布局移动) - 应该 ≤ 0.1 为 good
  if (metrics.cls) {
    if (metrics.cls <= 0.1) score += 1;
    else if (metrics.cls <= 0.25) score += 0.5;
  }

  // FCP (首次内容绘制) - 应该 ≤ 1.8s 为 good
  if (metrics.fcp) {
    if (metrics.fcp <= 1800) score += 0.5;
    else if (metrics.fcp <= 3000) score += 0.25;
  }

  const avgScore = score / 4;
  if (avgScore >= 0.75) return 'good';
  if (avgScore >= 0.5) return 'needs-improvement';
  return 'poor';
}

/**
 * 监听 Web Vitals 的 Hook
 */
export const useWebVitals = (
  callback?: (metrics: WebVitalsMetrics) => void,
  debugMode: boolean = false
) => {
  const metricsRef = useRef<WebVitalsMetrics>({});

  const handleMetric = useCallback(
    (metric: {
      name: string;
      value: number;
      startTime?: number;
      attribution?: unknown;
    }) => {
      const metrics = metricsRef.current;

      switch (metric.name) {
        case 'LCP':
          metrics.lcp = metric.value;
          break;
        case 'FID':
          metrics.fid = metric.value;
          break;
        case 'INP':
          metrics.inp = metric.value;
          break;
        case 'CLS':
          metrics.cls = metric.value;
          break;
        case 'FCP':
          metrics.fcp = metric.value;
          break;
        case 'TTFB':
          metrics.ttfb = metric.value;
          break;
        default:
          break;
      }

      metrics.rating = getWebVitalsRating(metrics);
      metrics.isGood = metrics.rating === 'good';

      if (debugMode) {
        console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms`, metrics);
      }

      if (callback) {
        callback(metrics);
      }
    },
    [callback, debugMode]
  );

  useEffect(() => {
    // 使用 web-vitals 库（如果可用）
    try {
      // 首先尝试使用官方的 web-vitals 库
      if ('web-vitals' in window) {
        // 如果库已加载，使用它的函数
        return;
      }
    } catch {
      // web-vitals 库不可用，使用 Performance Observer API
    }

    // 备选方案：使用原生 Performance Observer API
    const performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry.startTime;
          handleMetric({
            name: 'LCP',
            value: lcp
          });
        } else if (entry.entryType === 'first-input') {
          const firstInput = entry as unknown as { processingStart?: number; startTime?: number };
          handleMetric({
            name: 'FID',
            value: (firstInput.processingStart || 0) - (firstInput.startTime || 0)
          });
        } else if (entry.entryType === 'layout-shift') {
          const layoutEntry = entry as unknown as { hadRecentInput?: boolean; value?: number };
          if (layoutEntry.hadRecentInput) {
            return; // 忽略用户输入后的布局移动
          }
          const clsValue = layoutEntry.value || 0;
          metricsRef.current.cls = (metricsRef.current.cls || 0) + clsValue;
          handleMetric({
            name: 'CLS',
            value: metricsRef.current.cls || 0
          });
        } else if (entry.entryType === 'paint') {
          const paintEntry = entry as unknown as { name: string };
          if (paintEntry.name === 'first-contentful-paint') {
            handleMetric({
              name: 'FCP',
              value: entry.startTime
            });
          }
        }
      }
    });

    try {
      performanceObserver.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint']
      });
    } catch (e) {
      // 某些浏览器可能不支持某些入口类型
      console.warn('PerformanceObserver 配置失败:', e);
    }

    // 页面卸载时测量 TTFB 和总加载时间
    const handleBeforeUnload = () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        metricsRef.current.ttfb = timing.responseStart - timing.navigationStart;
        metricsRef.current.loadTime = timing.loadEventEnd - timing.navigationStart;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 在页面加载完成后测量
    const handleLoad = () => {
      setTimeout(() => {
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          metricsRef.current.ttfb = timing.responseStart - timing.navigationStart;
          metricsRef.current.loadTime = timing.loadEventEnd - timing.navigationStart;

          if (debugMode) {
            console.log('[Web Vitals - Load] TTFB:', metricsRef.current.ttfb, 'Load Time:', metricsRef.current.loadTime);
          }

          if (callback) {
            callback(metricsRef.current);
          }
        }
      }, 0);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      performanceObserver.disconnect();
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleMetric, callback, debugMode]);

  return metricsRef.current;
};

/**
 * 格式化 Web Vitals 报告
 */
export function formatWebVitalsReport(metrics: WebVitalsMetrics): string {
  const rating = metrics.rating || 'unknown';
  const ratingEmoji = metrics.isGood ? '✅' : metrics.rating === 'needs-improvement' ? '⚠️' : '❌';

  return `
    ${ratingEmoji} Web Vitals Report - ${rating.toUpperCase()}
    
    Core Web Vitals:
    • LCP (Largest Contentful Paint): ${metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}
    • INP (Interaction to Next Paint): ${metrics.inp ? `${metrics.inp.toFixed(0)}ms` : 'N/A'}
    • CLS (Cumulative Layout Shift): ${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
    
    Other Metrics:
    • FCP (First Contentful Paint): ${metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}
    • TTFB (Time to First Byte): ${metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'N/A'}
    • Load Time: ${metrics.loadTime ? `${(metrics.loadTime / 1000).toFixed(2)}s` : 'N/A'}
  `;
}

/**
 * 生成 Web Vitals HTML 报告
 */
export function generateWebVitalsHTMLReport(metrics: WebVitalsMetrics): string {
  const rating = metrics.rating || 'unknown';
  const ratingColor =
    metrics.rating === 'good'
      ? '#10b981'
      : metrics.rating === 'needs-improvement'
        ? '#f59e0b'
        : '#ef4444';

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px; margin: 20px 0;">
      <h2 style="color: ${ratingColor}; margin-top: 0;">📊 Web Vitals Report</h2>
      
      <div style="background: white; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="padding: 12px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <div style="font-weight: bold; color: #1f2937;">LCP</div>
            <div style="font-size: 24px; color: ${metrics.lcp && metrics.lcp <= 2500 ? '#10b981' : '#ef4444'}; margin: 8px 0;">
              ${metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}
            </div>
            <div style="font-size: 12px; color: #6b7280;">Largest Contentful Paint</div>
          </div>
          
          <div style="padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <div style="font-weight: bold; color: #1f2937;">INP</div>
            <div style="font-size: 24px; color: ${metrics.inp && metrics.inp <= 200 ? '#10b981' : '#ef4444'}; margin: 8px 0;">
              ${metrics.inp ? `${metrics.inp.toFixed(0)}ms` : 'N/A'}
            </div>
            <div style="font-size: 12px; color: #6b7280;">Interaction to Next Paint</div>
          </div>
          
          <div style="padding: 12px; background: #f3e8ff; border-left: 4px solid #a855f7; border-radius: 4px;">
            <div style="font-weight: bold; color: #1f2937;">CLS</div>
            <div style="font-size: 24px; color: ${metrics.cls && metrics.cls <= 0.1 ? '#10b981' : '#ef4444'}; margin: 8px 0;">
              ${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
            </div>
            <div style="font-size: 12px; color: #6b7280;">Cumulative Layout Shift</div>
          </div>
          
          <div style="padding: 12px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
            <div style="font-weight: bold; color: #1f2937;">FCP</div>
            <div style="font-size: 24px; color: ${metrics.fcp && metrics.fcp <= 1800 ? '#10b981' : '#f59e0b'}; margin: 8px 0;">
              ${metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}
            </div>
            <div style="font-size: 12px; color: #6b7280;">First Contentful Paint</div>
          </div>
        </div>
      </div>
      
      <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid ${ratingColor};">
        <strong style="color: ${ratingColor};">Overall Rating: ${rating.toUpperCase()}</strong>
      </div>
    </div>
  `;
}
