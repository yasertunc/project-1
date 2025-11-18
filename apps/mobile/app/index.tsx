import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar as RNStatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  SwipeableNavigation,
  PageId,
} from "../src/components/SwipeableNavigation";
import { nativeTokens } from "../src/theme/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// StatusBar Component - HTML tasarımına göre güncellendi (gradient kaldırıldı)
function StatusBar() {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusBarTime}>{currentTime}</Text>
      <View style={styles.statusBarIcons}>
        <Text style={styles.statusBarIcon}>📶</Text>
        <Text style={styles.statusBarIcon}>📡</Text>
        <Text style={styles.statusBarIcon}>🔋</Text>
      </View>
    </View>
  );
}

// Content Component - renders different pages
function Content({
  page,
  onPageSelect,
}: {
  page: PageId;
  onPageSelect: (page: PageId) => void;
}) {
  switch (page) {
    case "map":
      return <MapView />;
    case "places":
      return <PlacesView />;
    case "search":
      return <SearchView />;
    case "filter":
      return <FilterView />;
    case "categories":
      return <CategoriesView />;
    case "profile":
      return <ProfileView />;
    case "chat":
      return <ChatView />;
    case "groups":
      return <GroupsView />;
    case "social":
      return <SocialView />;
    case "vip":
      return <VipView />;
    case "settings":
      return <SettingsView onPageSelect={onPageSelect} />;
    case "account":
      return <AccountView />;
    case "privacy":
      return <PrivacyView />;
    case "notifications-settings":
      return <NotificationsSettingsView />;
    case "appearance":
      return <AppearanceView />;
    case "help":
      return <HelpView />;
    default:
      return <MapView />;
  }
}

// MapView - HTML tasarımına göre implement edildi
function MapView() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.mapContainer}>
      <LinearGradient
        colors={["#f0f4f8", "#d9e2ec"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Streets */}
      <LinearGradient
        colors={["#ffd700", "#ffed4e", "#ffd700"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.streetHorizontal}
      />
      <LinearGradient
        colors={["#ffd700", "#ffed4e", "#ffd700"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.streetVertical}
      />

      {/* Buildings */}
      <LinearGradient
        colors={["#ffeaa7", "#fdcb6e"]}
        style={[styles.buildingBlock, styles.block1]}
      />
      <LinearGradient
        colors={["#ffeaa7", "#fdcb6e"]}
        style={[styles.buildingBlock, styles.block2]}
      />
      <LinearGradient
        colors={["#ffeaa7", "#fdcb6e"]}
        style={[styles.buildingBlock, styles.block3]}
      />
      <LinearGradient
        colors={["#ffeaa7", "#fdcb6e"]}
        style={[styles.buildingBlock, styles.block4]}
      />

      {/* Parks */}
      <LinearGradient
        colors={["#55efc4", "#00b894"]}
        style={[styles.park, styles.park1]}
      />
      <LinearGradient
        colors={["#55efc4", "#00b894"]}
        style={[styles.park, styles.park2]}
      />

      {/* Water */}
      <LinearGradient
        colors={["#74b9ff", "#0984e3", "#74b9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.water}
      />

      {/* Location Markers */}
      <View style={[styles.marker, styles.markerBank]}>
        <LinearGradient
          colors={["#ff6b6b", "#ee5a24"]}
          style={styles.markerBg}
        />
        <Text style={styles.markerContent}>🏛️</Text>
      </View>
      <View style={[styles.marker, styles.markerMoney]}>
        <LinearGradient
          colors={["#26de81", "#20bf6b"]}
          style={styles.markerBg}
        />
        <Text style={styles.markerContent}>💰</Text>
      </View>
      <View style={[styles.marker, styles.markerHospital]}>
        <LinearGradient
          colors={["#4ecdc4", "#44a3aa"]}
          style={styles.markerBg}
        />
        <Text style={styles.markerContent}>🏥</Text>
      </View>
      <View style={[styles.marker, styles.markerFood]}>
        <LinearGradient
          colors={["#a55eea", "#8854d0"]}
          style={styles.markerBg}
        />
        <Text style={styles.markerContent}>🍴</Text>
      </View>
      <View style={[styles.marker, styles.markerGas]}>
        <LinearGradient
          colors={["#fc5c65", "#eb3b5a"]}
          style={styles.markerBg}
        />
        <Text style={styles.markerContent}>⛽</Text>
      </View>

      {/* User Markers */}
      <View
        style={[styles.userMarker, styles.userMarker1, styles.userMarkerOnline]}
      >
        <Text style={styles.userMarkerEmoji}>👨</Text>
        <View style={styles.onlineDot} />
      </View>
      <View
        style={[styles.userMarker, styles.userMarker2, styles.userMarkerOnline]}
      >
        <Text style={styles.userMarkerEmoji}>👩</Text>
        <View style={styles.onlineDot} />
      </View>
      <View style={[styles.userMarker, styles.userMarker3]}>
        <Text style={styles.userMarkerEmoji}>👤</Text>
      </View>
      <View
        style={[styles.userMarker, styles.userMarker4, styles.userMarkerOnline]}
      >
        <Text style={styles.userMarkerEmoji}>👱</Text>
        <View style={styles.onlineDot} />
      </View>

      {/* Location Indicator */}
      <Animated.View
        style={[
          styles.locationIndicator,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <View style={styles.locationOuter} />
        <View style={styles.locationInner} />
      </Animated.View>

      {/* Map Controls */}
      <View style={styles.compass}>
        <Text style={styles.compassIcon}>🧭</Text>
      </View>
      <View style={styles.rangeNotification}>
        <Text style={styles.rangeNotificationIcon}>👥</Text>
        <View style={styles.rangeCount}>
          <Text style={styles.rangeCountText}>7</Text>
        </View>
      </View>
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapControlBtn}>
          <Text style={styles.mapControlBtnText}>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapControlBtn}>
          <Text style={styles.mapControlBtnText}>➖</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapControlBtn}>
          <Text style={styles.mapControlBtnText}>📍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// PlacesView - HTML tasarımına göre implement edildi
function PlacesView() {
  const places = [
    {
      icon: "🏪",
      name: "Market",
      count: "3 yakın konum",
      distance: "En yakın: 150m",
    },
    {
      icon: "☕",
      name: "Kafe",
      count: "5 yakın konum",
      distance: "En yakın: 200m",
    },
    {
      icon: "🏥",
      name: "Hastane",
      count: "1 yakın konum",
      distance: "En yakın: 800m",
    },
    {
      icon: "⛽",
      name: "Benzinlik",
      count: "2 yakın konum",
      distance: "En yakın: 450m",
    },
    {
      icon: "🏦",
      name: "Banka/ATM",
      count: "4 yakın konum",
      distance: "En yakın: 300m",
    },
    {
      icon: "🍕",
      name: "Restoran",
      count: "8 yakın konum",
      distance: "En yakın: 100m",
    },
    {
      icon: "🏋️",
      name: "Spor Salonu",
      count: "2 yakın konum",
      distance: "En yakın: 600m",
    },
    {
      icon: "🏫",
      name: "Okul",
      count: "3 yakın konum",
      distance: "En yakın: 500m",
    },
    {
      icon: "🏬",
      name: "AVM",
      count: "1 yakın konum",
      distance: "En yakın: 1.2km",
    },
    {
      icon: "🚇",
      name: "Metro",
      count: "2 yakın konum",
      distance: "En yakın: 350m",
    },
  ];

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Yakındaki Yerler</Text>
        <Text style={styles.pageSubtitle}>Size en yakın konumlar</Text>
      </View>
      <View style={styles.placesGrid}>
        {places.map((place, index) => (
          <TouchableOpacity key={index} style={styles.placeCard}>
            <Text style={styles.placeIcon}>{place.icon}</Text>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeCount}>{place.count}</Text>
            <Text style={styles.placeDistance}>{place.distance}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// FilterView - HTML tasarımına göre implement edildi
function FilterView() {
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedInterests, setSelectedInterests] = useState([
    "spor",
    "müzik",
    "seyahat",
  ]);
  const [selectedStatus, setSelectedStatus] = useState(["online"]);

  const interests = [
    "Spor",
    "Müzik",
    "Sanat",
    "Teknoloji",
    "Seyahat",
    "Yemek",
    "Kitap",
    "Film",
  ];
  const genders = ["Tümü", "Erkek", "Kadın", "Diğer"];
  const statuses = ["Online", "Son 24 saat", "Son 1 hafta", "Tümü"];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest.toLowerCase())
        ? prev.filter((i) => i !== interest.toLowerCase())
        : [...prev, interest.toLowerCase()]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status.toLowerCase())
        ? prev.filter((s) => s !== status.toLowerCase())
        : [...prev, status.toLowerCase()]
    );
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Gelişmiş Filtreler</Text>
        <Text style={styles.pageSubtitle}>
          Arama kriterlerinizi detaylandırın
        </Text>
      </View>
      <View style={styles.filterAdvanced}>
        {/* Distance Range */}
        <View style={styles.filterCard}>
          <View style={styles.filterCardTitle}>
            <Text style={styles.filterCardTitleText}>Mesafe Aralığı</Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>1-5 km</Text>
            </View>
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>0 km</Text>
            <Text style={styles.sliderLabelText}>25 km</Text>
            <Text style={styles.sliderLabelText}>50 km</Text>
          </View>
        </View>

        {/* Age Range */}
        <View style={styles.filterCard}>
          <Text style={styles.filterCardTitleText}>Yaş Aralığı</Text>
          <View style={styles.ageInputs}>
            <TextInput
              style={styles.ageInput}
              value={minAge.toString()}
              onChangeText={(text) => setMinAge(parseInt(text) || 0)}
              keyboardType="numeric"
            />
            <Text>-</Text>
            <TextInput
              style={styles.ageInput}
              value={maxAge.toString()}
              onChangeText={(text) => setMaxAge(parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Gender */}
        <View style={styles.filterCard}>
          <Text style={styles.filterCardTitleText}>Cinsiyet</Text>
          <View style={styles.checkboxGroup}>
            {genders.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.checkboxItem,
                  selectedGender === gender.toLowerCase() &&
                    styles.checkboxItemActive,
                ]}
                onPress={() => setSelectedGender(gender.toLowerCase())}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedGender === gender.toLowerCase() &&
                      styles.checkboxActive,
                  ]}
                >
                  {selectedGender === gender.toLowerCase() && (
                    <Text style={styles.checkboxCheck}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.checkboxLabel,
                    selectedGender === gender.toLowerCase() &&
                      styles.checkboxLabelActive,
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.filterCard}>
          <Text style={styles.filterCardTitleText}>İlgi Alanları</Text>
          <View style={styles.checkboxGroup}>
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(
                interest.toLowerCase()
              );
              return (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.checkboxItem,
                    isSelected && styles.checkboxItemActive,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxActive,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      isSelected && styles.checkboxLabelActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Status */}
        <View style={styles.filterCard}>
          <Text style={styles.filterCardTitleText}>Durum</Text>
          <View style={styles.checkboxGroup}>
            {statuses.map((status) => {
              const isSelected = selectedStatus.includes(status.toLowerCase());
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.checkboxItem,
                    isSelected && styles.checkboxItemActive,
                  ]}
                  onPress={() => toggleStatus(status)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxActive,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      isSelected && styles.checkboxLabelActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// CategoriesView - HTML tasarımına göre implement edildi
function CategoriesView() {
  const [selectedCategories, setSelectedCategories] = useState([
    "Kafe",
    "Burger",
    "Bar",
  ]);

  const subcategories = [
    { icon: "☕", name: "Kafe" },
    { icon: "🍕", name: "Pizza" },
    { icon: "🍔", name: "Burger" },
    { icon: "🍣", name: "Sushi" },
    { icon: "🥗", name: "Salata" },
    { icon: "🍰", name: "Tatlı" },
    { icon: "🍺", name: "Bar" },
    { icon: "🍝", name: "İtalyan" },
    { icon: "🥘", name: "Türk" },
  ];

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <LinearGradient
        colors={[
          nativeTokens.palette.primary.main,
          nativeTokens.palette.primary.dark,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryHeader}
      >
        <Text style={styles.categoryIconLarge}>🍔</Text>
        <Text style={styles.categoryTitle}>Yeme & İçme</Text>
        <Text style={styles.categorySubtitle}>127 yakın konum</Text>
      </LinearGradient>
      <View style={styles.subcategoryGrid}>
        {subcategories.map((subcat) => {
          const isSelected = selectedCategories.includes(subcat.name);
          return (
            <TouchableOpacity
              key={subcat.name}
              style={[
                styles.subcategoryItem,
                isSelected && styles.subcategoryItemSelected,
              ]}
              onPress={() => toggleCategory(subcat.name)}
            >
              <Text style={styles.subcategoryIcon}>{subcat.icon}</Text>
              <Text
                style={[
                  styles.subcategoryName,
                  isSelected && styles.subcategoryNameSelected,
                ]}
              >
                {subcat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ProfileView - HTML tasarımına göre güncellendi
function ProfileView() {
  return (
    <ScrollView style={styles.contentContainer}>
      <LinearGradient
        colors={[
          nativeTokens.palette.primary.main,
          nativeTokens.palette.primary.dark,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHeader}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>👤</Text>
        </View>
        <Text style={styles.profileName}>Ahmet Yılmaz</Text>
        <Text style={styles.profileUsername}>@ahmetyilmaz</Text>
        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>256</Text>
            <Text style={styles.profileStatLabel}>Arkadaş</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>1.2K</Text>
            <Text style={styles.profileStatLabel}>Takipçi</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>89</Text>
            <Text style={styles.profileStatLabel}>Gönderi</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.profileInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📧</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>E-posta</Text>
            <Text style={styles.infoValue}>ahmet.yilmaz@email.com</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📱</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Telefon</Text>
            <Text style={styles.infoValue}>+90 532 xxx xx xx</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Konum</Text>
            <Text style={styles.infoValue}>İstanbul, Türkiye</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🎂</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Doğum Tarihi</Text>
            <Text style={styles.infoValue}>15 Mart 1995</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>💼</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Meslek</Text>
            <Text style={styles.infoValue}>Yazılım Geliştirici</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Profili Düzenle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// SearchView - HTML tasarımına göre implement edildi
function SearchView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tümü");

  const filters = [
    "Tümü",
    "Kişiler",
    "Yerler",
    "Etkinlikler",
    "Gruplar",
    "Online",
  ];

  const searchResults = [
    {
      type: "person",
      avatar: "AK",
      name: "Ayşe Kara",
      badge: "Online",
      details: "UI/UX Designer • İstanbul",
      distance: "250m",
    },
    {
      type: "place",
      avatar: "☕",
      name: "Starbucks Nişantaşı",
      details: "Kafe • 4.5 ⭐ • 127 kişi burada",
      distance: "450m",
    },
    {
      type: "event",
      avatar: "🎬",
      name: "Film Gecesi Etkinliği",
      details: "Bu Cumartesi • 19:00 • 45 katılımcı",
      distance: "1.2km",
    },
  ];

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Kişi, yer veya etkinlik ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          <Text style={styles.inputAction}>🎙️</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.searchFilters}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.searchResults}>
        {searchResults.map((result, index) => (
          <TouchableOpacity key={index} style={styles.resultItem}>
            <View style={styles.resultAvatar}>
              <Text style={styles.resultAvatarText}>{result.avatar}</Text>
            </View>
            <View style={styles.resultInfo}>
              <View style={styles.resultNameRow}>
                <Text style={styles.resultName}>{result.name}</Text>
                {result.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{result.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.resultDetails}>{result.details}</Text>
            </View>
            <Text style={styles.resultDistance}>{result.distance}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function ChatView() {
  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat</Text>
        <Text style={styles.sectionSubtitle}>Your conversations</Text>
      </View>
    </ScrollView>
  );
}

function GroupsView() {
  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Groups</Text>
        <Text style={styles.sectionSubtitle}>Active group chats</Text>
      </View>
    </ScrollView>
  );
}

// SocialView - HTML tasarımına göre implement edildi
function SocialView() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set([0]));

  const stories = [
    { id: 1, username: "Ayşe", avatar: "👩", viewed: false },
    { id: 2, username: "Mehmet", avatar: "👨", viewed: false },
    { id: 3, username: "Zeynep", avatar: "👧", viewed: true },
    { id: 4, username: "Can", avatar: "👱", viewed: false },
  ];

  const posts = [
    {
      id: 0,
      avatar: "AY",
      avatarVip: true,
      username: "Ayşe Yılmaz",
      isVip: true,
      location: "📍 Bebek, İstanbul",
      time: "2 saat önce",
      text: "Harika bir gün! ☀️ Sahilde kahve keyfi yapıyorum. Bu havada dışarıda olmak çok güzel.",
      hashtags: "#istanbul #bebek #kahve #güneş",
      image: true,
      likes: 42,
      comments: 8,
      shares: 2,
      liked: true,
    },
    {
      id: 1,
      avatar: "MK",
      username: "Mehmet Kaya",
      location: "📍 Levent, İstanbul • 500m uzakta",
      time: "5 saat önce",
      text: "Yeni proje tamamlandı! 🚀 Ekip harika iş çıkardı. Herkese teşekkürler!",
      hashtags: "#başarı #ekipçalışması #proje",
      likes: 128,
      comments: 24,
      shares: 5,
      liked: false,
    },
    {
      id: 2,
      avatar: "ZK",
      username: "Zeynep Korkmaz",
      location: "📍 Kadıköy, İstanbul • 2km uzakta",
      time: "1 gün önce",
      text: "Yeni kitap önerisi arıyorum! Son zamanlarda ne okudunuz? 📚",
      hashtags: "#kitap #okuma #öneri",
      likes: 56,
      comments: 32,
      shares: 0,
      liked: false,
    },
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Sosyal Akış</Text>
        <Text style={styles.pageSubtitle}>Arkadaşlarınızdan haberler</Text>
      </View>

      {/* Stories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesContainer}
      >
        <View style={styles.storyItem}>
          <View style={styles.storyAvatar}>
            <View style={styles.storyAvatarInner}>
              <Text style={styles.storyAvatarText}>👤</Text>
            </View>
          </View>
          <View style={styles.addStoryPlus}>
            <Text style={styles.addStoryPlusText}>+</Text>
          </View>
          <Text style={styles.storyUsername}>Hikaye Ekle</Text>
        </View>
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View
              style={[
                styles.storyAvatar,
                story.viewed && styles.storyAvatarViewed,
              ]}
            >
              <View style={styles.storyAvatarInner}>
                <Text style={styles.storyAvatarText}>{story.avatar}</Text>
              </View>
            </View>
            <Text style={styles.storyUsername}>{story.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts */}
      <View style={styles.socialFeed}>
        {posts.map((post) => {
          const isLiked = likedPosts.has(post.id);
          return (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <LinearGradient
                  colors={
                    post.avatarVip
                      ? ["#FFD700", "#FFA500"]
                      : [
                          nativeTokens.palette.primary.main,
                          nativeTokens.palette.primary.dark,
                        ]
                  }
                  style={styles.postAvatar}
                >
                  <Text style={styles.postAvatarText}>{post.avatar}</Text>
                </LinearGradient>
                <View style={styles.postUser}>
                  <View style={styles.postUsernameRow}>
                    <Text style={styles.postUsername}>{post.username}</Text>
                    {post.isVip && <Text style={styles.vipBadge}>👑</Text>}
                  </View>
                  <Text style={styles.postLocation}>{post.location}</Text>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
                <Text style={styles.postMenu}>⋮</Text>
              </View>
              <View style={styles.postContent}>
                <Text style={styles.postText}>
                  {post.text}
                  {"\n"}
                  <Text style={styles.postHashtags}>{post.hashtags}</Text>
                </Text>
              </View>
              {post.image && (
                <LinearGradient
                  colors={[
                    nativeTokens.palette.primary.main,
                    nativeTokens.palette.primary.dark,
                  ]}
                  style={styles.postImage}
                >
                  <Text style={styles.postImageEmoji}>☕ 🌊</Text>
                </LinearGradient>
              )}
              <View style={styles.postStats}>
                <Text style={styles.postStatsText}>❤️ {post.likes} beğeni</Text>
                <Text style={styles.postStatsText}>
                  {post.comments} yorum{" "}
                  {post.shares > 0 && `• ${post.shares} paylaşım`}
                </Text>
              </View>
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={[styles.postAction, isLiked && styles.postActionLiked]}
                  onPress={() => toggleLike(post.id)}
                >
                  <Text style={styles.postActionIcon}>
                    {isLiked ? "❤️" : "🤍"}
                  </Text>
                  <Text
                    style={[
                      styles.postActionText,
                      isLiked && styles.postActionTextLiked,
                    ]}
                  >
                    Beğen
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Text style={styles.postActionIcon}>💬</Text>
                  <Text style={styles.postActionText}>Yorum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Text style={styles.postActionIcon}>📤</Text>
                  <Text style={styles.postActionText}>Paylaş</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Floating Post Button */}
      <TouchableOpacity style={styles.floatingPostBtn}>
        <Text style={styles.floatingPostBtnText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// VipView - HTML tasarımına göre implement edildi
function VipView() {
  return (
    <ScrollView style={styles.contentContainer}>
      <LinearGradient
        colors={["#FFD700", "#FFA500"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.vipHeader}
      >
        <Text style={styles.vipIconLarge}>👑</Text>
        <Text style={styles.vipTitle}>VIP Üyelik</Text>
        <Text style={styles.vipSubtitle}>Premium deneyimin tadını çıkarın</Text>
      </LinearGradient>

      <View style={styles.vipContent}>
        <View style={styles.vipCard}>
          <Text style={styles.vipCardTitle}>✨ Sınırsız Özellikler</Text>
          <View style={styles.vipFeatureList}>
            <Text style={styles.vipFeatureItem}>✅ Sınırsız mesajlaşma</Text>
            <Text style={styles.vipFeatureItem}>✅ Gelişmiş filtreleme</Text>
            <Text style={styles.vipFeatureItem}>✅ Görünmez mod</Text>
            <Text style={styles.vipFeatureItem}>✅ Reklamsız deneyim</Text>
            <Text style={styles.vipFeatureItem}>✅ Öncelikli destek</Text>
            <Text style={styles.vipFeatureItem}>✅ Özel rozetler</Text>
          </View>
        </View>

        <View style={styles.vipCard}>
          <Text style={styles.vipCardTitle}>📊 İstatistikler</Text>
          <View style={styles.vipFeatureList}>
            <Text style={styles.vipFeatureItem}>
              📈 Profil görüntülenme istatistikleri
            </Text>
            <Text style={styles.vipFeatureItem}>
              👁️ Profilini kimler görüntüledi
            </Text>
            <Text style={styles.vipFeatureItem}>❤️ Beğeni analitiği</Text>
            <Text style={styles.vipFeatureItem}>📍 Konum geçmişi</Text>
          </View>
        </View>

        <View style={styles.vipPricing}>
          <Text style={styles.vipPrice}>
            ₺49.99<Text style={styles.vipPricePeriod}>/ay</Text>
          </Text>
          <TouchableOpacity style={styles.vipButton}>
            <Text style={styles.vipButtonText}>Hemen Başla</Text>
          </TouchableOpacity>
          <Text style={styles.vipTrial}>
            7 gün ücretsiz deneme • İstediğiniz zaman iptal edin
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// AccountView - HTML tasarımına göre implement edildi
function AccountView() {
  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Hesap Ayarları</Text>
        <Text style={styles.pageSubtitle}>Hesap bilgilerinizi yönetin</Text>
      </View>

      <View style={styles.accountSection}>
        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>👤</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Kullanıcı Adı</Text>
            <Text style={styles.accountValue}>@ahmetyilmaz</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>📧</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>E-posta</Text>
            <Text style={styles.accountValue}>ahmet.yilmaz@email.com</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>📱</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Telefon Numarası</Text>
            <Text style={styles.accountValue}>+90 532 xxx xx xx</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🔑</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Şifre</Text>
            <Text style={styles.accountValue}>Son güncelleme: 3 ay önce</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🔒</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>İki Faktörlü Doğrulama</Text>
            <Text style={styles.accountValue}>Aktif</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🔗</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Bağlı Hesaplar</Text>
            <Text style={styles.accountValue}>Google, Facebook</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Hesabı Dondur</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Hesabı Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// PrivacyView - HTML tasarımına göre implement edildi
function PrivacyView() {
  const [profileVisibility] = useState("Herkes");
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(false);
  const [messagePermission] = useState("Herkes");
  const [blockGroupInvites, setBlockGroupInvites] = useState(true);

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Gizlilik Ayarları</Text>
        <Text style={styles.pageSubtitle}>Verilerinizi kontrol edin</Text>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Profil Görünürlüğü</Text>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Profilimi kimler görebilir</Text>
            <Text style={styles.privacyDesc}>
              Profil bilgilerinize erişimi kontrol edin
            </Text>
          </View>
          <View style={styles.privacyControl}>
            <Text style={styles.dropdownSelect}>{profileVisibility}</Text>
          </View>
        </View>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Online durumu göster</Text>
            <Text style={styles.privacyDesc}>
              Aktif olduğunuzda diğerleri görebilir
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              showOnlineStatus && styles.toggleSwitchActive,
            ]}
            onPress={() => setShowOnlineStatus(!showOnlineStatus)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                showOnlineStatus && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Son görülme</Text>
            <Text style={styles.privacyDesc}>
              Son aktif olma zamanınızı göster
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              showLastSeen && styles.toggleSwitchActive,
            ]}
            onPress={() => setShowLastSeen(!showLastSeen)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                showLastSeen && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Konum</Text>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Konumumu paylaş</Text>
            <Text style={styles.privacyDesc}>
              Yakınlarınızda kimler olduğunu görün
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              shareLocation && styles.toggleSwitchActive,
            ]}
            onPress={() => setShareLocation(!shareLocation)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                shareLocation && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Hassas konum</Text>
            <Text style={styles.privacyDesc}>Tam konumunuzu paylaşın</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              preciseLocation && styles.toggleSwitchActive,
            ]}
            onPress={() => setPreciseLocation(!preciseLocation)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                preciseLocation && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>İletişim</Text>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Kimler mesaj gönderebilir</Text>
            <Text style={styles.privacyDesc}>
              Mesajlaşma izinlerini yönetin
            </Text>
          </View>
          <View style={styles.privacyControl}>
            <Text style={styles.dropdownSelect}>{messagePermission}</Text>
          </View>
        </View>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Grup davetleri</Text>
            <Text style={styles.privacyDesc}>
              Gruplara otomatik eklenmeni engelle
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              blockGroupInvites && styles.toggleSwitchActive,
            ]}
            onPress={() => setBlockGroupInvites(!blockGroupInvites)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                blockGroupInvites && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// NotificationsSettingsView - HTML tasarımına göre implement edildi
function NotificationsSettingsView() {
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [messagesSound, setMessagesSound] = useState(true);
  const [messagesVibration, setMessagesVibration] = useState(true);
  const [messagesPreview, setMessagesPreview] = useState(false);
  const [socialEnabled, setSocialEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [updatesEnabled, setUpdatesEnabled] = useState(true);

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Bildirim Tercihleri</Text>
        <Text style={styles.pageSubtitle}>Bildirimlerinizi özelleştirin</Text>
      </View>

      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconLarge}>
            <Text style={styles.notificationIconText}>💬</Text>
          </View>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Mesajlar</Text>
            <Text style={styles.notificationSubtitle}>
              Yeni mesaj bildirimleri
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              messagesEnabled && styles.toggleSwitchActive,
            ]}
            onPress={() => setMessagesEnabled(!messagesEnabled)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                messagesEnabled && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
        {messagesEnabled && (
          <View style={styles.notificationOptions}>
            <View style={styles.notificationOption}>
              <Text style={styles.notificationOptionLabel}>Ses</Text>
              <TouchableOpacity
                style={[
                  styles.toggleSwitch,
                  messagesSound && styles.toggleSwitchActive,
                ]}
                onPress={() => setMessagesSound(!messagesSound)}
              >
                <View
                  style={[
                    styles.toggleSwitchThumb,
                    messagesSound && styles.toggleSwitchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.notificationOption}>
              <Text style={styles.notificationOptionLabel}>Titreşim</Text>
              <TouchableOpacity
                style={[
                  styles.toggleSwitch,
                  messagesVibration && styles.toggleSwitchActive,
                ]}
                onPress={() => setMessagesVibration(!messagesVibration)}
              >
                <View
                  style={[
                    styles.toggleSwitchThumb,
                    messagesVibration && styles.toggleSwitchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.notificationOption}>
              <Text style={styles.notificationOptionLabel}>
                Önizlemeyi göster
              </Text>
              <TouchableOpacity
                style={[
                  styles.toggleSwitch,
                  messagesPreview && styles.toggleSwitchActive,
                ]}
                onPress={() => setMessagesPreview(!messagesPreview)}
              >
                <View
                  style={[
                    styles.toggleSwitchThumb,
                    messagesPreview && styles.toggleSwitchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconLarge}>
            <Text style={styles.notificationIconText}>👥</Text>
          </View>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Sosyal</Text>
            <Text style={styles.notificationSubtitle}>
              Arkadaşlık istekleri ve takipler
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              socialEnabled && styles.toggleSwitchActive,
            ]}
            onPress={() => setSocialEnabled(!socialEnabled)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                socialEnabled && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconLarge}>
            <Text style={styles.notificationIconText}>📍</Text>
          </View>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Konum</Text>
            <Text style={styles.notificationSubtitle}>
              Yakınınızda olan etkinlikler
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              locationEnabled && styles.toggleSwitchActive,
            ]}
            onPress={() => setLocationEnabled(!locationEnabled)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                locationEnabled && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconLarge}>
            <Text style={styles.notificationIconText}>⚡</Text>
          </View>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Güncellemeler</Text>
            <Text style={styles.notificationSubtitle}>
              Yeni özellikler ve güncellemeler
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              updatesEnabled && styles.toggleSwitchActive,
            ]}
            onPress={() => setUpdatesEnabled(!updatesEnabled)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                updatesEnabled && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// AppearanceView - HTML tasarımına göre implement edildi
function AppearanceView() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoTheme, setAutoTheme] = useState(true);
  const [fontSize] = useState("Normal");
  const [appLanguage] = useState("Türkçe");
  const [region] = useState("Türkiye");

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Görünüm</Text>
        <Text style={styles.pageSubtitle}>
          Uygulamanın görünümünü özelleştirin
        </Text>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Tema</Text>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Karanlık Mod</Text>
            <Text style={styles.privacyDesc}>Göz yorgunluğunu azaltır</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleSwitch, darkMode && styles.toggleSwitchActive]}
            onPress={() => setDarkMode(!darkMode)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                darkMode && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Otomatik Tema</Text>
            <Text style={styles.privacyDesc}>Sistem temasını takip et</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              autoTheme && styles.toggleSwitchActive,
            ]}
            onPress={() => setAutoTheme(!autoTheme)}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                autoTheme && styles.toggleSwitchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Yazı Tipi</Text>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Yazı Boyutu</Text>
            <Text style={styles.privacyDesc}>Metin boyutunu ayarlayın</Text>
          </View>
          <View style={styles.privacyControl}>
            <Text style={styles.dropdownSelect}>{fontSize}</Text>
          </View>
        </View>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Dil ve Bölge</Text>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Uygulama Dili</Text>
            <Text style={styles.privacyDesc}>Arayüz dilini seçin</Text>
          </View>
          <View style={styles.privacyControl}>
            <Text style={styles.dropdownSelect}>{appLanguage}</Text>
          </View>
        </View>
        <View style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Bölge</Text>
            <Text style={styles.privacyDesc}>Yerel içerik ve para birimi</Text>
          </View>
          <View style={styles.privacyControl}>
            <Text style={styles.dropdownSelect}>{region}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// HelpView - HTML tasarımına göre implement edildi
function HelpView() {
  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Yardım & Destek</Text>
        <Text style={styles.pageSubtitle}>Size nasıl yardımcı olabiliriz?</Text>
      </View>

      <View style={styles.accountSection}>
        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>📚</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Kullanım Kılavuzu</Text>
            <Text style={styles.accountValue}>
              Uygulamayı nasıl kullanacağınızı öğrenin
            </Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>❓</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Sık Sorulan Sorular</Text>
            <Text style={styles.accountValue}>
              En çok sorulan sorular ve cevapları
            </Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>💬</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Canlı Destek</Text>
            <Text style={styles.accountValue}>Destek ekibimizle konuşun</Text>
          </View>
          <View style={[styles.badge, styles.badgeSuccess]}>
            <Text style={styles.badgeText}>Online</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>📧</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>E-posta Desteği</Text>
            <Text style={styles.accountValue}>destek@uygulama.com</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🐛</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Hata Bildir</Text>
            <Text style={styles.accountValue}>
              Karşılaştığınız sorunları bildirin
            </Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>💡</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Öneri Gönder</Text>
            <Text style={styles.accountValue}>
              Fikirlerinizi bizimle paylaşın
            </Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Yasal</Text>
        <TouchableOpacity style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Kullanım Şartları</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Gizlilik Politikası</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.privacyOption}>
          <View style={styles.privacyLabel}>
            <Text style={styles.privacyName}>Çerez Politikası</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// SettingsView - HTML tasarımına göre implement edildi
function SettingsView({
  onPageSelect,
}: {
  onPageSelect: (page: PageId) => void;
}) {
  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Ayarlar</Text>
        <Text style={styles.pageSubtitle}>Uygulama tercihleri</Text>
      </View>

      <View style={styles.accountSection}>
        <TouchableOpacity
          style={styles.accountItem}
          onPress={() => onPageSelect("account")}
        >
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>👤</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Hesap</Text>
            <Text style={styles.accountValue}>Profil, güvenlik, şifre</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountItem}
          onPress={() => onPageSelect("privacy")}
        >
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🔐</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Gizlilik</Text>
            <Text style={styles.accountValue}>Görünürlük, konum, veri</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountItem}
          onPress={() => onPageSelect("notifications-settings")}
        >
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🔔</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Bildirimler</Text>
            <Text style={styles.accountValue}>
              Mesaj, sosyal, güncellemeler
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountItem}
          onPress={() => onPageSelect("appearance")}
        >
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>🎨</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Görünüm</Text>
            <Text style={styles.accountValue}>Tema, yazı tipi, dil</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountItem}
          onPress={() => onPageSelect("help")}
        >
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>❓</Text>
          </View>
          <View style={styles.accountContent}>
            <Text style={styles.accountLabel}>Yardım & Destek</Text>
            <Text style={styles.accountValue}>SSS, destek, yasal</Text>
          </View>
          <Text style={styles.accountArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingsFooter}>
          <Text style={styles.settingsVersion}>Versiyon 2.0.0</Text>
          <Text style={styles.settingsCopyright}>© 2024 Sosyal Konum App</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function MainScreen() {
  const [currentPage, setCurrentPage] = useState<PageId>("map");

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <RNStatusBar barStyle="dark-content" />
      <StatusBar />
      <SwipeableNavigation
        currentPage={currentPage}
        onPageSelect={setCurrentPage}
      />
      <Content page={currentPage} onPageSelect={setCurrentPage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nativeTokens.palette.background.light,
  },
  statusBar: {
    height: 44,
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statusBarTime: {
    fontSize: 14,
    fontWeight: "600",
    color: nativeTokens.palette.text.primary,
  },
  statusBarIcons: {
    flexDirection: "row",
  },
  statusBarIcon: {
    fontSize: 14,
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: nativeTokens.palette.background.light,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  // Map Elements
  streetHorizontal: {
    position: "absolute",
    width: "100%",
    height: 25,
    top: "50%",
    transform: [{ translateY: -12.5 }],
  },
  streetVertical: {
    position: "absolute",
    width: 25,
    height: "100%",
    left: "40%",
  },
  buildingBlock: {
    position: "absolute",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  block1: { top: 20, left: 20, width: 120, height: 180 },
  block2: { top: 20, right: 20, width: 140, height: 160 },
  block3: { bottom: 120, left: 20, width: 100, height: 120 },
  block4: { bottom: 120, right: 20, width: 130, height: 140 },
  park: {
    position: "absolute",
    borderRadius: 999,
    shadowColor: "#00b894",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  park1: { top: 220, left: 30, width: 80, height: 80 },
  park2: { top: 320, right: 40, width: 100, height: 100 },
  water: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 50,
  },
  marker: {
    position: "absolute",
    width: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  markerBg: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  markerContent: {
    fontSize: 24,
    zIndex: 1,
  },
  markerBank: { top: 80, left: 50 },
  markerMoney: { top: 80, right: 80 },
  markerHospital: { top: 200, right: 180 },
  markerFood: { bottom: 200, left: 80 },
  markerGas: { bottom: 200, right: 60 },
  userMarker: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  userMarkerOnline: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  userMarker1: { top: "45%", left: "60%" },
  userMarker2: { top: "35%", left: "30%" },
  userMarker3: { top: "60%", left: "70%" },
  userMarker4: { top: "70%", left: "45%" },
  userMarkerEmoji: {
    fontSize: 16,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  locationIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 70,
    height: 70,
    transform: [{ translateX: -35 }, { translateY: -35 }],
  },
  locationOuter: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#4285F4",
    backgroundColor: "rgba(66, 133, 244, 0.15)",
  },
  locationInner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#fff",
    transform: [{ translateX: -8 }, { translateY: -8 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  compass: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  compassIcon: {
    fontSize: 24,
  },
  rangeNotification: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  rangeNotificationIcon: {
    fontSize: 24,
  },
  rangeCount: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ff4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  rangeCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  mapControls: {
    position: "absolute",
    bottom: 20,
    right: 15,
    gap: 10,
  },
  mapControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  mapControlBtnText: {
    fontSize: 18,
  },
  // Places View Styles
  pageHeader: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  placesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
  },
  placeCard: {
    width: (SCREEN_WIDTH - 45) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginRight: 15,
    marginBottom: 15,
  },
  placeIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  placeCount: {
    fontSize: 12,
    color: "#666",
  },
  placeDistance: {
    fontSize: 11,
    color: "#667eea",
    fontWeight: "600",
    marginTop: 5,
  },
  // Filter View Styles
  filterAdvanced: {
    padding: 15,
  },
  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  filterCardTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  filterCardTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  filterBadge: {
    backgroundColor: "#667eea",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterBadgeText: {
    fontSize: 11,
    color: "#fff",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  sliderLabelText: {
    fontSize: 12,
    color: "#666",
  },
  ageInputs: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ageInput: {
    flex: 1,
    padding: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 5,
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  checkboxItem: {
    flex: 1,
    minWidth: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  checkboxItemActive: {
    backgroundColor: "#667eea",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  checkboxCheck: {
    color: "#667eea",
    fontWeight: "700",
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  checkboxLabelActive: {
    color: "#fff",
  },
  // Categories View Styles
  categoryHeader: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  categoryIconLarge: {
    fontSize: 48,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  subcategoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
  },
  subcategoryItem: {
    width: (SCREEN_WIDTH - 54) / 3,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginRight: 12,
    marginBottom: 12,
  },
  subcategoryItemSelected: {
    backgroundColor: "#667eea",
  },
  subcategoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  subcategoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  subcategoryNameSelected: {
    color: "#fff",
  },
  section: {
    backgroundColor: nativeTokens.palette.surface.white,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: nativeTokens.palette.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: nativeTokens.palette.text.secondary,
  },
  profileHeader: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  profileAvatarText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 10,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  profileStat: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  profileStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  profileStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    marginTop: 2,
  },
  profileInfo: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoIcon: {
    width: 40,
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    margin: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // Search View Styles
  searchHeader: {
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 20,
    color: "#666",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  inputAction: {
    fontSize: 22,
    color: "#999",
  },
  searchFilters: {
    padding: 15,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#667eea",
    borderColor: "transparent",
  },
  filterChipText: {
    fontSize: 13,
    color: "#333",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  searchResults: {
    padding: 15,
  },
  resultItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  resultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  resultAvatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  resultInfo: {
    flex: 1,
  },
  resultNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  resultName: {
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },
  resultDetails: {
    fontSize: 12,
    color: "#666",
  },
  resultDistance: {
    fontSize: 13,
    color: "#667eea",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#667eea",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  // Social View Styles
  storiesContainer: {
    padding: 15,
    paddingBottom: 10,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 12,
    width: 65,
  },
  storyAvatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    padding: 3,
    backgroundColor: "#667eea",
    marginBottom: 5,
  },
  storyAvatarViewed: {
    backgroundColor: "#ddd",
  },
  storyAvatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  storyAvatarText: {
    fontSize: 24,
  },
  addStoryPlus: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  addStoryPlusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  storyUsername: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  socialFeed: {
    padding: 15,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  postHeader: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  postAvatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  postUser: {
    flex: 1,
  },
  postUsernameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  postUsername: {
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },
  vipBadge: {
    fontSize: 12,
    marginLeft: 5,
  },
  postLocation: {
    fontSize: 12,
    color: "#667eea",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: "#999",
  },
  postMenu: {
    fontSize: 20,
    color: "#999",
  },
  postContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  postText: {
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
    fontSize: 14,
  },
  postHashtags: {
    color: "#667eea",
    fontSize: 14,
  },
  postImage: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  postImageEmoji: {
    fontSize: 48,
    color: "#fff",
  },
  postStats: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postStatsText: {
    fontSize: 13,
    color: "#666",
  },
  postActions: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  postAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  postActionLiked: {
    backgroundColor: "transparent",
  },
  postActionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  postActionText: {
    fontSize: 14,
    color: "#666",
  },
  postActionTextLiked: {
    color: "#ff4444",
  },
  floatingPostBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  floatingPostBtnText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  // VIP View Styles
  vipHeader: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  vipIconLarge: {
    fontSize: 48,
    marginBottom: 15,
  },
  vipTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  vipSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  vipContent: {
    padding: 15,
  },
  vipCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  vipCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  vipFeatureList: {},
  vipFeatureItem: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 4,
    marginBottom: 4,
  },
  vipPricing: {
    alignItems: "center",
    padding: 20,
  },
  vipPrice: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 10,
  },
  vipPricePeriod: {
    fontSize: 16,
    color: "#666",
  },
  vipButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  vipButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  vipTrial: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  // Settings View Styles
  accountSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  accountItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  accountIconText: {
    fontSize: 18,
  },
  accountContent: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  accountValue: {
    fontSize: 12,
    color: "#666",
  },
  accountArrow: {
    color: "#999",
    fontSize: 14,
  },
  settingsFooter: {
    alignItems: "center",
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  settingsVersion: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  settingsCopyright: {
    fontSize: 12,
    color: "#666",
  },
  // Privacy View Styles
  privacySection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  privacyOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  privacyLabel: {
    flex: 1,
  },
  privacyName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  privacyDesc: {
    fontSize: 12,
    color: "#666",
  },
  privacyControl: {
    alignItems: "center",
  },
  dropdownSelect: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 13,
    backgroundColor: "#fff",
    color: "#333",
    minWidth: 100,
    textAlign: "center",
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 3,
    position: "relative",
  },
  toggleSwitchActive: {
    backgroundColor: "#667eea",
  },
  toggleSwitchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    position: "absolute",
    left: 3,
  },
  toggleSwitchThumbActive: {
    left: 23,
  },
  // Notification Settings Styles
  notificationCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  notificationIconLarge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 20,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notificationSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  notificationOptions: {
    marginTop: 15,
  },
  notificationOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  notificationOptionLabel: {
    fontSize: 14,
    color: "#333",
  },
  // Danger Zone Styles
  dangerZone: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#f0f0f0",
  },
  dangerButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#ff4444",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  badgeSuccess: {
    backgroundColor: "#4CAF50",
  },
});
