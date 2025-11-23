import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { nativeTokens } from "../../theme/tokens";

export type PageId =
  | "map"
  | "places"
  | "filter"
  | "categories"
  | "chat"
  | "groups"
  | "social"
  | "notifications"
  | "vip"
  | "settings";

type Props = {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  pages: PageId[];
};

const PageTitle: Record<PageId, string> = {
  map: "Harita",
  places: "Yerler",
  filter: "Filtreler",
  categories: "Kategoriler",
  chat: "Sohbet",
  groups: "Gruplar",
  social: "Sosyal",
  notifications: "Bildirimler",
  vip: "VIP",
  settings: "Ayarlar",
};

export function AppPhoneMockNative({ currentPage, onPageChange, pages }: Props) {
  const navItems = useMemo(() => pages, [pages]);

  return (
    <View style={styles.phone}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>14:16</Text>
        <View style={styles.statusIcons}>
          <Text style={styles.statusIcon}>📶</Text>
          <Text style={styles.statusIcon}>📡</Text>
          <Text style={styles.statusIcon}>🔋</Text>
        </View>
      </View>

      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navContent}>
          {navItems.map((page) => {
            const isActive = page === currentPage;
            return (
              <TouchableOpacity
                key={page}
                style={[styles.navButton, isActive && styles.navButtonActive]}
                onPress={() => onPageChange(page)}
              >
                <Text style={[styles.navButtonText, isActive && styles.navButtonTextActive]}>{page.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.screen}>
        <Text style={styles.screenTitle}>{PageTitle[currentPage]}</Text>
        <ScreenContent page={currentPage} />
      </View>
    </View>
  );
}

function ScreenContent({ page }: { page: PageId }) {
  switch (page) {
    case "map":
      return (
        <View style={styles.mapCard}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 41.0082,
              longitude: 28.9784,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapHeadline}>Etrafında keşfet</Text>
            <Text style={styles.mapSub}>Popüler yerler, arkadaşlar ve VIP fırsatlar</Text>
          </View>
        </View>
      );
    case "places":
      return (
        <SectionCard title="Önerilen Yerler" subtitle="Popüler lokasyonlar">
          {["Kafe Soho", "Müze Rota", "Park Yürüyüşü", "Coworking Alanı"].map((item) => (
            <Tile key={item} title={item} />
          ))}
        </SectionCard>
      );
    case "filter":
      return (
        <SectionCard title="Filtreler" subtitle="Mesafe, kategori, VIP ve daha fazlası">
          {["VIP", "Yakınlarda", "Trend", "Açık Mekan", "Kapalı Mekan"].map((item) => (
            <Badge key={item} label={item} />
          ))}
        </SectionCard>
      );
    case "categories":
      return (
        <SectionCard title="Kategoriler" subtitle="İlgi alanlarına göre liste">
          {["Sosyal", "Yeme-İçme", "Kültür", "Spor", "Eğlence"].map((item) => (
            <Tile key={item} title={item} />
          ))}
        </SectionCard>
      );
    case "chat":
      return (
        <SectionCard title="Sohbetler" subtitle="Son mesajlar">
          {["Genel Oda", "VIP Kulüp", "Destek", "Planlama"].map((item, idx) => (
            <ChatRow key={item} title={item} snippet={`Son mesaj ${idx + 1}`} />
          ))}
        </SectionCard>
      );
    case "groups":
      return (
        <SectionCard title="Gruplar" subtitle="Topluluklar ve aktiviteler">
          {["Fotoğrafçılar", "Koşu Kulübü", "Tech Talks", "Tiyatro"].map((item) => (
            <Tile key={item} title={item} />
          ))}
        </SectionCard>
      );
    case "social":
      return (
        <SectionCard title="Sosyal Akış" subtitle="Arkadaşların ve etkinlikler">
          {["Yeni bir konser keşfedin", "Beril yeni bir yer önerdi", "VIP etkinlik daveti"].map((item) => (
            <FeedRow key={item} text={item} />
          ))}
        </SectionCard>
      );
    case "notifications":
      return (
        <SectionCard title="Bildirimler" subtitle="Önemli güncellemeler">
          {["Yeni mesaj", "Etkinlik hatırlatması", "VIP fırsat", "Güvenlik bildirimi"].map((item) => (
            <FeedRow key={item} text={item} />
          ))}
        </SectionCard>
      );
    case "vip":
      return (
        <SectionCard title="VIP" subtitle="Özel avantajlar">
          <VIPPanel />
        </SectionCard>
      );
    case "settings":
      return (
        <SectionCard title="Ayarlar" subtitle="Görünüm, dil, gizlilik">
          <SettingsPanel />
        </SectionCard>
      );
    default:
      return null;
  }
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Tile({ title }: { title: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileMeta}>Detaylar yakında</Text>
    </View>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function ChatRow({ title, snippet }: { title: string; snippet: string }) {
  return (
    <View style={styles.chatRow}>
      <View style={styles.chatAvatar}>
        <Text style={styles.chatAvatarText}>{title[0]}</Text>
      </View>
      <View style={styles.chatContent}>
        <Text style={styles.chatTitle}>{title}</Text>
        <Text style={styles.chatSnippet}>{snippet}</Text>
      </View>
      <Text style={styles.chatMeta}>Şimdi</Text>
    </View>
  );
}

function FeedRow({ text }: { text: string }) {
  return (
    <View style={styles.feedRow}>
      <Text style={styles.feedDot}>•</Text>
      <Text style={styles.feedText}>{text}</Text>
    </View>
  );
}

function VIPPanel() {
  return (
    <View style={styles.vipPanel}>
      <Image
        source={{ uri: "https://via.placeholder.com/60x60.png?text=VIP" }}
        style={styles.vipIcon}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.vipTitle}>VIP Membership</Text>
        <Text style={styles.vipSub}>Özel avantajlar, öncelikli destek</Text>
      </View>
      <TouchableOpacity style={styles.vipButton}>
        <Text style={styles.vipButtonText}>Katıl</Text>
      </TouchableOpacity>
    </View>
  );
}

function SettingsPanel() {
  return (
    <View style={styles.settingsPanel}>
      <SettingsRow label="Tema" value="Otomatik" />
      <SettingsRow label="Dil" value="Türkçe" />
      <SettingsRow label="Bölge" value="TR" />
      <SettingsRow label="Bildirimler" value="Açık" />
    </View>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingsRow}>
      <Text style={styles.settingsLabel}>{label}</Text>
      <Text style={styles.settingsValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
    backgroundColor: nativeTokens.palette.surface.white,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8f9fe",
    borderBottomWidth: 1,
    borderBottomColor: "#ececf5",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
    color: nativeTokens.palette.text.primary,
  },
  statusIcons: {
    flexDirection: "row",
    gap: 6,
  },
  statusIcon: {
    fontSize: 14,
  },
  navBar: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ececf5",
    backgroundColor: "#fff",
  },
  navContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f1f2f9",
  },
  navButtonActive: {
    backgroundColor: nativeTokens.palette.primary.main,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4a4a5a",
  },
  navButtonTextActive: {
    color: "#fff",
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: nativeTokens.palette.text.primary,
    marginBottom: 12,
  },
  mapCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  mapHeadline: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  mapSub: {
    color: "#f3f4ff",
    marginTop: 4,
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: nativeTokens.palette.text.primary,
  },
  sectionSub: {
    fontSize: 13,
    color: nativeTokens.palette.text.secondary,
    marginTop: 2,
  },
  sectionBody: {
    gap: 10,
  },
  tile: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f7f8ff",
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f1f2b",
  },
  tileMeta: {
    fontSize: 12,
    color: "#6b6b7a",
    marginTop: 2,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eef0ff",
    borderRadius: 10,
  },
  badgeText: {
    color: "#4a56e2",
    fontWeight: "700",
    fontSize: 12,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f2f9",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: {
    color: "#4a56e2",
    fontWeight: "800",
  },
  chatContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f1f2b",
  },
  chatSnippet: {
    fontSize: 12,
    color: "#6b6b7a",
    marginTop: 2,
  },
  chatMeta: {
    fontSize: 11,
    color: "#6b6b7a",
  },
  feedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  feedDot: {
    color: "#4a56e2",
    fontSize: 18,
  },
  feedText: {
    color: "#1f1f2b",
    fontSize: 14,
  },
  vipPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#fff7e6",
    borderRadius: 12,
  },
  vipIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#ffe4a6",
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#b8860b",
  },
  vipSub: {
    fontSize: 12,
    color: "#8a6c1d",
  },
  vipButton: {
    backgroundColor: "#ffb703",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  vipButtonText: {
    color: "#1f1f2b",
    fontWeight: "800",
  },
  settingsPanel: {
    gap: 8,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f9",
  },
  settingsLabel: {
    fontSize: 14,
    color: "#1f1f2b",
  },
  settingsValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4a56e2",
  },
});
