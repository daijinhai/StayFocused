const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '../public/icons');
const winIconDir = path.join(__dirname, '../public/icons-win');

// 确保目录存在
if (!fs.existsSync(winIconDir)) {
  fs.mkdirSync(winIconDir, { recursive: true });
}

// 确保icons目录中有所需的PNG图标
async function ensureIconsExist() {
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const svgPath = path.join(__dirname, '../public/focus-icon.svg');
  
  console.log('检查并生成必要的PNG图标...');
  
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}.png`);
    if (!fs.existsSync(outputPath)) {
      console.log(`生成 ${size}x${size} 图标...`);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }
  }
}

// 使用 png-to-ico 工具创建 .ico 文件
async function createIcoWithNpm() {
  try {
    console.log('尝试使用png-to-ico创建Windows图标...');
    // 检查是否安装了png-to-ico
    try {
      execSync('npm list -g png-to-ico');
    } catch (error) {
      console.log('安装png-to-ico工具...');
      execSync('npm install -g png-to-ico');
    }
    
    // 创建图标文件
    const iconFiles = [16, 24, 32, 48, 64, 128, 256].map(size => 
      path.join(iconsDir, `icon-${size}.png`)
    );
    
    const iconFilesArg = iconFiles.join(' ');
    const outputPath = path.join(winIconDir, 'icon.ico');
    
    execSync(`png-to-ico ${iconFilesArg} > "${outputPath}"`);
    console.log(`Windows图标已创建: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('使用png-to-ico创建图标失败:', error.message);
    return false;
  }
}

// 使用 ImageMagick 创建 .ico 文件
async function createIcoWithImageMagick() {
  try {
    console.log('尝试使用ImageMagick创建Windows图标...');
    const inputPath = path.join(iconsDir, 'icon-256.png');
    const outputPath = path.join(winIconDir, 'icon.ico');
    
    // 测试ImageMagick是否可用
    try {
      execSync('magick --version');
    } catch (error) {
      console.error('ImageMagick未安装或不可用');
      console.log('请安装ImageMagick: https://imagemagick.org/script/download.php');
      return false;
    }
    
    execSync(`magick convert "${inputPath}" -define icon:auto-resize=256,128,64,48,32,16 "${outputPath}"`);
    console.log(`Windows图标已创建: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('使用ImageMagick创建图标失败:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  try {
    await ensureIconsExist();
    
    let success = await createIcoWithNpm();
    if (!success) {
      success = await createIcoWithImageMagick();
    }
    
    if (!success) {
      console.log('手动创建Windows图标的方法:');
      console.log('1. 使用在线转换工具，如 https://convertico.com/');
      console.log('2. 上传 public/icons/icon-256.png 文件');
      console.log('3. 下载转换后的.ico文件并保存到 public/icons-win/icon.ico');
    }
    
    console.log('Windows图标生成过程完成');
  } catch (error) {
    console.error('生成Windows图标时出错:', error);
  }
}

main(); 