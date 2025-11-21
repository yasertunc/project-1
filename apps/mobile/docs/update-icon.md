# Uygulama İkonunu Güncelleme Rehberi

## Altın Sarısı "F" Logosu Kullanımı

Bu rehber, yeni altın sarısı "F" logosunu uygulama ikonu olarak kullanmak için adımları içerir.

## Gerekli Adımlar

### 1. Logo Dosyasını Hazırlayın

Logo dosyası aşağıdaki özelliklere sahip olmalıdır:

- **Boyut**: 1024x1024 piksel
- **Format**: PNG
- **Arka Plan**: Şeffaf (transparent)
- **İçerik**: Altın sarısı "F" harfi, mavi dikey çizgili arka plan isteğe bağlı

### 2. İkon Dosyalarını Güncelleyin

Aşağıdaki dosyaları `apps/mobile/assets/` klasörüne kopyalayın:

```
apps/mobile/assets/
├── icon.png              (1024x1024, şeffaf arka plan)
├── adaptive-icon.png     (1024x1024, şeffaf arka plan - Android için)
├── splash-icon.png       (1024x1024, şeffaf arka plan - splash screen için)
└── favicon.png           (32x32 veya 16x16 - web için, opsiyonel)
```

### 3. Dosyaları Değiştirin

Mevcut dosyaları yeni logo ile değiştirin:

```bash
# Windows PowerShell
Copy-Item "yeni-icon.png" "apps\mobile\assets\icon.png" -Force
Copy-Item "yeni-icon.png" "apps\mobile\assets\adaptive-icon.png" -Force
Copy-Item "yeni-icon.png" "apps\mobile\assets\splash-icon.png" -Force
```

### 4. Yapılandırmayı Kontrol Edin

`app.config.ts` dosyası zaten güncellenmiş durumda:

- Splash screen arka plan rengi: Mavi (`#667eea`)
- Android adaptive icon arka plan rengi: Mavi (`#667eea`)

### 5. Cache'i Temizleyin

```bash
cd apps/mobile
npx expo start --clear
```

### 6. Yeni Build Oluşturun

Development build için:

```bash
eas build --profile development --platform android
```

Production build için:

```bash
eas build --profile production --platform android
```

## Tasarım Notları

- **Logo**: Altın sarısı "F" harfi, modern ve kaligrafik stil
- **Renk**: Altın sarısı (#FFD700 benzeri)
- **Arka Plan**: Mavi (#667eea) - adaptive icon ve splash screen için

## Test

1. Expo Go ile test:

   ```bash
   npx expo start
   ```

2. Development build ile test:
   ```bash
   eas build --profile development --platform android
   ```

## Sorun Giderme

### İkon Görünmüyor

- Cache'i temizleyin: `npx expo start --clear`
- Build'i yeniden yapın
- Expo Go cache'ini temizleyin

### İkon Bulanık

- Dosya boyutunun tam 1024x1024 olduğundan emin olun
- Dosyanın PNG formatında olduğundan emin olun
- Yüksek kaliteli kaynak görüntü kullanın

### Android Adaptive Icon Sorunu

- `adaptive-icon.png` dosyasının şeffaf arka planlı olduğundan emin olun
- Arka plan rengi `app.config.ts` içinde `#667eea` olarak ayarlanmıştır
- Build sonrası Android cihazda test edin
