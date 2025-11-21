/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// SVG to PNG converter using sharp (if available) or puppeteer
async function convertSvgToPng() {
  const svgPath = path.join(__dirname, '../public/logo.svg');
  const outputPath = path.join(__dirname, '../public/logo.png');
  
  try {
    // Try using sharp first
    try {
      const sharp = require('sharp');
      const svgBuffer = fs.readFileSync(svgPath);
      
      await sharp(svgBuffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Logo PNG olarak kaydedildi: ${outputPath}`);
      console.log(`   Boyut: 512x512px`);
      return;
    } catch {
      console.log('Sharp bulunamadı, Puppeteer deneniyor...');
    }
    
    // Fallback to puppeteer
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    await page.setContent(`<div style="background: black; padding: 20px; display: inline-block;">${svgContent}</div>`);
    
    const element = await page.$('svg');
    await element.screenshot({ path: outputPath, type: 'png' });
    
    await browser.close();
    console.log(`✅ Logo PNG olarak kaydedildi: ${outputPath}`);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('\nAlternatif yöntem:');
    console.log('1. SVG dosyasını bir tarayıcıda açın');
    console.log('2. F12 ile Developer Tools\'u açın');
    console.log('3. SVG elementini seçin');
    console.log('4. Sağ tıklayıp "Capture node screenshot" seçin');
    console.log('\nVeya online bir SVG to PNG converter kullanın:');
    console.log('- https://cloudconvert.com/svg-to-png');
    console.log('- https://convertio.co/svg-png/');
  }
}

convertSvgToPng();

