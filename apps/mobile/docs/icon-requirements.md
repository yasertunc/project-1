# Uygulama İkonu Gereksinimleri

## Gerekli Dosyalar

Expo uygulaması için aşağıdaki icon dosyaları gereklidir:

### 1. `icon.png`
- **Boyut**: 1024x1024 piksel
- **Format**: PNG, şeffaf arka planlı
- **Kullanım**: iOS ve Android ana ikon
- **Konum**: `apps/mobile/assets/icon.png`

### 2. `adaptive-icon.png` (Android)
- **Boyut**: 1024x1024 piksel
- **Format**: PNG, şeffaf arka planlı
- **Kullanım**: Android adaptive icon (foreground)
- **Konum**: `apps/mobile/assets/adaptive-icon.png`
- **Not**: Android 8.0+ için adaptive icon sistemi kullanılır

### 3. `splash-icon.png`
- **Boyut**: 1024x1024 piksel (veya daha küçük, merkezde görünecek)
- **Format**: PNG, şeffaf arka planlı
- **Kullanım**: Splash screen'de gösterilen ikon
- **Konum**: `apps/mobile/assets/splash-icon.png`

### 4. `favicon.png` (Web)
- **Boyut**: 32x32 veya 16x16 piksel
- **Format**: PNG
- **Kullanım**: Web uygulaması için favicon
- **Konum**: `apps/mobile/assets/favicon.png`

## İkon Tasarım Önerileri

1. **Basit ve tanınabilir**: Küçük boyutlarda da net görünmeli
2. **Şeffaf arka plan**: Arka plan şeffaf olmalı (alpha channel)
3. **Yüksek kontrast**: Farklı arka plan renklerinde görünür olmalı
4. **Kenar boşluğu**: İkonun kenarlarından %10-20 boşluk bırakılmalı
5. **Renkli ve canlı**: Marka renklerini yansıtmalı

## Mevcut Logo Kullanımı

Altın sarısı "F" harfi logosu:
- **Renk**: Altın sarısı (#FFD700 benzeri)
- **Arka plan**: Şeffaf veya mavi dikey çizgili arka plan
- **Stil**: Modern, kaligrafik "F" harfi

## İkon Güncelleme Adımları

1. Logo dosyasını hazırlayın (1024x1024 PNG, şeffaf arka planlı)
2. `apps/mobile/assets/icon.png` dosyasını değiştirin
3. `apps/mobile/assets/adaptive-icon.png` dosyasını aynı görüntü ile güncelleyin
4. `apps/mobile/assets/splash-icon.png` dosyasını güncelleyin (isteğe bağlı olarak biraz daha küçük olabilir)
5. Yeni build yapın: `eas build --profile production`

## Test

İkonları test etmek için:

```bash
cd apps/mobile
npx expo start
```

Expo Go veya development build'de ikonları görebilirsiniz.

## Önemli Notlar

- **Adaptive Icon**: Android için foreground image gereklidir. Arka plan rengi `app.config.ts` içinde `android.adaptiveIcon.backgroundColor` olarak ayarlanır (şu anda `#ffffff`)
- **iOS**: iOS'ta ikon otomatik olarak yuvarlatılır ve gölge eklenir
- **Cache**: İkon değişikliklerinden sonra cache'i temizleyin: `npx expo start --clear`

