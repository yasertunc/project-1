/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Optimize edilmiş boyutlar (sayfadaki ebatlara göre - 400x830px orijinal boyut)
const TARGET_WIDTH = 400; // Orijinal genişlik
const TARGET_HEIGHT = 830; // Orijinal yükseklik (400 * 830/400 = 830)
const QUALITY = 85; // JPG kalitesi
const MAX_FILE_SIZE = 150 * 1024; // 150KB maksimum

const screenshotsDir = path.join(__dirname, "../public/assets/screenshots");
const screenshots = [
  "screenshot-1-map.jpg",
  "screenshot-2-places.jpg",
  "screenshot-3-profile.jpg",
  "screenshot-4-search.jpg",
  "screenshot-5-filters.jpg",
  "screenshot-6-food.jpg",
  "screenshot-7-settings.jpg",
  "screenshot-8-vip.jpg",
];

async function optimizeImage(filename) {
  const inputPath = path.join(screenshotsDir, filename);
  const outputPath = path.join(
    screenshotsDir,
    filename.replace(".jpg", "-optimized.jpg")
  );

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  ${filename} bulunamadı, atlanıyor...`);
    return;
  }

  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    console.log(`\n📸 ${filename} işleniyor...`);
    console.log(`   Orijinal boyut: ${(originalSize / 1024).toFixed(2)} KB`);

    // Resmi optimize et
    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: QUALITY,
        progressive: true,
        mozjpeg: true,
      })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(
      `   ✅ Optimize edildi: ${(newSize / 1024).toFixed(2)} KB (${reduction}% azalma)`
    );

    // Orijinal dosyayı yedekle ve optimize edilmişi yerine koy
    const backupPath = path.join(
      screenshotsDir,
      filename.replace(".jpg", "-original.jpg")
    );
    fs.copyFileSync(inputPath, backupPath);
    fs.copyFileSync(outputPath, inputPath);
    fs.unlinkSync(outputPath);

    console.log(`   💾 Orijinal yedeklendi: ${path.basename(backupPath)}`);
  } catch (error) {
    console.error(`❌ ${filename} işlenirken hata:`, error.message);
  }
}

async function optimizeAll() {
  console.log("🚀 Ekran görüntüleri optimize ediliyor...\n");
  console.log(
    `📐 Hedef boyut: ${TARGET_WIDTH}x${TARGET_HEIGHT}px (9:16 aspect ratio)`
  );
  console.log(`🎨 Kalite: ${QUALITY}%\n`);

  for (const screenshot of screenshots) {
    await optimizeImage(screenshot);
  }

  console.log("\n✨ Tüm resimler optimize edildi!");
}

// Sharp kontrolü
try {
  require.resolve("sharp");
  optimizeAll();
} catch {
  console.log("❌ Sharp paketi bulunamadı.");
  console.log("📦 Yüklemek için: npm install sharp");
  console.log("\nAlternatif: Resimleri manuel olarak şu boyutlara getirin:");
  console.log(`   Boyut: ${TARGET_WIDTH}x${TARGET_HEIGHT}px`);
  console.log(`   Format: JPG`);
  console.log(`   Kalite: ${QUALITY}%`);
  console.log(`   Maksimum dosya boyutu: ${MAX_FILE_SIZE / 1024}KB`);
}
