/**
 * SEO 审核和性能监控工具
 * 用于自动检查页面 SEO 指标和 Core Web Vitals
 */

interface SEOAuditResult {
  timestamp: number;
  score: number;
  issues: SEOIssue[];
  metrics: PerformanceMetrics;
  warnings: string[];
  recommendations: string[];
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  severity: number; // 1-5，5最严重
}

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  ttfb?: number; // Time to First Byte
  loadTime?: number; // 总加载时间
}

/**
 * SEO 审核类
 */
export class SEOAuditor {
  private issues: SEOIssue[] = [];
  private warnings: string[] = [];
  private recommendations: string[] = [];
  private metrics: PerformanceMetrics = {};

  /**
   * 执行完整的 SEO 审核
   */
  public audit(): SEOAuditResult {
    this.issues = [];
    this.warnings = [];
    this.recommendations = [];
    this.metrics = {};

    // 执行各项检查
    this.checkMetaTags();
    this.checkStructuredData();
    this.checkImages();
    this.checkHeadings();
    this.checkLinks();
    this.checkAccessibility();
    this.checkPerformance();

    // 计算总分 (100分制)
    const score = this.calculateScore();

    return {
      timestamp: Date.now(),
      score,
      issues: this.issues,
      metrics: this.metrics,
      warnings: this.warnings,
      recommendations: this.recommendations
    };
  }

  /**
   * 检查 Meta 标签
   */
  private checkMetaTags(): void {
    // 检查 title
    const title = document.title;
    if (!title || title.length === 0) {
      this.issues.push({
        type: 'error',
        title: '缺少页面标题',
        description: '每个页面都需要一个唯一的、有描述意义的 <title> 标签',
        severity: 5
      });
    } else if (title.length < 30) {
      this.warnings.push('页面标题过短（建议 30-60 字符）');
    } else if (title.length > 60) {
      this.warnings.push('页面标题过长（建议 30-60 字符）');
    }

    // 检查 description
    const description = document.querySelector('meta[name="description"]');
    if (!description || !description.getAttribute('content')) {
      this.issues.push({
        type: 'error',
        title: '缺少 Meta Description',
        description: '页面需要一个清晰的 meta description（120-160 字符）',
        severity: 5
      });
    } else {
      const descLength = description.getAttribute('content')?.length || 0;
      if (descLength < 120) {
        this.warnings.push(`Meta Description 过短（${descLength}字符，建议 120-160）`);
      } else if (descLength > 160) {
        this.warnings.push(`Meta Description 过长（${descLength}字符，建议 120-160）`);
      }
    }

    // 检查 keywords
    const keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords || !keywords.getAttribute('content')) {
      this.warnings.push('缺少 Meta Keywords（在某些搜索引擎中仍有作用）');
    }

    // 检查 viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      this.issues.push({
        type: 'error',
        title: '缺少 Viewport Meta 标签',
        description: '必须有 viewport meta 标签以支持移动设备响应式设计',
        severity: 5
      });
    }

    // 检查 canonical 链接
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      this.warnings.push('建议添加 Canonical 链接以避免重复内容问题');
    }

    // 检查 Open Graph 标签
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (!ogTitle || !ogDescription) {
      this.warnings.push('建议补充完整的 Open Graph 标签以改进社交媒体分享');
    }
    if (!ogImage) {
      this.warnings.push('建议添加 og:image 以支持社交媒体分享预览');
    }

    // 检查 Twitter Card
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      this.warnings.push('建议添加 Twitter Card 标签以优化 Twitter 分享');
    }

    // 检查语言属性
    const htmlLang = document.documentElement.getAttribute('lang');
    if (!htmlLang) {
      this.issues.push({
        type: 'warning',
        title: '缺少 html lang 属性',
        description: '<html> 标签应该包含 lang 属性（如 lang="zh-CN"）',
        severity: 3
      });
    }
  }

  /**
   * 检查结构化数据
   */
  private checkStructuredData(): void {
    const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');

    if (ldJsonScripts.length === 0) {
      this.warnings.push('建议添加 JSON-LD 结构化数据以帮助搜索引擎理解内容');
      return;
    }

    let hasWebApplicationSchema = false;
    let hasFAQSchema = false;

    ldJsonScripts.forEach((script) => {
      try {
        const data = JSON.parse(script.textContent || '{}');
        const type = data['@type'];

        if (type === 'WebApplication' || type === 'SoftwareApplication') {
          hasWebApplicationSchema = true;
        }
        if (type === 'FAQPage') {
          hasFAQSchema = true;
        }
      } catch {
        this.issues.push({
          type: 'error',
          title: '结构化数据格式错误',
          description: '某个 JSON-LD 脚本包含无效的 JSON',
          severity: 3
        });
      }
    });

    if (!hasWebApplicationSchema) {
      this.warnings.push('建议添加 WebApplication Schema 来描述应用信息');
    }
    if (!hasFAQSchema) {
      this.recommendations.push('如果页面有常见问题，添加 FAQPage Schema 能改进搜索结果');
    }
  }

  /**
   * 检查图片优化
   */
  private checkImages(): void {
    const images = document.querySelectorAll('img');

    if (images.length === 0) {
      return;
    }

    let missingAltCount = 0;

    images.forEach((img) => {
      const alt = img.getAttribute('alt');

      if (!alt || alt.trim().length === 0) {
        missingAltCount++;
      }
    });

    if (missingAltCount > 0) {
      this.issues.push({
        type: 'warning',
        title: `${missingAltCount} 个图片缺少 alt 文本`,
        description: '所有图片都应该有描述性的 alt 文本来改进无障碍性和 SEO',
        severity: 3
      });
    }
  }

  /**
   * 检查标题结构
   */
  private checkHeadings(): void {
    const h1s = document.querySelectorAll('h1');

    if (h1s.length === 0) {
      this.warnings.push('页面应该至少包含一个 H1 标题');
    } else if (h1s.length > 1) {
      this.warnings.push(`页面有 ${h1s.length} 个 H1，建议只有 1 个`);
    }

    // 检查标题层级是否连贯
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      let prevLevel = 0;
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName[1]);
        if (prevLevel > 0 && level > prevLevel + 1) {
          this.warnings.push(`标题层级不连贯：从 H${prevLevel} 跳到 H${level}`);
        }
        prevLevel = level;
      });
    }
  }

  /**
   * 检查链接
   */
  private checkLinks(): void {
    const links = document.querySelectorAll('a');
    let missingLinkTextCount = 0;

    links.forEach((link) => {
      const href = link.getAttribute('href');
      const title = link.getAttribute('title');
      const ariaLabel = link.getAttribute('aria-label');

      // 检查链接文本或标题
      if (
        (!link.textContent || link.textContent.trim().length === 0) &&
        !title &&
        !ariaLabel
      ) {
        missingLinkTextCount++;
      }

      // 检查坏链接（简单检查）
      if (href && href.startsWith('http') && !href.includes('shutong.work')) {
        // 外部链接应该有 rel="noopener noreferrer"
        const rel = link.getAttribute('rel');
        if (!rel || (!rel.includes('noopener') && !rel.includes('noreferrer'))) {
          this.warnings.push('外部链接缺少 rel="noopener noreferrer" 属性');
        }
      }
    });

    if (missingLinkTextCount > 0) {
      this.warnings.push(`${missingLinkTextCount} 个链接缺少文本或标题描述`);
    }
  }

  /**
   * 检查无障碍性
   */
  private checkAccessibility(): void {
    // 检查 ARIA labels
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea'
    );

    let missingLabels = 0;
    interactiveElements.forEach((el) => {
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledBy = el.getAttribute('aria-labelledby');
      const label = el.closest('label');

      if (!ariaLabel && !ariaLabelledBy && !label) {
        missingLabels++;
      }
    });

    if (missingLabels > 0) {
      this.recommendations.push(`${missingLabels} 个交互元素缺少标签，可以改进无障碍性`);
    }

    // 检查颜色对比度（简单检查）
    const textElements = document.querySelectorAll('p, span, a, h1, h2, h3, h4, h5, h6');
    // 这是一个简化的检查，完整的颜色对比度检查需要更复杂的算法
    if (textElements.length > 0) {
      this.recommendations.push('建议使用 WCAG 颜色对比度检查工具验证文本可读性');
    }
  }

  /**
   * 检查性能指标
   */
  private checkPerformance(): void {
    // 尝试获取 Web Vitals
    try {
      // FCP - First Contentful Paint
      if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          }
        });
        perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      }

      // 总加载时间
      if (window.performance && window.performance.timing) {
      const pageStartTimeValue = ((window as unknown) as Record<string, unknown>).pageStartTime as number || 0;
        const navigationStart = window.performance.timing.navigationStart;
        const loadEventEnd = window.performance.timing.loadEventEnd;
        if (loadEventEnd > 0) {
          this.metrics.loadTime = loadEventEnd - navigationStart;
        } else {
          // 页面仍在加载
          this.metrics.loadTime = performance.now() - (pageStartTimeValue || performance.timing.navigationStart);
        }
      }
    } catch {
      // 浏览器不支持 Performance API
    }

    // 性能建议
    if (this.metrics.loadTime && this.metrics.loadTime > 3000) {
      this.recommendations.push(
        `页面加载时间较长（${(this.metrics.loadTime / 1000).toFixed(2)}s），考虑优化资源加载`
      );
    }

    // 检查未压缩的资源
    this.checkResourceCompression();
  }

  /**
   * 检查资源压缩
   */
  private checkResourceCompression(): void {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    let largeResourceCount = 0;

    resources.forEach((resource) => {
      // 检查是否有压缩标志（通过 Content-Encoding）
      // 注意：由于跟域限制，我们无法直接获取 response headers，这只是一个建议

      // 检查大资源
      if (resource.transferSize && resource.transferSize > 1024 * 500) {
        largeResourceCount++;
      }
    });

    if (largeResourceCount > 0) {
      this.recommendations.push(`${largeResourceCount} 个资源文件较大（>500KB），考虑优化或分割`);
    }
  }

  /**
   * 计算 SEO 评分
   */
  private calculateScore(): number {
    let score = 100;

    // 减分规则
    this.issues.forEach((issue) => {
      score -= issue.severity * 5; // 每个错误减去 5-25 分
    });

    this.warnings.forEach(() => {
      score -= 3; // 每个警告减去 3 分
    });

    return Math.max(0, score); // 最低分为 0
  }

  /**
   * 生成审核报告（HTML 格式）
   */
  public generateReport(result: SEOAuditResult): string {
    const issuesHtml = result.issues
      .map(
        (issue) =>
          `<div style="margin-bottom: 12px; padding: 12px; border-left: 4px solid ${
            issue.type === 'error' ? '#ef4444' : '#f97316'
          }; background-color: ${
            issue.type === 'error' ? '#fee2e2' : '#fef3c7'
          };">
        <strong>${issue.title}</strong>
        <p style="margin: 8px 0 0 0; font-size: 14px;">${issue.description}</p>
      </div>`
      )
      .join('');

    const warningsHtml =
      result.warnings.length > 0
        ? `<div style="padding: 12px; background-color: #fef3c7; border-radius: 4px; margin-bottom: 16px;">
        <strong>⚠️ 警告：</strong>
        <ul style="margin: 8px 0 0 0;">${result.warnings.map((w) => `<li>${w}</li>`).join('')}</ul>
      </div>`
        : '';

    const recommendationsHtml =
      result.recommendations.length > 0
        ? `<div style="padding: 12px; background-color: #dbeafe; border-radius: 4px;">
        <strong>💡 建议：</strong>
        <ul style="margin: 8px 0 0 0;">${result.recommendations
          .map((r) => `<li>${r}</li>`)
          .join('')}</ul>
      </div>`
        : '';

    const metricsHtml = `<div style="padding: 12px; background-color: #f0fdf4; border-radius: 4px; margin: 16px 0;">
      <strong>📊 性能指标：</strong>
      <ul style="margin: 8px 0 0 0;">
        ${result.metrics.fcp ? `<li>FCP: ${result.metrics.fcp.toFixed(2)}ms</li>` : ''}
        ${result.metrics.lcp ? `<li>LCP: ${result.metrics.lcp.toFixed(2)}ms</li>` : ''}
        ${result.metrics.cls ? `<li>CLS: ${result.metrics.cls.toFixed(3)}</li>` : ''}
        ${
          result.metrics.loadTime
            ? `<li>加载时间: ${(result.metrics.loadTime / 1000).toFixed(2)}s</li>`
            : ''
        }
      </ul>
    </div>`;

    return `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
          SEO 审核报告
          <span style="float: right; font-size: 32px; color: ${result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444'};">
            ${result.score}
          </span>
        </h1>
        
        <div style="margin: 16px 0;">
          <p style="color: #6b7280;">生成时间：${new Date(result.timestamp).toLocaleString()}</p>
        </div>

        ${
          result.issues.length > 0
            ? `<div style="margin: 16px 0;">
            <h2 style="color: #ef4444;">❌ 关键问题 (${result.issues.length})</h2>
            ${issuesHtml}
          </div>`
            : ''
        }

        ${warningsHtml}
        ${recommendationsHtml}
        ${metricsHtml}
      </div>
    `;
  }
}

/**
 * 导出单例
 */
export const seoAuditor = new SEOAuditor();

/**
 * 自动执行审核（在页面加载完成后）
 */
export function initSEOAudit(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // 延迟执行以确保所有资源都加载
      setTimeout(() => {
        const result = seoAuditor.audit();
        logAuditResult(result);
      }, 1000);
    });
  } else {
    setTimeout(() => {
      const result = seoAuditor.audit();
      logAuditResult(result);
    }, 1000);
  }
}

/**
 * 记录审核结果到控制台
 */
function logAuditResult(result: SEOAuditResult): void {
  const style = `
    color: white;
    background: ${result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444'};
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
  `;

  console.group('%c🔍 SEO Audit Report', style);
  console.log('Score:', result.score, '/ 100');
  console.log('Issues:', result.issues.length);
  console.log('Warnings:', result.warnings.length);
  console.log('Recommendations:', result.recommendations.length);
  console.log('Full Result:', result);
  console.groupEnd();
}
