# Play Console Test Kullanıcıları CSV Formatı

## CSV Dosyası Formatı

Google Play Console'da dahili test kullanıcıları eklemek için CSV dosyası kullanabilirsin. Format çok basit:

### Format 1: Sadece E-posta Adresleri (En Basit)

```csv
Email
yasertunc@gmail.com
waruvay@gmail.com
test1@example.com
test2@example.com
```

### Format 2: E-posta + İsim (Opsiyonel)

```csv
Email,Name
yasertunc@gmail.com,Yaser Tunç
waruvay@gmail.com,Test Kullanıcı 1
test1@example.com,Test Kullanıcı 2
```

## Örnek CSV Dosyası Oluşturma

1. **Excel veya Google Sheets'te:**
   - İlk satır: `Email` (veya `Email,Name`)
   - Sonraki satırlar: Her satıra bir e-posta adresi
   - Dosyayı **CSV** formatında kaydet

2. **Notepad'te manuel:**

   ```
   Email
   yasertunc@gmail.com
   waruvay@gmail.com
   test1@example.com
   ```

3. **VS Code'da:**
   - Yeni dosya oluştur
   - İçeriği yukarıdaki gibi yaz
   - `.csv` uzantısıyla kaydet

## Notlar

- **Maksimum 100 kullanıcı** ekleyebilirsin (dahili test için)
- E-posta adresleri **virgülle ayrılmış** olmalı
- **Başlık satırı** (`Email` veya `Email,Name`) zorunlu
- Her satırda **bir e-posta adresi** olmalı
- Geçerli e-posta formatında olmalı

## Hızlı Örnek

`test-users.csv` dosyası:

```csv
Email
yasertunc@gmail.com
waruvay@gmail.com
```

Bu dosyayı Play Console'da "CSV dosyası yükleyin" linkine tıklayarak yükleyebilirsin.
