# Harita Özelleştirme Rehberi

Google Maps component'i artık birçok özelleştirme seçeneği sunuyor. Bu dokümantasyon, haritanızı nasıl özelleştirebileceğinizi açıklar.

## Temel Özelleştirmeler

### 1. Harita Stili (Map Style)

Haritanın görsel stilini değiştirebilirsiniz:

```tsx
<GoogleMap
  mapStyle="default" // Varsayılan stil
  // veya
  mapStyle="dark" // Koyu tema
  // veya
  mapStyle="minimal" // Minimal (POI'ler gizli)
  // veya
  mapStyle="colorful" // Renkli tema
/>
```

**Mevcut Stiller:**

- `default` - Standart Google Maps görünümü
- `dark` - Koyu tema (gece modu)
- `minimal` - Sade görünüm (POI ve transit etiketleri gizli)
- `colorful` - Özel renkli tema

### 2. Harita Tipi (Map Type)

Farklı harita tiplerini seçebilirsiniz:

```tsx
<GoogleMap
  mapTypeId="roadmap" // Yol haritası (varsayılan)
  // veya
  mapTypeId="satellite" // Uydu görünümü
  // veya
  mapTypeId="hybrid" // Hibrit (uydu + yollar)
  // veya
  mapTypeId="terrain" // Arazi görünümü
/>
```

### 3. Harita Kontrolleri

Hangi kontrollerin görüneceğini kontrol edebilirsiniz:

```tsx
<GoogleMap
  zoomControl={true} // Zoom butonları
  mapTypeControl={false} // Harita tipi seçici
  scaleControl={true} // Ölçek göstergesi
  streetViewControl={false} // Street View butonu
  fullscreenControl={true} // Tam ekran butonu
  disableDefaultUI={false} // Tüm kontrolleri gizle
/>
```

### 4. Marker Özelleştirmeleri

Marker'ların görünümünü özelleştirebilirsiniz:

```tsx
<GoogleMap
  markerColor="#667eea" // Marker arka plan rengi
  markerSize={40} // Marker boyutu (piksel)
  markers={[
    {
      id: "1",
      position: { lat: 41.0082, lng: 28.9784 },
      icon: "🏛️",
      title: "Müze",
    },
  ]}
/>
```

## Gelişmiş Özelleştirmeler

### Özel Map Style

Eğer hazır stiller yeterli değilse, kendi özel stilizi oluşturabilirsiniz:

```tsx
const customStyle: google.maps.MapTypeStyle[] = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#1e3a8a" }], // Koyu mavi su
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }], // Beyaz yollar
  },
  // Daha fazla stil kuralı...
];

<GoogleMap
  mapStyle={customStyle} // Özel stil dizisi
/>;
```

**Google Maps Styling Wizard** kullanarak özel stil oluşturabilirsiniz:

- [Snazzy Maps](https://snazzymaps.com/) - Hazır stiller
- [Google Maps Platform Styling Wizard](https://mapstyle.withgoogle.com/) - Kendi stilinizi oluşturun

### Marker Özelleştirmeleri

Her marker için ayrı ayrı özelleştirme yapabilirsiniz:

```tsx
<GoogleMap
  markers={[
    {
      id: "museum",
      position: { lat: 41.0122, lng: 28.9764 },
      icon: "🏛️",
      title: "Arkeoloji Müzesi",
      onClick: () => {
        console.log("Müze tıklandı!");
        // Modal aç, detay göster, vb.
      },
    },
    {
      id: "restaurant",
      position: { lat: 41.0102, lng: 28.9804 },
      icon: "🍴",
      title: "Restoran",
      onClick: () => {
        // Farklı bir aksiyon
      },
    },
  ]}
  onMarkerClick={(marker) => {
    // Tüm marker'lar için genel handler
    console.log("Marker tıklandı:", marker);
  }}
/>
```

## Örnek Kullanımlar

### Koyu Tema Harita

```tsx
<GoogleMap
  center={{ lat: 41.0082, lng: 28.9784 }}
  zoom={13}
  mapStyle="dark"
  mapTypeId="roadmap"
  markerColor="#ffd700"
/>
```

### Minimal Harita (Sadece Yollar)

```tsx
<GoogleMap
  center={{ lat: 41.0082, lng: 28.9784 }}
  zoom={13}
  mapStyle="minimal"
  mapTypeControl={false}
  streetViewControl={false}
/>
```

### Uydu Görünümü

```tsx
<GoogleMap
  center={{ lat: 41.0082, lng: 28.9784 }}
  zoom={13}
  mapTypeId="satellite"
  mapTypeControl={true} // Kullanıcı tip değiştirebilir
/>
```

### Özel Renkli Tema

```tsx
<GoogleMap
  center={{ lat: 41.0082, lng: 28.9784 }}
  zoom={13}
  mapStyle="colorful"
  markerColor="#764ba2"
  markerSize={50}
/>
```

## AppPhoneMock'ta Özelleştirme

`AppPhoneMock` component'indeki haritayı özelleştirmek için `MapView` fonksiyonunu düzenleyin:

```tsx
// src/components/AppPhoneMock.tsx içinde
<GoogleMap
  center={center}
  zoom={13}
  markers={markers}
  className="absolute inset-0"
  mapStyle="minimal" // Burayı değiştirin
  mapTypeId="roadmap" // Burayı değiştirin
  markerColor="#667eea" // Burayı değiştirin
  markerSize={40} // Burayı değiştirin
/>
```

## Stil Örnekleri

### FellowUs Temasına Uygun

```tsx
<GoogleMap
  mapStyle="minimal"
  markerColor="#667eea" // Primary color
  markerSize={45}
  zoomControl={true}
  fullscreenControl={true}
/>
```

### VIP Tema

```tsx
<GoogleMap
  mapStyle="dark"
  markerColor="#ffd700" // VIP gold
  markerSize={50}
/>
```

## İpuçları

1. **Performans**: Çok fazla marker varsa, clustering kullanmayı düşünün
2. **Erişilebilirlik**: Koyu tema, düşük ışıkta daha iyi görünür
3. **Marka Uyumu**: Marker renklerini marka renklerinizle eşleştirin
4. **Kullanıcı Deneyimi**: Minimal stil, dikkat dağıtıcı öğeleri azaltır

## Daha Fazla Özelleştirme

Gelecekte eklenebilecek özellikler:

- [ ] Marker clustering (çok sayıda marker için)
- [ ] Info windows (marker tıklanınca popup)
- [ ] Custom marker images (SVG/PNG)
- [ ] Drawing tools (çizim araçları)
- [ ] Heatmaps (yoğunluk haritaları)
- [ ] Polylines (rota çizgileri)
- [ ] Circles (mesafe göstergeleri)
