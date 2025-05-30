const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const sizes = [16, 32, 64, 128, 256, 512, 1024];
const svgPath = path.join(__dirname, '../public/focus-icon.svg');
const iconsDirPath = path.join(__dirname, '../public/icons');
const iconsetDirPath = path.join(__dirname, '../public/icon.iconset');

// 确保目录存在
if (!fs.existsSync(iconsDirPath)) {
  fs.mkdirSync(iconsDirPath, { recursive: true });
}

if (!fs.existsSync(iconsetDirPath)) {
  fs.mkdirSync(iconsetDirPath, { recursive: true });
}

// 生成各种尺寸的PNG图标
async function generatePngIcons() {
  console.log('正在生成PNG图标...');

  for (const size of sizes) {
    const outputPath = path.join(iconsDirPath, `icon-${size}.png`);
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`已生成 ${size}x${size} 图标`);
  }

  // 复制到iconset目录用于生成Mac图标
  for (const size of sizes) {
    if (size === 16 || size === 32 || size === 64 || size === 128 || size === 256 || size === 512 || size === 1024) {
      const sourcePath = path.join(iconsDirPath, `icon-${size}.png`);
      
      // 为每个尺寸生成1x和2x版本
      if (size <= 512) {
        const targetPath1x = path.join(iconsetDirPath, `icon_${size/2}x${size/2}.png`);
        fs.copyFileSync(sourcePath, targetPath1x);
        console.log(`已复制 ${size}x${size} 到 ${targetPath1x}`);
      }
      
      const targetPath2x = path.join(iconsetDirPath, `icon_${size/2}x${size/2}@2x.png`);
      fs.copyFileSync(sourcePath, targetPath2x);
      console.log(`已复制 ${size}x${size} 到 ${targetPath2x}`);
    }
  }
}

// 生成Mac图标
async function generateMacIcon() {
  console.log('正在生成Mac图标...');
  try {
    // 使用iconutil命令生成icns文件
    execSync(`iconutil -c icns "${iconsetDirPath}" -o "${path.join(__dirname, '../public/icon.icns')}"`);
    console.log('已生成 icon.icns');
  } catch (error) {
    console.error('生成Mac图标失败:', error.message);
  }
}

// 更新主PNG图标
async function updateMainPngIcon() {
  console.log('正在更新主PNG图标...');
  await sharp(svgPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/icon.png'));
  console.log('已更新 icon.png');
}

// 执行所有任务
async function main() {
  try {
    await generatePngIcons();
    await updateMainPngIcon();
    await generateMacIcon();
    console.log('所有图标生成完成！');
  } catch (error) {
    console.error('图标生成失败:', error);
  }
}

main(); 