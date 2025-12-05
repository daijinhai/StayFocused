#!/usr/bin/env node

/**
 * SEO 检查脚本
 * 用于在构建时验证 SEO 配置的正确性
 * 
 * 使用: node scripts/seo-check.cjs
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`)
};

let errorCount = 0;
let warningCount = 0;
let checkCount = 0;

function checkFile(filePath, description) {
  checkCount++;
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`);
    return true;
  } else {
    log.error(`缺少 ${description}: ${filePath}`);
    errorCount++;
    return false;
  }
}

function checkFileContent(filePath, pattern, description) {
  checkCount++;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (pattern.test ? pattern.test(content) : content.includes(pattern)) {
      log.success(description);
      return true;
    } else {
      log.warning(description);
      warningCount++;
      return false;
    }
  } catch (e) {
    log.error(`无法读取文件 ${filePath}: ${e.message}`);
    errorCount++;
    return false;
  }
}

console.log(`\n${colors.bold}${colors.blue}🔍 Stay Focused SEO 检查报告${colors.reset}\n`);

// 1. 检查必要的文件
log.header('1. 检查必要文件');
checkFile(path.join(__dirname, '../index.html'), 'HTML 入口文件');
checkFile(path.join(__dirname, '../public/sitemap.xml'), 'Sitemap 文件');
checkFile(path.join(__dirname, '../public/robots.txt'), 'Robots 文件');
checkFile(path.join(__dirname, '../src/components/SEOHead.tsx'), 'SEO Head 组件');
checkFile(path.join(__dirname, '../src/hooks/useSEO.ts'), 'useSEO Hook');
checkFile(path.join(__dirname, '../src/utils/seoAudit.ts'), 'SEO 审核工具');
checkFile(path.join(__dirname, '../src/hooks/useWebVitals.ts'), 'Web Vitals Hook');
checkFile(path.join(__dirname, '../src/data/seoConfig.ts'), 'SEO 配置文件');

// 2. 检查 index.html 中的 Meta 标签
log.header('2. 检查 HTML Meta 标签');
const htmlPath = path.join(__dirname, '../index.html');
checkFileContent(htmlPath, 'meta name="description"', 'Meta description 标签');
checkFileContent(htmlPath, 'meta name="keywords"', 'Meta keywords 标签');
checkFileContent(htmlPath, 'meta property="og:title"', 'OG title 标签');
checkFileContent(htmlPath, 'meta property="og:description"', 'OG description 标签');
checkFileContent(htmlPath, 'meta property="og:image"', 'OG image 标签');
checkFileContent(htmlPath, 'meta name="twitter:card"', 'Twitter Card 标签');
checkFileContent(htmlPath, 'link rel="canonical"', 'Canonical 链接');
checkFileContent(htmlPath, 'link rel="alternate" hreflang', 'Hreflang 备用链接');

// 3. 检查结构化数据
log.header('3. 检查结构化数据');
checkFileContent(htmlPath, /type="application\/ld\+json"/, 'JSON-LD 脚本');
checkFileContent(htmlPath, '"@type": "WebApplication"', 'WebApplication Schema');
checkFileContent(htmlPath, '"@type": "FAQPage"', 'FAQPage Schema');
checkFileContent(htmlPath, '"@type": "BreadcrumbList"', 'BreadcrumbList Schema');

// 4. 检查移动端优化
log.header('4. 检查移动端优化');
checkFileContent(htmlPath, 'meta name="viewport"', 'Viewport meta 标签');
checkFileContent(htmlPath, 'meta name="apple-mobile-web-app-capable"', 'iOS web app 支持');
checkFileContent(htmlPath, 'meta name="theme-color"', 'Theme color 标签');

// 5. 检查性能优化
log.header('5. 检查性能优化');
checkFileContent(htmlPath, 'link rel="preconnect"', 'Preconnect 链接');
checkFileContent(htmlPath, 'link rel="dns-prefetch"', 'DNS Prefetch');
checkFileContent(htmlPath, 'link rel="preload"', 'Preload 资源');

// 6. 检查 SEO 配置文件
log.header('6. 检查 SEO 配置内容');
const seoConfigPath = path.join(__dirname, '../src/data/seoConfig.ts');
if (fs.existsSync(seoConfigPath)) {
  const seoConfig = fs.readFileSync(seoConfigPath, 'utf8');
  checkCount++;
  if (seoConfig.includes('keywordLibrary')) {
    log.success('SEO 配置包含关键词库');
  } else {
    log.error('SEO 配置缺少关键词库');
    errorCount++;
  }

  checkCount++;
  if (seoConfig.includes('faqSchema')) {
    log.success('SEO 配置包含 FAQ Schema');
  } else {
    log.error('SEO 配置缺少 FAQ Schema');
    errorCount++;
  }

  checkCount++;
  if (seoConfig.includes('pageMetadata')) {
    log.success('SEO 配置包含页面元数据');
  } else {
    log.error('SEO 配置缺少页面元数据');
    errorCount++;
  }
}

// 7. 检查 robots.txt
log.header('7. 检查 Robots.txt');
const robotsPath = path.join(__dirname, '../public/robots.txt');
checkFileContent(robotsPath, 'User-agent: *', 'User-agent 规则');
checkFileContent(robotsPath, 'Sitemap:', 'Sitemap 声明');
checkFileContent(robotsPath, 'Allow:', 'Allow 规则');

// 8. 检查 sitemap.xml
log.header('8. 检查 Sitemap.xml');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
checkFileContent(sitemapPath, '<?xml version="1.0"', 'XML 声明');
checkFileContent(sitemapPath, '<urlset', 'URL 集合');
checkFileContent(sitemapPath, 'hreflang', '多语言标记');

// 9. 检查 App.tsx 中的集成
log.header('9. 检查代码集成');
const appPath = path.join(__dirname, '../src/App.tsx');
checkFileContent(appPath, 'useSEO', 'useSEO Hook 使用');
checkFileContent(appPath, 'useWebVitals', 'useWebVitals Hook 使用');
checkFileContent(appPath, 'initSEOAudit', 'SEO 审核初始化');

// 最终报告
log.header('📊 检查总结');
const successCount = checkCount - errorCount - warningCount;
console.log(`\n总检查数: ${checkCount}`);
console.log(`${colors.green}通过: ${successCount}${colors.reset}`);
console.log(`${colors.yellow}警告: ${warningCount}${colors.reset}`);
console.log(`${colors.red}错误: ${errorCount}${colors.reset}\n`);

if (errorCount > 0) {
  console.log(`${colors.red}❌ SEO 检查失败！请修复上述错误。${colors.reset}\n`);
  process.exit(1);
} else if (warningCount > 0) {
  console.log(`${colors.yellow}⚠️  SEO 检查通过，但有 ${warningCount} 个警告。${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.green}✅ SEO 检查完全通过！${colors.reset}\n`);
  process.exit(0);
}
