const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../frontend/public/icons/icon.svg');
const outputDir = path.join(__dirname, '../frontend/public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size} icon:`, error.message);
    }
  }

  // Also generate Apple touch icon
  try {
    await sharp(inputSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('✅ Generated Apple touch icon (180x180)');
  } catch (error) {
    console.error('❌ Error generating Apple touch icon:', error.message);
  }

  // Generate favicon
  try {
    await sharp(inputSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../frontend/public/favicon.png'));
    console.log('✅ Generated favicon (32x32)');
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
  }

  console.log('\n🎉 Icon generation complete!');
}

generateIcons().catch(console.error);
