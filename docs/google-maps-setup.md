# Google Maps Entegrasyonu

Bu dokümantasyon, FellowUs uygulamasına Google Maps entegrasyonunun nasıl yapıldığını ve nasıl kullanılacağını açıklar.

## Waze Hangi Platformu Kullanıyor?

Waze, Google'ın sahibi olduğu bir navigasyon uygulamasıdır ve kendi harita verilerini kullanır. Waze, kullanıcılarından topladığı gerçek zamanlı trafik ve yol bilgilerini kullanarak harita verilerini sürekli günceller.

## Google Maps API Kurulumu

### 1. Google Cloud Console'da API Key Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. **APIs & Services** > **Library** bölümüne gidin
4. **Maps JavaScript API**'yi arayın ve etkinleştirin
5. **APIs & Services** > **Credentials** bölümüne gidin
6. **Create Credentials** > **API Key** seçeneğini seçin
7. API key'inizi kopyalayın

### 2. API Key Güvenliği

API key'inizi güvence altına almak için:

1. **API restrictions** ekleyin:
   - **Application restrictions**: HTTP referrers (web sitesi)
   - **Website restrictions**: `https://www.fellowus.com/*` ve `http://localhost:*` ekleyin

2. **API restrictions** ekleyin:
   - Sadece **Maps JavaScript API**'yi seçin

### 3. Environment Variable Ekleme

`.env` dosyanıza (veya `.env.local`) API key'inizi ekleyin:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Not:** `.env` dosyasını git'e commit etmeyin. `.gitignore` dosyasında olduğundan emin olun.

### 4. Dokümantasyon Güncelleme

`docs/env.example` dosyasına örnek eklenmiştir:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Kullanım

### MapView Component

`AppPhoneMock` component'i içindeki `MapView` artık gerçek Google Maps kullanıyor:

```tsx
<MapView />
```

### GoogleMap Component

Doğrudan `GoogleMap` component'ini de kullanabilirsiniz:

```tsx
import GoogleMap from "./components/Map/GoogleMap";

<GoogleMap
  center={{ lat: 41.0082, lng: 28.9784 }} // Istanbul
  zoom={13}
  markers={[
    {
      id: "museum",
      position: { lat: 41.0122, lng: 28.9764 },
      icon: "🏛️",
      title: "Museum",
    },
  ]}
  onMapClick={(event) => {
    console.log("Map clicked:", event.latLng);
  }}
  onMarkerClick={(marker) => {
    console.log("Marker clicked:", marker);
  }}
/>;
```

### Özellikler

- ✅ Gerçek zamanlı harita görüntüleme
- ✅ Marker desteği (emoji iconlar ile)
- ✅ Kullanıcı konumu tespiti (geolocation)
- ✅ Harita tıklama eventleri
- ✅ Marker tıklama eventleri
- ✅ API key yoksa otomatik fallback (mock view)
- ✅ Loading state
- ✅ Error handling

### Marker Özellikleri

```typescript
interface Marker {
  id: string; // Unique identifier
  position: { lat: number; lng: number }; // Coordinates
  icon?: string; // Emoji icon (e.g., "🏛️")
  title?: string; // Tooltip text
  onClick?: () => void; // Click handler
}
```

## Fallback Davranışı

API key yapılandırılmamışsa veya yüklenemezse, uygulama otomatik olarak mock (sahte) harita görünümüne geçer. Bu sayede geliştirme sırasında API key olmadan da çalışabilir.

## Maliyet

Google Maps JavaScript API'nin ücretsiz kotası:

- **$200/ay** ücretsiz kredi
- **28,500 map loads/ay** ücretsiz
- **40,000 directions requests/ay** ücretsiz

Daha fazla bilgi için: [Google Maps Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)

## Alternatif Harita Çözümleri

Eğer Google Maps yerine alternatif bir çözüm kullanmak isterseniz:

1. **Mapbox GL JS** - Özelleştirilebilir, modern
2. **Leaflet + OpenStreetMap** - Ücretsiz, açık kaynak
3. **Here Maps** - Enterprise çözüm

## Sorun Giderme

### Harita görünmüyor

1. API key'in doğru yapılandırıldığından emin olun
2. Browser console'da hata mesajlarını kontrol edin
3. API key'in Maps JavaScript API için etkinleştirildiğinden emin olun
4. Domain restrictions'ların doğru olduğundan emin olun

### CORS hatası

- API key'in domain restrictions'larını kontrol edin
- Localhost için `http://localhost:*` eklediğinizden emin olun

## İleri Seviye Özellikler

Gelecekte eklenebilecek özellikler:

- [ ] Places API entegrasyonu (yakındaki yerler)
- [ ] Directions API (rota çizme)
- [ ] Geocoding API (adres arama)
- [ ] Clustering (çok sayıda marker için)
- [ ] Custom map styles
- [ ] Heatmaps
- [ ] Drawing tools
