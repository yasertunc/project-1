import React, { useEffect, useMemo, useRef, useState } from "react";
import GoogleMap from "./Map/GoogleMap";
import { getNavigationStyle, getContentStyle } from "./AppPhoneMock.styles";

// NOTE: Removed the missing import "../styles/tokens.css" and inlined the essential
// token variables and utility classes so this runs in a sandbox without external files.
// Updated to match v2.0.0 specification tokens.
const TOKEN_CSS = `
  :root {
    --color-text: #333333;
    --color-text-2: #666666;
    --color-text-3: #999999;
    --color-text-primary: #333333;
    --color-text-secondary: #666666;
    --color-text-tertiary: #999999;
    --color-text-disabled: #cccccc;
    --color-bg-light: #f5f7fa;
    --color-bg-medium: #e3e9f3;
    --color-bg-dark: #1a1a1a;
    --color-background-light: #f5f7fa;
    --color-background-medium: #e3e9f3;
    --color-background-dark: #1a1a1a;
    --color-surface: #ffffff;
    --color-surface-white: #ffffff;
    --color-surface-gray: #f8f9fa;
    --color-primary-main: #667eea;
    --color-primary-dark: #764ba2;
    --color-primary-light: #8b9ef8;
    --color-vip-main: #ffd700;
    --color-vip-dark: #ffa500;
    --color-vip-light: #ffe44d;
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-vip: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    --shadow-colored: 0 4px 12px rgba(102, 126, 234, 0.4);
    --shadow-colored-vip: 0 4px 12px rgba(255, 193, 7, 0.4);
    --shadow-colored-success: 0 4px 12px rgba(38, 222, 129, 0.4);
  }

  * { box-sizing: border-box; }

  .bg-gradient-primary { background-image: var(--gradient-primary); }
  .bg-gradient-vip { background-image: var(--gradient-vip); }
  .rounded-phone { border-radius: 40px; }
  .rounded-screen { border-radius: 30px; }

  .vip-button {
    background-image: var(--gradient-vip);
    border-radius: 0;
    isolation: isolate;
    overflow: hidden;
    position: relative;
  }
  .vip-button::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: vip-shine 3s infinite;
    opacity: 0.9;
    pointer-events: none;
  }

  .ai-floating {
    position: absolute;
    isolation: isolate;
  }
  .ai-floating::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 999px;
    background: radial-gradient(
      rgba(102, 126, 234, 0.35),
      rgba(102, 126, 234, 0)
    );
    animation: ai-pulse 2s ease-in-out infinite;
    pointer-events: none;
    opacity: 0.7;
    transform: scale(0.9);
  }
  .ai-floating:hover::after,
  .ai-floating:active::after {
    animation-play-state: paused;
    opacity: 0.4;
  }

  @keyframes vip-shine {
    0%   { transform: translateX(-100%); }
    50%  { transform: translateX(150%); }
    100% { transform: translateX(200%); }
  }

  @keyframes ai-pulse {
    0%   { transform: scale(0.9); opacity: 0.6; }
    60%  { transform: scale(1.4); opacity: 0; }
    100% { transform: scale(0.9); opacity: 0; }
  }

  @keyframes slideIn {
    from { transform: translateY(4px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }
`;

function TokenStyles() {
  return <style dangerouslySetInnerHTML={{ __html: TOKEN_CSS }} />;
}

export type PageId =
  | "map"
  | "places"
  | "filter"
  | "categories"
  | "profile"
  | "chat"
  | "groups"
  | "social"
  | "notifications"
  | "vip"
  | "settings";

export type AppPhoneMockProps = {
  /**
   * Page that should be displayed on initial render.
   * Defaults to the map section to mirror the product brief.
   */
  initialPage?: PageId;
  /**
   * Allows stories to declutter the mock when explaining copy or IA.
   */
  showAIAssistant?: boolean;
  /**
   * Allows stories to show “above the fold” layout without the input chrome.
   */
  showMessageInput?: boolean;
};

const NAV_WIDTH = 375;
const MAX_NAV_POSITION = NAV_WIDTH; // Maximum scroll position (section 1)
const chatPages: PageId[] = [
  "profile",
  "chat",
  "groups",
  "social",
  "vip",
  "settings",
];
const mapPages: PageId[] = [
  "map",
  "places",
  "filter",
  "categories",
  "vip",
  "settings",
];

const navMenus: Array<[PageId, string][]> = [
  [
    ["map", "HARİTA"],
    ["places", "YERLER"],
    ["filter", "FİLTRE"],
    ["categories", "KATEGORİ"],
  ],
  [
    ["profile", "PROFİL"],
    ["chat", "SOHBET"],
    ["groups", "GRUPLAR"],
    ["social", "SOSYAL"],
  ],
];

const NAV_LOOP_WIDTH = NAV_WIDTH * navMenus.length;

// Small helpers so we can unit test important derived values.
function navTransform(position: number) {
  // navPosition 0 => ilk sekme, navPosition 375 => ikinci sekme.
  // İçerik sola doğru kayacağı için transform negatif yönde olmalı.
  return `translateX(-${position}px)`;
}

function clampNavPosition(position: number): number {
  return Math.max(0, Math.min(MAX_NAV_POSITION, position));
}

function normalizeNavPosition(position: number): number {
  const total = NAV_LOOP_WIDTH;
  if (total <= 0) return 0;
  const mod = ((position % total) + total) % total;
  // Görsel olarak ortadaki kopyayı kullanmak için bir tam döngü kaydırıyoruz.
  return total + mod;
}

function sectionForPage(page: PageId) {
  return chatPages.includes(page) ? 1 : 0;
}

function StatusBar() {
  const [currentTime, setCurrentTime] = React.useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-[44px] items-center justify-between border-b border-[rgba(0,0,0,0.05)] bg-gradient-to-b from-[#f8f9fa] to-[#ffffff] px-5 text-[14px] text-[var(--color-text)]">
      <span className="font-semibold">{currentTime}</span>
      <span className="flex gap-1">📶 📡 🔋</span>
    </div>
  );
}

type NavigationProps = {
  transform: string;
  page: PageId;
  onSelect: (id: PageId) => void;
};

const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  function Navigation({ transform, page, onSelect }, ref) {
    const repeatedMenus = React.useMemo(
      () => [...navMenus, ...navMenus, ...navMenus],
      []
    );

    return (
      <div className="relative h-[60px] overflow-hidden bg-gradient-primary shadow-[0_4px_15px_rgba(102,126,234,0.3)]">
        <div
          ref={ref}
          className="flex h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={getNavigationStyle(transform)}
          data-testid="navigation-container"
        >
          {repeatedMenus.map((menu, index) => (
            <div
              key={`${index}`}
              className="flex w-[375px] min-w-[375px] justify-between"
            >
              {menu.map(([id, label]) => (
                <NavButton
                  key={`${index}-${id}`}
                  id={id}
                  label={label}
                  active={page === id}
                  onSelect={onSelect}
                />
              ))}
              <VipButton onSelect={onSelect} />
              <SettingsButton onSelect={onSelect} />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

function NavButton({
  id,
  label,
  active,
  onSelect,
}: {
  id: PageId;
  label: string;
  active: boolean;
  onSelect: (id: PageId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-label={label}
      title={label}
      className={`px-[12px] py-[15px] text-[13px] font-semibold uppercase tracking-[0.06em] transition ${
        active
          ? "border-b-2 border-white bg-white/20 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function VipButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect("vip")}
      className="vip-button bg-gradient-vip px-[8px] py-[15px] text-[13px] font-bold uppercase tracking-[0.06em] text-white"
    >
      <span className="relative z-[1]">VIP</span>
    </button>
  );
}

function SettingsButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect("settings")}
      className="w-[45px] py-[15px] text-[22px] font-bold text-white"
      title="⚙"
    >
      ⚙
    </button>
  );
}

// Shared state for map filters and categories
type MapFilterState = {
  selectedCategories: Set<string>;
  distanceFilter: number; // in kilometers
};

// Group chat state
type GroupChat = {
  id: string;
  name: string;
  memberIds: string[];
  categoryIds: string[];
  createdAt: number;
  lastMessage?: {
    author: string;
    text: string;
    timestamp: number;
  };
};

const DEFAULT_GROUP_CHATS: GroupChat[] = [
  {
    id: "group-project-team",
    name: "Project Team",
    memberIds: ["user-1", "user-2", "user-6"],
    categoryIds: ["projects-default"],
    createdAt: Date.now(),
    lastMessage: {
      author: "System",
      text: "Kickoff tomorrow at 10:00",
      timestamp: Date.now(),
    },
  },
];

function Content({
  page,
  mapFilters,
  onMapFiltersChange,
  groupChats,
  setGroupChats,
  activeGroupUsers,
}: {
  page: PageId;
  mapFilters: MapFilterState;
  onMapFiltersChange: (filters: MapFilterState) => void;
  groupChats: GroupChat[];
  setGroupChats: React.Dispatch<React.SetStateAction<GroupChat[]>>;
  activeGroupUsers: Array<{
    id: string;
    displayName: string;
    avatar: string;
    isVip: boolean;
  }>;
}) {
  // Get filtered users for group creation
  const filteredUsersForGroup = React.useMemo(() => {
    if (mapFilters.selectedCategories.size === 0) {
      return [];
    }
    const allUsers = getUsersFromSelectedCategories(
      mapFilters.selectedCategories
    );
    // Filter by distance if needed
    const center = { lat: 41.0082, lng: 28.9784 }; // Default center
    return allUsers.filter((user) => {
      if (mapFilters.distanceFilter > 0) {
        const distanceInMeters = calculateDistance(
          center.lat,
          center.lng,
          user.position.lat,
          user.position.lng
        );
        const distanceInKm = distanceInMeters / 1000;
        return distanceInKm <= mapFilters.distanceFilter;
      }
      return true;
    });
  }, [mapFilters]);

  // Auto-create or update group chat when filtered users change
  React.useEffect(() => {
    if (filteredUsersForGroup.length >= 2) {
      // Create a group ID based on selected categories
      const categoryIds = Array.from(mapFilters.selectedCategories).sort();
      const groupId = `group-${categoryIds.join("-")}`;
      const memberIds = filteredUsersForGroup.map((u) => u.id);

      setGroupChats((prev) => {
        // Check if group already exists
        const existingGroup = prev.find((g) => g.id === groupId);

        if (!existingGroup) {
          // Create new group
          const categoryNames = categoryIds.map((id) => {
            // Extract readable name from category ID
            const parts = id.split("-");
            return parts[parts.length - 1];
          });
          const groupName =
            categoryNames.length > 0
              ? `${categoryNames.join(", ")} Grubu`
              : "Yeni Grup";

          const newGroup: GroupChat = {
            id: groupId,
            name: groupName,
            memberIds,
            categoryIds,
            createdAt: Date.now(),
          };

          return [...prev, newGroup];
        } else {
          // Update existing group with new members if changed
          const memberIdsChanged =
            JSON.stringify(existingGroup.memberIds.sort()) !==
            JSON.stringify(memberIds.sort());
          const categoryIdsChanged =
            JSON.stringify(existingGroup.categoryIds.sort()) !==
            JSON.stringify(categoryIds.sort());

          if (memberIdsChanged || categoryIdsChanged) {
            return prev.map((g) =>
              g.id === groupId ? { ...g, memberIds, categoryIds } : g
            );
          }
          return prev;
        }
      });
    } else {
      // Remove groups if no users match
      setGroupChats((prev) =>
        prev.filter((g) => {
          const hasMatchingCategories = g.categoryIds.some((catId) =>
            mapFilters.selectedCategories.has(catId)
          );
          return !hasMatchingCategories;
        })
      );
    }
  }, [filteredUsersForGroup, mapFilters.selectedCategories, setGroupChats]);
  return (
    <div className="relative" style={getContentStyle()}>
      <div
        className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-[var(--color-bg-light)] to-[var(--color-bg-medium)] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {page === "map" && (
          <MapView
            mapFilters={mapFilters}
            onMarkerClick={(marker) => {
              // Open Google Maps app with the location
              const { lat, lng } = marker.position;
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              window.open(googleMapsUrl, "_blank", "noopener");
            }}
          />
        )}
        {page === "places" && (
          <PlacesView
            mapFilters={mapFilters}
            onMapFiltersChange={onMapFiltersChange}
          />
        )}
        {page === "filter" && (
          <FilterView
            mapFilters={mapFilters}
            onMapFiltersChange={onMapFiltersChange}
          />
        )}
        {page === "categories" && (
          <CategoriesView
            mapFilters={mapFilters}
            onMapFiltersChange={onMapFiltersChange}
          />
        )}
        {page === "profile" && <ProfileView />}
        {page === "chat" && <ChatView activeGroupUsers={activeGroupUsers} />}
        {page === "groups" && (
          <GroupsView
            groupChats={groupChats}
            filteredUsers={filteredUsersForGroup}
          />
        )}
        {page === "social" && <SocialFeed />}
        {page === "notifications" && (
          <Section>
            {[
              [
                "💬",
                "Ahmet sent you a message",
                "5 minutes ago",
                "#667eea",
                "rgba(102,126,234,.1)",
              ],
              [
                "❤️",
                "Zeynep liked your post",
                "1 hour ago",
                "#ff4444",
                "rgba(255,68,68,.1)",
              ],
              [
                "➕",
                "Can started following you",
                "2 hours ago",
                "#4CAF50",
                "rgba(76,175,80,.1)",
              ],
              [
                "💬",
                "New message in Project Team",
                "3 hours ago",
                "#667eea",
                "rgba(102,126,234,.1)",
              ],
            ].map(([icon, title, time, color, background]) => (
              <NotificationRow
                key={title}
                icon={icon}
                title={title}
                time={time}
                iconColor={color}
                background={background}
              />
            ))}
          </Section>
        )}
        {page === "vip" && <VipSection />}
        {page === "settings" && <Settings />}
      </div>
    </div>
  );
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Predefined users with fixed positions and categories
// These users are mapped to category items from CategoriesView
const PREDEFINED_USERS: Array<{
  id: string;
  name: string;
  position: { lat: number; lng: number };
  categoryItemId: string; // e.g., "jobs-professions-production-technical-Sanayi"
  avatar: string;
  isVip: boolean;
  nickname?: string; // Only for VIP users
}> = [
  // İŞ / MESLEK GRUPLARI - Üretim & Teknik
  {
    id: "user-1",
    name: "Ahmet",
    position: { lat: 41.0122, lng: 28.9764 },
    categoryItemId: "jobs-professions-production-technical-Sanayi",
    avatar: "👤",
    isVip: false,
  },
  {
    id: "user-2",
    name: "Mehmet",
    position: { lat: 41.0102, lng: 28.9744 },
    categoryItemId: "jobs-professions-production-technical-Fabrikalar",
    avatar: "👤",
    isVip: false,
  },
  {
    id: "user-3",
    name: "Ali",
    position: { lat: 41.0082, lng: 28.9804 },
    categoryItemId: "jobs-professions-production-technical-Teknik İşler",
    avatar: "👤",
    isVip: false,
  },
  // İnşaat & Yapı
  {
    id: "user-4",
    name: "Ayşe",
    position: { lat: 41.0062, lng: 28.9784 },
    categoryItemId: "jobs-professions-construction-building-İnşaat",
    avatar: "👤",
    isVip: false,
  },
  {
    id: "user-5",
    name: "Fatma",
    position: { lat: 41.0042, lng: 28.9764 },
    categoryItemId: "jobs-professions-construction-building-Mimarlık",
    avatar: "👤",
    isVip: true,
    nickname: "MimarF",
  },
  // Bilişim & Teknoloji
  {
    id: "user-6",
    name: "Zeynep",
    position: { lat: 41.0142, lng: 28.9824 },
    categoryItemId: "jobs-professions-it-technology-Yazılım",
    avatar: "👤",
    isVip: true,
    nickname: "CodeMaster",
  },
  {
    id: "user-7",
    name: "Can",
    position: { lat: 41.0162, lng: 28.9844 },
    categoryItemId: "jobs-professions-it-technology-Donanım",
    avatar: "👤",
    isVip: false,
  },
  // Ticaret & Satış & Hizmet
  {
    id: "user-8",
    name: "Deniz",
    position: { lat: 41.0022, lng: 28.9724 },
    categoryItemId: "jobs-professions-trade-sales-service-Mağaza",
    avatar: "👤",
    isVip: false,
  },
  {
    id: "user-9",
    name: "Emre",
    position: { lat: 41.0002, lng: 28.9704 },
    categoryItemId: "jobs-professions-trade-sales-service-Satış",
    avatar: "👤",
    isVip: false,
  },
  // Finans & Büro & Kamu
  {
    id: "user-10",
    name: "Elif",
    position: { lat: 41.0182, lng: 28.9864 },
    categoryItemId: "jobs-professions-finance-office-public-Banka",
    avatar: "👤",
    isVip: false,
  },
  // Sağlık & Eğitim & Sosyal Hizmet
  {
    id: "user-11",
    name: "Burak",
    position: { lat: 41.0202, lng: 28.9884 },
    categoryItemId: "jobs-professions-health-education-social-Doktor",
    avatar: "👤",
    isVip: true,
    nickname: "Dr.B",
  },
  {
    id: "user-12",
    name: "Ceren",
    position: { lat: 41.0222, lng: 28.9904 },
    categoryItemId: "jobs-professions-health-education-social-Öğretmen",
    avatar: "👤",
    isVip: false,
  },
  // Sanat & Medya & Eğlence
  {
    id: "user-13",
    name: "Kemal",
    position: { lat: 41.0242, lng: 28.9924 },
    categoryItemId: "jobs-professions-art-media-entertainment-Müzik",
    avatar: "👤",
    isVip: false,
  },
  // HOBİLER - Spor & Hareket
  {
    id: "user-14",
    name: "Selin",
    position: { lat: 41.0262, lng: 28.9944 },
    categoryItemId: "hobbies-sports-movement-Takım Sporları",
    avatar: "👤",
    isVip: false,
  },
  {
    id: "user-15",
    name: "Onur",
    position: { lat: 41.0282, lng: 28.9964 },
    categoryItemId: "hobbies-sports-movement-Fitness",
    avatar: "👤",
    isVip: true,
    nickname: "FitOnur",
  },
  // Sanat & El İşi
  {
    id: "user-16",
    name: "Pınar",
    position: { lat: 41.0302, lng: 28.9984 },
    categoryItemId: "hobbies-art-crafts-Resim",
    avatar: "👤",
    isVip: false,
  },
  // Oyun & Dijital
  {
    id: "user-17",
    name: "Murat",
    position: { lat: 41.0322, lng: 29.0004 },
    categoryItemId: "hobbies-games-digital-Bilgisayar/Konsol Oyunları",
    avatar: "👤",
    isVip: false,
  },
  // Doğa & Açık Hava
  {
    id: "user-18",
    name: "Ebru",
    position: { lat: 41.0342, lng: 29.0024 },
    categoryItemId: "hobbies-nature-outdoor-Yürüyüş",
    avatar: "👤",
    isVip: false,
  },
  // İLGİ ALANLARI - Bilim & Akademi
  {
    id: "user-19",
    name: "Okan",
    position: { lat: 41.0362, lng: 29.0044 },
    categoryItemId: "interests-science-academia-Matematik",
    avatar: "👤",
    isVip: false,
  },
  // Kültür & Sanat
  {
    id: "user-20",
    name: "Gizem",
    position: { lat: 41.0382, lng: 29.0064 },
    categoryItemId: "interests-culture-art-Film",
    avatar: "👤",
    isVip: false,
  },
  // İş Dünyası & Kişisel Gelişim
  {
    id: "user-21",
    name: "Tolga",
    position: { lat: 41.0402, lng: 29.0084 },
    categoryItemId: "interests-business-personal-growth-Girişimcilik",
    avatar: "👤",
    isVip: true,
    nickname: "StartupT",
  },
  // Teknoloji & Dijital Dünya
  {
    id: "user-22",
    name: "Seda",
    position: { lat: 41.0422, lng: 29.0104 },
    categoryItemId: "interests-technology-digital-Yapay Zekâ",
    avatar: "👤",
    isVip: false,
  },
  // Sağlık & Yaşam Tarzı
  {
    id: "user-23",
    name: "Barış",
    position: { lat: 41.0442, lng: 29.0124 },
    categoryItemId: "interests-health-lifestyle-Beslenme",
    avatar: "👤",
    isVip: false,
  },
  // Gezi & Keşif
  {
    id: "user-24",
    name: "Derya",
    position: { lat: 41.0462, lng: 29.0144 },
    categoryItemId: "interests-travel-exploration-Seyahat",
    avatar: "👤",
    isVip: false,
  },
];

// Generate anonymous display name for users
// VIP users can use their nickname, others get "Anonim X" based on user ID
function getDisplayName(user: (typeof PREDEFINED_USERS)[0]): string {
  if (user.isVip && user.nickname) {
    return user.nickname;
  }
  // Use user ID to generate consistent anonymous number
  const userIdNum = parseInt(user.id.replace("user-", "")) || 0;
  return `Anonim ${userIdNum}`;
}

// Add deterministic offset to approximate location (privacy protection)
// Uses user ID to generate consistent offset (50-200 meters)
// This ensures the same user always gets the same approximate position
function getApproximatePosition(
  originalPosition: { lat: number; lng: number },
  userId: string
): { lat: number; lng: number } {
  // Use user ID to generate consistent pseudo-random values
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Generate consistent angle and distance based on hash
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  const distance = 0.0005 + ((Math.abs(hash) % 1000) / 1000) * 0.0015; // 0.0005-0.002 degrees

  return {
    lat: originalPosition.lat + distance * Math.cos(angle),
    lng: originalPosition.lng + distance * Math.sin(angle),
  };
}

// Filter users based on selected categories
function getUsersFromSelectedCategories(
  selectedCategories: Set<string>
): Array<{
  id: string;
  displayName: string;
  position: { lat: number; lng: number };
  approximatePosition: { lat: number; lng: number };
  categories: string[];
  avatar: string;
  isVip: boolean;
}> {
  if (selectedCategories.size === 0) {
    return [];
  }

  const filteredUsers = PREDEFINED_USERS.filter((user) =>
    selectedCategories.has(user.categoryItemId)
  );

  return filteredUsers.map((user) => ({
    id: user.id,
    displayName: getDisplayName(user),
    position: user.position, // Keep original for distance calculation
    approximatePosition: getApproximatePosition(user.position, user.id), // Use approximate for map display (deterministic)
    categories: [user.categoryItemId],
    avatar: user.avatar,
    isVip: user.isVip,
  }));
}

function MapView({
  mapFilters,
  onMarkerClick,
}: {
  mapFilters: MapFilterState;
  onMarkerClick?: (marker: {
    id: string;
    position: { lat: number; lng: number };
    title?: string;
  }) => void;
}) {
  // Istanbul coordinates (default location)
  const [mapCenter] = React.useState({ lat: 41.0082, lng: 28.9784 });
  const [userLocation, setUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user's current location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Silently fail - use default location
        }
      );
    }
  }, []);

  // All available place markers
  const allPlaceMarkers = React.useMemo(
    () => [
      {
        id: "museum",
        position: { lat: 41.0122, lng: 28.9764 },
        icon: "🏛️",
        title: "Müze",
        category: "entertainment",
      },
      {
        id: "bank",
        position: { lat: 41.0082, lng: 28.9784 },
        icon: "💰",
        title: "Banka/ATM",
        category: "finance",
      },
      {
        id: "hospital",
        position: { lat: 41.0042, lng: 28.9744 },
        icon: "🏥",
        title: "Hastane",
        category: "health-wellness",
      },
      {
        id: "restaurant",
        position: { lat: 41.0102, lng: 28.9804 },
        icon: "🍴",
        title: "Restoran",
        category: "food-drink",
      },
      {
        id: "gas",
        position: { lat: 41.0062, lng: 28.9824 },
        icon: "⛽",
        title: "Benzin İstasyonu",
        category: "transport",
      },
    ],
    []
  );

  // Get users based on selected categories
  const allUsers = React.useMemo(() => {
    return getUsersFromSelectedCategories(mapFilters.selectedCategories);
  }, [mapFilters.selectedCategories]);

  // Filter users and place markers based on distance
  const { filteredUsers, filteredPlaceMarkers } = React.useMemo(() => {
    const center = userLocation || mapCenter;

    // Filter users
    const users = allUsers.filter((user) => {
      if (mapFilters.distanceFilter > 0) {
        const distanceInMeters = calculateDistance(
          center.lat,
          center.lng,
          user.position.lat,
          user.position.lng
        );
        const distanceInKm = distanceInMeters / 1000;
        if (distanceInKm > mapFilters.distanceFilter) {
          return false;
        }
      }
      return true;
    });

    // Filter place markers
    const places = allPlaceMarkers.filter((marker) => {
      // Filter by distance
      if (mapFilters.distanceFilter > 0) {
        const distanceInMeters = calculateDistance(
          center.lat,
          center.lng,
          marker.position.lat,
          marker.position.lng
        );
        const distanceInKm = distanceInMeters / 1000;
        if (distanceInKm > mapFilters.distanceFilter) {
          return false;
        }
      }
      return true;
    });

    return { filteredUsers: users, filteredPlaceMarkers: places };
  }, [
    allUsers,
    allPlaceMarkers,
    mapFilters.distanceFilter,
    userLocation,
    mapCenter,
  ]);

  // Combine users and place markers for map
  // Use approximate positions for users (privacy protection)
  const allMarkers = React.useMemo(() => {
    const userMarkers = filteredUsers.map((user) => ({
      id: user.id,
      position: user.approximatePosition, // Use approximate position for map display
      icon: user.avatar,
      title: user.displayName, // Use display name (Anonim X or nickname)
      type: "user" as const,
      isVip: user.isVip,
    }));

    const placeMarkers = filteredPlaceMarkers.map((marker) => ({
      id: marker.id,
      position: marker.position,
      icon: marker.icon,
      title: marker.title,
      type: "place" as const,
    }));

    return [...userMarkers, ...placeMarkers];
  }, [filteredUsers, filteredPlaceMarkers]);

  // Use user location if available, otherwise use default center
  const center = userLocation || mapCenter;

  return (
    <div className="relative h-full overflow-hidden">
      {/* Map Controls Overlay */}
      <div className="absolute left-[15px] top-[15px] z-10 grid h-[50px] w-[50px] place-items-center rounded-full bg-[var(--color-surface-white)] shadow-md cursor-pointer hover:bg-[var(--color-bg-light)] transition">
        🧭
      </div>
      <div
        onClick={() => {
          // Navigate to chat page when notification is clicked
          const event = new CustomEvent("navigateToChat", {
            detail: { filteredUsers },
          });
          window.dispatchEvent(event);
        }}
        className="absolute right-[15px] top-[15px] z-10 grid h-[50px] w-[50px] place-items-center rounded-full bg-[var(--color-surface-white)] shadow-md cursor-pointer hover:bg-[var(--color-bg-light)] transition"
      >
        👥
        {filteredUsers.length > 0 && (
          <div className="absolute -right-[5px] -top-[5px] grid min-w-[20px] place-items-center rounded-full bg-[#ff4444] px-2 text-[12px] font-bold text-white">
            {filteredUsers.length}
          </div>
        )}
      </div>

      {/* Google Map - falls back to MockMapView if API key is not configured */}
      <GoogleMap
        center={center}
        zoom={13}
        markers={allMarkers.map((m) => ({
          id: m.id,
          position: m.position,
          icon: m.icon,
          title: m.title,
        }))}
        className="absolute inset-0"
        mapStyle="grayscale"
        mapTypeId="roadmap"
        zoomControl={true}
        fullscreenControl={true}
        markerColor="#667eea"
        markerSize={40}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="px-[15px]">{children}</div>;
}

function GridTwo({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-[15px]">{children}</div>;
}

function PlacesView({
  mapFilters,
  onMapFiltersChange,
}: {
  mapFilters: MapFilterState;
  onMapFiltersChange: (filters: MapFilterState) => void;
}) {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | null
  >(null);

  // Comprehensive category structure with subcategories (from CategoriesView)
  const categories = React.useMemo(
    () => [
      {
        id: "food-drink",
        icon: "🍔",
        title: "Yemek & İçecek",
        description: "Restoranlar, kafeler ve barlar",
        count: 24,
        subcategories: [
          {
            icon: "🍴",
            name: "Restoranlar",
            count: 12,
            examples: ["İtalyan", "Türk", "Asya", "Fast Food"],
          },
          {
            icon: "☕",
            name: "Kafeler",
            count: 8,
            examples: ["Kahve", "Pastane", "Çay Bahçesi"],
          },
          {
            icon: "🍻",
            name: "Barlar",
            count: 4,
            examples: ["Cocktail", "Pub", "Wine Bar"],
          },
        ],
      },
      {
        id: "shopping",
        icon: "🛍️",
        title: "Alışveriş",
        description: "Mağazalar ve alışveriş merkezleri",
        count: 18,
        subcategories: [
          {
            icon: "🏪",
            name: "Marketler",
            count: 6,
            examples: ["Süpermarket", "Bakkal", "Organik"],
          },
          {
            icon: "🏬",
            name: "AVM'ler",
            count: 3,
            examples: ["İstiklal AVM", "Forum", "Mall"],
          },
          {
            icon: "👔",
            name: "Butikler",
            count: 5,
            examples: ["Giyim", "Ayakkabı", "Aksesuar"],
          },
          {
            icon: "💊",
            name: "Eczaneler",
            count: 4,
            examples: ["24 Saat", "Nöbetçi"],
          },
        ],
      },
      {
        id: "health-wellness",
        icon: "🏥",
        title: "Sağlık & Wellness",
        description: "Hastaneler, klinikler ve sağlık merkezleri",
        count: 15,
        subcategories: [
          {
            icon: "🏥",
            name: "Hastaneler",
            count: 5,
            examples: ["Genel", "Özel", "Üniversite"],
          },
          {
            icon: "💊",
            name: "Eczaneler",
            count: 4,
            examples: ["24 Saat", "Nöbetçi"],
          },
          {
            icon: "🏋️",
            name: "Spor Salonları",
            count: 4,
            examples: ["Fitness", "Yoga", "Pilates"],
          },
          {
            icon: "💆",
            name: "Sağlık Merkezleri",
            count: 2,
            examples: ["Fizik Tedavi", "Masaj"],
          },
        ],
      },
      {
        id: "education",
        icon: "🎓",
        title: "Eğitim",
        description: "Okullar, kütüphaneler ve kurslar",
        count: 12,
        subcategories: [
          {
            icon: "🏫",
            name: "Okullar",
            count: 5,
            examples: ["İlkokul", "Ortaokul", "Lise"],
          },
          {
            icon: "📚",
            name: "Kütüphaneler",
            count: 3,
            examples: ["Halk", "Üniversite"],
          },
          {
            icon: "✏️",
            name: "Kurslar",
            count: 4,
            examples: ["Dil", "Müzik", "Sanat"],
          },
        ],
      },
      {
        id: "transport",
        icon: "🚗",
        title: "Ulaşım",
        description: "Benzin istasyonları ve ulaşım noktaları",
        count: 20,
        subcategories: [
          {
            icon: "⛽",
            name: "Benzin İstasyonları",
            count: 8,
            examples: ["BP", "Shell", "Petrol Ofisi"],
          },
          {
            icon: "🚌",
            name: "Duraklar",
            count: 7,
            examples: ["Otobüs", "Minibüs", "Metro"],
          },
          {
            icon: "🅿️",
            name: "Park Yerleri",
            count: 5,
            examples: ["Otopark", "Ücretsiz", "Ücretli"],
          },
        ],
      },
      {
        id: "entertainment",
        icon: "🎬",
        title: "Eğlence",
        description: "Sinemalar, tiyatrolar ve eğlence mekanları",
        count: 14,
        subcategories: [
          {
            icon: "🎬",
            name: "Sinemalar",
            count: 4,
            examples: ["Multiplex", "Sanat"],
          },
          {
            icon: "🎭",
            name: "Tiyatrolar",
            count: 3,
            examples: ["Devlet", "Özel"],
          },
          {
            icon: "🏛️",
            name: "Müzeler",
            count: 3,
            examples: ["Tarih", "Sanat", "Bilim"],
          },
          {
            icon: "🎢",
            name: "Parklar",
            count: 4,
            examples: ["Eğlence", "Tema", "Lunapark"],
          },
        ],
      },
      {
        id: "finance",
        icon: "💰",
        title: "Finans",
        description: "Bankalar, ATM'ler ve finansal hizmetler",
        count: 16,
        subcategories: [
          {
            icon: "🏦",
            name: "Bankalar",
            count: 6,
            examples: ["Ziraat", "İş Bankası", "Garanti"],
          },
          {
            icon: "💳",
            name: "ATM'ler",
            count: 8,
            examples: ["Nakit", "Kredi Kartı"],
          },
          {
            icon: "💵",
            name: "Döviz Büroları",
            count: 2,
            examples: ["Döviz", "Altın"],
          },
        ],
      },
      {
        id: "infrastructure",
        icon: "🛣️",
        title: "Altyapı",
        description: "Sokaklar, caddeler ve şehir yapıları",
        count: 45,
        subcategories: [
          {
            icon: "🛣️",
            name: "Ana Caddeler",
            count: 12,
            examples: ["İstiklal", "Bağdat", "Atatürk"],
          },
          {
            icon: "🚶",
            name: "Sokaklar",
            count: 20,
            examples: ["Yaya", "Tek Yön", "Çift Yön"],
          },
          {
            icon: "🌉",
            name: "Köprüler",
            count: 5,
            examples: ["Boğaziçi", "Fatih Sultan Mehmet"],
          },
          {
            icon: "🏛️",
            name: "Meydanlar",
            count: 8,
            examples: ["Taksim", "Kadıköy", "Beşiktaş"],
          },
        ],
      },
    ],
    []
  );

  // If a category is selected, show detail view
  if (selectedCategoryId) {
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    if (!selectedCategory) {
      setSelectedCategoryId(null);
      return null;
    }

    return (
      <CategoryDetailView
        category={selectedCategory}
        mapFilters={mapFilters}
        onMapFiltersChange={onMapFiltersChange}
        onBack={() => setSelectedCategoryId(null)}
      />
    );
  }

  return (
    <Section>
      <div className="mb-3 text-lg font-semibold text-[var(--color-text)]">
        Nearby Places
      </div>
      <GridTwo>
        {categories.map((category) => {
          return (
            <PlaceCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              count={category.count}
              onClick={() => setSelectedCategoryId(category.id)}
            />
          );
        })}
      </GridTwo>
    </Section>
  );
}

function PlaceCard({
  icon,
  title,
  count,
  onClick,
}: {
  icon: string;
  title: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[12px] bg-[var(--color-surface-white)] p-[15px] shadow transition hover:-translate-y-[2px] text-left"
    >
      <div className="mb-2 text-[32px]">{icon}</div>
      <div className="flex items-center gap-2">
        <div className="font-semibold text-[var(--color-text)]">{title}</div>
        <span className="rounded-full bg-[var(--color-primary-main)] px-2 py-0.5 text-[10px] font-bold text-white">
          {count}
        </span>
      </div>
    </button>
  );
}

function CategoryDetailView({
  category,
  mapFilters,
  onMapFiltersChange,
  onBack,
}: {
  category: {
    id: string;
    icon: string;
    title: string;
    description: string;
    count: number;
    subcategories: Array<{
      icon: string;
      name: string;
      count: number;
      examples: string[];
    }>;
  };
  mapFilters: MapFilterState;
  onMapFiltersChange: (filters: MapFilterState) => void;
  onBack: () => void;
}) {
  const toggleSubcategorySelection = (subcategoryName: string) => {
    const subcategoryId = `${category.id}-${subcategoryName}`;
    const newSelected = new Set(mapFilters.selectedCategories);
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId);
    } else {
      newSelected.add(subcategoryId);
    }
    onMapFiltersChange({
      ...mapFilters,
      selectedCategories: newSelected,
    });
  };

  return (
    <div
      className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-[var(--color-surface-white)] border-b border-[#f0f0f0] shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={onBack}
            className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-bg-light)] hover:bg-[#e8ecf4] transition"
            aria-label="Geri"
          >
            ←
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="text-[32px]">{category.icon}</div>
            <div>
              <div className="font-semibold text-[var(--color-text)]">
                {category.title}
              </div>
              <div className="text-[12px] text-[var(--color-text-2)]">
                {category.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories as chips */}
      <div className="p-4">
        <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
          Alt Kategoriler
        </div>
        <div className="flex flex-wrap gap-2">
          {category.subcategories.map((subcat) => {
            const subcategoryId = `${category.id}-${subcat.name}`;
            const isSelected = mapFilters.selectedCategories.has(subcategoryId);
            return (
              <button
                key={subcat.name}
                onClick={() => toggleSubcategorySelection(subcat.name)}
                className={`flex items-center gap-2 rounded-[12px] px-4 py-2.5 transition ${
                  isSelected
                    ? "bg-[#4CAF50] text-white shadow-md"
                    : "bg-[#e0e0e0] text-[var(--color-text)] hover:bg-[#d0d0d0]"
                }`}
              >
                <span className="text-[18px]">{subcat.icon}</span>
                <span className="font-medium text-sm">{subcat.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isSelected
                      ? "bg-white/30 text-white"
                      : "bg-[var(--color-text-3)] text-white"
                  }`}
                >
                  {subcat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterView({
  mapFilters,
  onMapFiltersChange,
}: {
  mapFilters: MapFilterState;
  onMapFiltersChange: (filters: MapFilterState) => void;
}) {
  // Distance presets in kilometers (buttons only, not in slider range)
  const distancePresets = [1000, 1500, 2000, 5000];
  const minDistance = 0;
  const maxDistance = 500; // Slider max is 500 km

  const handleDistanceChange = (value: number) => {
    onMapFiltersChange({
      ...mapFilters,
      distanceFilter: value,
    });
  };

  const formatDistance = (kilometers: number): string => {
    if (kilometers === 0) return "Tümü";
    if (kilometers < 1) return `${Math.round(kilometers * 1000)} m`;
    return `${kilometers} km`;
  };

  // Check if current value is in slider range (0-500 km)
  const isInSliderRange =
    mapFilters.distanceFilter >= 0 && mapFilters.distanceFilter <= maxDistance;

  return (
    <Section>
      <div className="px-[15px] pb-2 text-lg font-semibold text-[var(--color-text)]">
        Filter
      </div>
      <div className="m-[15px] rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold text-[var(--color-text)]">Distance</div>
          <div className="text-lg font-bold text-[var(--color-primary-main)]">
            {formatDistance(mapFilters.distanceFilter)}
          </div>
        </div>

        {/* Range Slider (0-500 km) */}
        <div className="mb-4">
          <input
            type="range"
            min={minDistance}
            max={maxDistance}
            step={10}
            value={isInSliderRange ? mapFilters.distanceFilter : maxDistance}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              handleDistanceChange(value);
            }}
            aria-label={`Distance filter: ${mapFilters.distanceFilter} kilometers`}
            title={`Distance filter: ${mapFilters.distanceFilter} kilometers`}
            className="w-full h-2 bg-[var(--color-bg-light)] rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, var(--color-primary-main) 0%, var(--color-primary-main) ${((isInSliderRange ? mapFilters.distanceFilter : maxDistance) / maxDistance) * 100}%, var(--color-bg-light) ${((isInSliderRange ? mapFilters.distanceFilter : maxDistance) / maxDistance) * 100}%, var(--color-bg-light) 100%)`,
            }}
          />
          <style>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: var(--color-primary-main);
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
              border: 3px solid white;
            }
            .slider::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: var(--color-primary-main);
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
              border: 3px solid white;
            }
          `}</style>
        </div>

        {/* Preset buttons (1000 km, 1500 km, 2000 km, 5000 km) */}
        <div className="flex gap-1.5">
          {distancePresets.map((preset) => {
            // Check if current filter matches this preset exactly
            const isActive = mapFilters.distanceFilter === preset;
            return (
              <button
                key={preset}
                onClick={() => handleDistanceChange(preset)}
                className={`flex-1 px-2 py-1.5 rounded-[6px] text-xs font-medium transition ${
                  isActive
                    ? "bg-gradient-primary text-white shadow-md"
                    : "bg-[var(--color-bg-light)] text-[var(--color-text)] hover:bg-[#e8ecf4]"
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>
      <div className="m-[15px] rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow">
        <div className="mb-[15px] font-semibold text-[var(--color-text)]">
          Kullanıcılar
        </div>
        {["Çevrimiçi kullanıcılar", "VIP kullanıcılar", "Arkadaşlar"].map(
          (option, index) => (
            <div
              key={option}
              className={`mb-2 flex cursor-pointer items-center justify-between rounded-[8px] p-3 transition ${
                index === 0
                  ? "bg-gradient-primary text-white"
                  : "bg-[var(--color-bg-light)] hover:bg-[#e8ecf4]"
              }`}
            >
              <span>{option}</span>
              <div
                className={`relative h-6 w-11 rounded-[12px] transition ${index === 0 ? "bg-[#4CAF50]" : "bg-[#ddd]"}`}
              >
                <div
                  className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-[var(--color-surface-white)] transition ${index === 0 ? "translate-x-[20px]" : ""}`}
                />
              </div>
            </div>
          )
        )}
      </div>
    </Section>
  );
}

function CategoriesView({
  mapFilters,
  onMapFiltersChange,
}: {
  mapFilters: MapFilterState;
  onMapFiltersChange: (filters: MapFilterState) => void;
}) {
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(mapFilters.selectedCategories);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    onMapFiltersChange({
      ...mapFilters,
      selectedCategories: newSelected,
    });
  };

  // New category structure based on user requirements
  const categories = React.useMemo(
    () => [
      {
        id: "jobs-professions",
        icon: "💼",
        title: "İŞ / MESLEK GRUPLARI",
        subcategories: [
          {
            id: "production-technical",
            title: "Üretim & Teknik",
            items: [
              "Sanayi",
              "Fabrikalar",
              "Teknik İşler",
              "Ustalık",
              "Tamir-Bakım",
            ],
          },
          {
            id: "construction-building",
            title: "İnşaat & Yapı",
            items: ["İnşaat", "Mimarlık", "Şantiye", "Tesisat", "Marangozluk"],
          },
          {
            id: "it-technology",
            title: "Bilişim & Teknoloji",
            items: ["Yazılım", "Donanım", "Ağ/Sistem", "Veri", "Tasarım"],
          },
          {
            id: "trade-sales-service",
            title: "Ticaret & Satış & Hizmet",
            items: [
              "Mağaza",
              "Satış",
              "Pazarlama",
              "Müşteri Hizmetleri",
              "Turizm",
              "Yeme-İçme",
            ],
          },
          {
            id: "finance-office-public",
            title: "Finans & Büro & Kamu",
            items: [
              "Banka",
              "Muhasebe",
              "İnsan Kaynakları",
              "Memuriyet",
              "Ofis İşleri",
            ],
          },
          {
            id: "health-education-social",
            title: "Sağlık & Eğitim & Sosyal Hizmet",
            items: [
              "Doktor",
              "Hemşire",
              "Öğretmen",
              "Psikolog",
              "Sosyal Hizmet",
            ],
          },
          {
            id: "art-media-entertainment",
            title: "Sanat & Medya & Eğlence",
            items: [
              "Müzik",
              "Sinema",
              "Tasarım",
              "İçerik Üretimi",
              "Fotoğraf",
              "Oyunculuk",
            ],
          },
        ],
      },
      {
        id: "hobbies",
        icon: "🎨",
        title: "HOBİLER",
        subcategories: [
          {
            id: "sports-movement",
            title: "Spor & Hareket",
            items: [
              "Takım Sporları",
              "Bireysel Sporlar",
              "Fitness",
              "Dövüş Sporları",
              "Dans",
            ],
          },
          {
            id: "art-crafts",
            title: "Sanat & El İşi",
            items: [
              "Resim",
              "Müzik",
              "Yazı Yazma",
              "El İşi",
              "El Sanatları",
              "Tasarım",
            ],
          },
          {
            id: "games-digital",
            title: "Oyun & Dijital",
            items: [
              "Bilgisayar/Konsol Oyunları",
              "Masa Oyunları",
              "Rol Yapma Oyunları",
            ],
          },
          {
            id: "nature-outdoor",
            title: "Doğa & Açık Hava",
            items: ["Yürüyüş", "Kamp", "Balıkçılık", "Bahçecilik", "Bisiklet"],
          },
          {
            id: "collection-hobby-projects",
            title: "Koleksiyon & Hobi Projeleri",
            items: [
              "Koleksiyon (Pul, Para, Figür vb.)",
              "Maket",
              "Model",
              "DIY Projeler",
            ],
          },
        ],
      },
      {
        id: "interests",
        icon: "⭐",
        title: "İLGİ ALANLARI",
        subcategories: [
          {
            id: "science-academia",
            title: "Bilim & Akademi",
            items: [
              "Matematik",
              "Fen",
              "Tarih",
              "Psikoloji",
              "Sosyoloji",
              "Felsefe",
            ],
          },
          {
            id: "culture-art",
            title: "Kültür & Sanat",
            items: ["Film", "Dizi", "Kitap", "Müzik", "Tiyatro"],
          },
          {
            id: "business-personal-growth",
            title: "İş Dünyası & Kişisel Gelişim",
            items: [
              "Girişimcilik",
              "Liderlik",
              "Finans",
              "Yatırım",
              "Verimlilik",
            ],
          },
          {
            id: "technology-digital",
            title: "Teknoloji & Dijital Dünya",
            items: [
              "Yapay Zekâ",
              "Programlama",
              "Kripto",
              "Dijital Pazarlama",
              "Sosyal Medya",
            ],
          },
          {
            id: "health-lifestyle",
            title: "Sağlık & Yaşam Tarzı",
            items: ["Beslenme", "Spor", "Meditasyon", "Ruh Sağlığı"],
          },
          {
            id: "travel-exploration",
            title: "Gezi & Keşif",
            items: [
              "Seyahat",
              "Farklı Kültürler",
              "Yemek Kültürü",
              "Tarihi Yerler",
            ],
          },
        ],
      },
    ],
    []
  );

  return (
    <div
      className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <Section>
        <div className="mb-3 px-5">
          <div className="text-lg font-semibold text-[var(--color-text)]">
            Categories
          </div>
          <div className="text-sm text-[var(--color-text-2)]">
            Food & Drink, Entertainment, Travel
          </div>
        </div>
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          return (
            <div
              key={category.id}
              className="mb-3 overflow-hidden rounded-[12px] bg-[var(--color-surface-white)] shadow transition-all"
            >
              {/* Main Category Header */}
              <div className="flex items-center p-5">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex flex-1 items-center text-left transition hover:bg-[var(--color-bg-light)] -ml-2 -mr-2 px-2 py-2 rounded"
                >
                  <div className="mr-[15px] grid h-[50px] w-[50px] place-items-center rounded-[12px] bg-gradient-to-br from-[var(--color-bg-light)] to-[var(--color-bg-medium)] text-[28px]">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-semibold text-[var(--color-text)]">
                      {category.title}
                    </div>
                  </div>
                  <div
                    className={`ml-2 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </div>
                </button>
              </div>

              {/* Subcategories */}
              {isExpanded && (
                <div className="border-t border-[#f0f0f0] bg-[var(--color-bg-light)]">
                  {category.subcategories.map((subcat, index) => (
                    <div
                      key={subcat.id}
                      className={`border-t border-[#e0e0e0] p-4 ${
                        index === 0 ? "border-t-0" : ""
                      }`}
                    >
                      {/* Subcategory Title */}
                      <div className="mb-3">
                        <span className="font-semibold text-[14px] text-[var(--color-text)]">
                          {subcat.title}
                        </span>
                      </div>
                      {/* Selectable Items (Chips) */}
                      <div className="flex flex-wrap gap-2">
                        {subcat.items.map((item) => {
                          const itemId = `${category.id}-${subcat.id}-${item}`;
                          const isSelected =
                            mapFilters.selectedCategories.has(itemId);
                          return (
                            <button
                              key={item}
                              onClick={() => toggleItemSelection(itemId)}
                              className={`rounded-[12px] px-3 py-1.5 text-[12px] font-medium transition ${
                                isSelected
                                  ? "bg-[#4CAF50] text-white shadow-md"
                                  : "bg-white text-[var(--color-text-2)] shadow-sm hover:bg-[#f0f0f0]"
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Section>
    </div>
  );
}

function ProfileView() {
  return (
    <div
      className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Gradient Header */}
      <div className="relative bg-gradient-primary pb-[60px] pt-8">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-[4px] border-white bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary-dark)] shadow-[0_6px_16px_rgba(0,0,0,0.15)]" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
              U
            </div>
          </div>
        </div>
        <div className="mb-6 text-center text-xl font-bold text-white">
          Kullanıcı Adı
        </div>
        {/* Stats */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-lg font-bold text-white">127</div>
            <div className="text-xs text-white/80">Arkadaş</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">42</div>
            <div className="text-xs text-white/80">Check-in</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">18</div>
            <div className="text-xs text-white/80">Fotoğraf</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Konum
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">
              İstanbul, Türkiye
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Doğum Tarihi
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">
              15 Ocak 1990
            </div>
          </div>
        </div>
      </div>
      {/* Kişisel Bilgiler */}
      <div className="mx-5 mt-5 rounded-[15px] bg-[var(--color-surface-white)] p-5 shadow">
        <div className="mb-4 text-lg font-semibold text-[var(--color-text)]">
          Kişisel Bilgiler
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Email
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">
              user@example.com
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Telefon
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">
              +90 555 123 4567
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Konum
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">
              İstanbul, Türkiye
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Doğum Tarihi
            </div>
            <div className="text-sm font-medium text-[var(--color-text)]">
              15 Ocak 1990
            </div>
          </div>
        </div>
      </div>

      {/* İlgi Alanları */}
      <div className="mx-5 mt-5 rounded-[15px] bg-[var(--color-surface-white)] p-5 shadow">
        <div className="mb-4 text-lg font-semibold text-[var(--color-text)]">
          İlgi Alanları
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Müzik",
            "Spor",
            "Teknoloji",
            "Sanat",
            "Seyahat",
            "Yemek",
            "Kitap",
            "Sinema",
          ].map((tag) => (
            <div
              key={tag}
              className="rounded-[20px] bg-[#f0f0f0] px-3 py-1.5 text-xs text-[var(--color-text)] transition-all hover:scale-95 hover:bg-gradient-primary hover:text-white"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatView({
  activeGroupUsers,
}: {
  activeGroupUsers?: Array<{
    id: string;
    displayName: string;
    avatar: string;
    isVip: boolean;
  }>;
}) {
  const [showGroupSettings, setShowGroupSettings] = React.useState(false);
  const hasActiveUsers = activeGroupUsers && activeGroupUsers.length > 0;

  return (
    <div
      className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Group Management Panel */}
      {hasActiveUsers && (
        <div className="bg-[var(--color-surface-white)] border-b border-[#f0f0f0] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-[var(--color-text)]">
                {activeGroupUsers.length} Kişi Bulundu
              </div>
              <div className="text-xs text-[var(--color-text-2)]">
                Seçili kategorilere göre
              </div>
            </div>
            <button
              onClick={() => setShowGroupSettings(!showGroupSettings)}
              className="p-2 rounded-full hover:bg-[var(--color-bg-light)] transition"
              aria-label="Grup Ayarları"
            >
              ⚙️
            </button>
          </div>

          {showGroupSettings && (
            <div className="space-y-2 pt-3 border-t border-[#f0f0f0]">
              <button className="w-full text-left px-3 py-2 rounded-lg bg-gradient-primary text-white hover:opacity-90 transition">
                👥 Grup Oluştur
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[var(--color-bg-light)] hover:bg-[var(--color-bg-medium)] transition">
                💬 Özel Sohbet Odası
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-[var(--color-bg-light)] hover:bg-[var(--color-bg-medium)] transition">
                ✉️ Özel Mesaj Gönder
              </button>
            </div>
          )}

          {/* Active Users List */}
          <div className="mt-3 flex gap-2 overflow-x-auto py-2">
            {activeGroupUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary-dark)] flex items-center justify-center text-white text-lg">
                  {user.avatar}
                </div>
                <span className="text-[10px] text-[var(--color-text-2)] mt-1">
                  {user.displayName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="p-[15px]">
        {hasActiveUsers ? (
          <div className="text-center py-8">
            <div className="text-[48px] mb-3">💬</div>
            <div className="text-[var(--color-text-2)]">
              Grup sohbeti başlatmak için yukarıdaki seçenekleri kullanın
            </div>
          </div>
        ) : (
          [
            ["A", "Merhaba! Bugün nasılsın? 😊"],
            ["Z", "Toplantı saat 15:00'te başlayacak"],
            ["M", "Dosyaları gönderdim ✅"],
          ].map(([avatar, message], index) => (
            <div
              key={index}
              className="mb-5 flex items-start animate-[slideIn_.3s_ease]"
            >
              <div className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--color-primary-main)] to-[var(--color-primary-dark)] text-white font-bold">
                {avatar}
              </div>
              <div className="rounded-[18px] rounded-tl-[4px] bg-[var(--color-surface-white)] px-[15px] py-[12px] shadow">
                {message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GroupsView({
  groupChats,
  filteredUsers,
}: {
  groupChats: GroupChat[];
  filteredUsers: Array<{
    id: string;
    displayName: string;
    avatar: string;
    isVip: boolean;
  }>;
}) {
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    null
  );

  if (selectedGroupId) {
    const selectedGroup = groupChats.find((g) => g.id === selectedGroupId);
    if (!selectedGroup) {
      setSelectedGroupId(null);
      return null;
    }

    return (
      <GroupChatView
        group={selectedGroup}
        members={filteredUsers.filter((u) =>
          selectedGroup.memberIds.includes(u.id)
        )}
        onBack={() => setSelectedGroupId(null)}
      />
    );
  }

  return (
    <Section>
      <div className="mb-3 px-[15px] text-lg font-semibold text-[var(--color-text)]">
        Groups
      </div>
      {groupChats.length === 0 ? (
        <div className="m-[15px] rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow text-center">
          <div className="text-[48px] mb-3">💬</div>
          <div className="text-[var(--color-text-2)] text-sm">
            Henüz grup yok. Kategoriler seçerek kişileri bulun ve otomatik grup
            oluşturun.
          </div>
        </div>
      ) : (
        groupChats.map((group) => {
          const memberCount = group.memberIds.length;
          const lastMessage = group.lastMessage
            ? `${group.lastMessage.author}: ${group.lastMessage.text}`
            : `${memberCount} kişi bu grupta`;

          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className="w-full text-left"
            >
              <GroupRow
                icon="👥"
                title={group.name}
                description={lastMessage}
                badge={memberCount > 0 ? String(memberCount) : undefined}
              />
            </button>
          );
        })
      )}
    </Section>
  );
}

function GroupChatView({
  group,
  members,
  onBack,
}: {
  group: GroupChat;
  members: Array<{
    id: string;
    displayName: string;
    avatar: string;
    isVip: boolean;
  }>;
  onBack: () => void;
}) {
  const messages = React.useMemo(
    () => [
      {
        id: "msg-1",
        authorId: "system",
        authorName: "Sistem",
        text: `Grup olusturuldu! ${members.length} kisi bu grupta.`,
        timestamp: group.createdAt,
      },
    ],
    [group.createdAt, members.length]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-surface-white)] border-b border-[#f0f0f0] shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={onBack}
            className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-bg-light)] hover:bg-[#e8ecf4] transition"
            aria-label="Geri"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="font-semibold text-[var(--color-text)]">
              {group.name}
            </div>
            <div className="text-[12px] text-[var(--color-text-2)]">
              {members.length} üye
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-[15px] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="mb-5 flex items-start animate-[slideIn_.3s_ease]"
          >
            <div className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--color-primary-main)] to-[var(--color-primary-dark)] text-white font-bold text-sm">
              {msg.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="mb-1 text-xs font-semibold text-[var(--color-text-2)]">
                {msg.authorName}
              </div>
              <div className="rounded-[18px] rounded-tl-[4px] bg-[var(--color-surface-white)] px-[15px] py-[12px] shadow">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Members list (collapsible) */}
      <div className="border-t border-[#f0f0f0] bg-[var(--color-surface-white)] p-4">
        <div className="mb-2 text-sm font-semibold text-[var(--color-text)]">
          Grup Üyeleri ({members.length})
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 rounded-full bg-[var(--color-bg-light)] px-3 py-1.5"
            >
              <span className="text-sm">{member.avatar}</span>
              <span className="text-xs font-medium text-[var(--color-text)]">
                {member.displayName}
              </span>
              {member.isVip && <span className="text-xs">👑</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupRow({
  icon,
  title,
  description,
  badge,
}: {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="mb-3 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-[15px] shadow">
      <div className="mr-[15px] grid h-[50px] w-[50px] place-items-center rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white font-bold">
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 font-semibold text-[var(--color-text)]">
          {title}
        </div>
        <div className="text-[13px] text-[var(--color-text-2)]">
          {description}
        </div>
      </div>
      {badge && (
        <div className="rounded-[10px] bg-[#ff4444] px-2 py-[2px] text-[11px] text-white">
          {badge}
        </div>
      )}
    </div>
  );
}

function SocialFeed() {
  const stories = [
    { id: "add", name: "Hikaye Ekle", avatar: "+", isAdd: true },
    { id: "1", name: "Ayşe", avatar: "👩", hasStory: true },
    { id: "2", name: "Mehmet", avatar: "👨", hasStory: true },
    { id: "3", name: "Zeynep", avatar: "👩‍🦱", hasStory: false },
    { id: "4", name: "Can", avatar: "👱‍♂️", hasStory: true },
    { id: "5", name: "Elif", avatar: "👩‍🦰", hasStory: true },
    { id: "6", name: "Mert", avatar: "🧔", hasStory: false },
    { id: "7", name: "Seda", avatar: "👩‍💼", hasStory: true },
    { id: "8", name: "Burak", avatar: "👨‍💻", hasStory: true },
  ];

  return (
    <Section>
      {/* Stories + media shortcuts */}
      <div className="mb-3 overflow-hidden rounded-[10px] bg-[var(--color-surface-white)] shadow">
        <div
          className="flex gap-2.5 overflow-x-auto px-3 py-1.5 scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-shrink-0 flex-col items-center"
            >
              <div
                className={`relative h-12 w-12 rounded-full ${
                  story.isAdd
                    ? "border-2 border-[#667eea] bg-white"
                    : story.hasStory
                      ? "bg-gradient-to-br from-[#f093fb] to-[#f5576c] p-[2px]"
                      : "bg-gray-200"
                }`}
              >
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full ${
                    story.isAdd
                      ? "text-[#667eea] text-lg"
                      : story.hasStory
                        ? "bg-white text-lg"
                        : "text-lg"
                  }`}
                >
                  {story.avatar}
                </div>
              </div>
              <span className="mt-[3px] text-[10px] text-[var(--color-text-2)]">
                {story.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-[#f0f0f0] px-3 py-2">
          {[
            ["🖼️", "Photos"],
            ["🎥", "Videos"],
            ["⭐", "Stories"],
          ].map(([icon, label]) => (
            <button
              key={label as string}
              type="button"
              className="flex flex-1 items-center justify-center gap-1 rounded-[8px] bg-[var(--color-bg-light)] py-2 px-3 text-[10px] text-[var(--color-text-2)] hover:bg-[var(--color-bg-medium)] transition"
            >
              <span className="text-[14px]">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="mb-3 overflow-hidden rounded-[10px] bg-[var(--color-surface-white)] shadow">
        <div className="flex items-center px-3 py-2">
          <div className="mr-3 h-10 w-10 rounded-full bg-gradient-to-br from-[#f093fb] to-[#f5576c]" />
          <div className="flex-1">
            <div className="mb-[2px] font-semibold text-[var(--color-text)]">
              Ayşe Yılmaz
            </div>
            <div className="text-[12px] text-[var(--color-text-2)]">
              2 hours ago
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">
          What a beautiful day! ☀️ Enjoying coffee by the seaside.
        </div>
        <div className="grid h-[150px] w-full place-items-center bg-gradient-to-br from-[var(--color-bg-medium)] to-[var(--color-bg-light)] text-[40px] text-[#ddd]">
          📷
        </div>
        <div className="flex justify-around border-t border-[#f0f0f0] px-3 py-2 text-[var(--color-text-2)]">
          <div>❤️ 42</div>
          <div>💬 8</div>
          <div>📤 Share</div>
        </div>
      </div>

      {/* Additional Post */}
      <div className="mb-3 overflow-hidden rounded-[10px] bg-[var(--color-surface-white)] shadow">
        <div className="flex items-center px-3 py-2">
          <div className="mr-3 h-10 w-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
          <div className="flex-1">
            <div className="mb-[2px] font-semibold text-[var(--color-text)]">
              Mehmet Özkan
            </div>
            <div className="text-[12px] text-[var(--color-text-2)]">
              5 hours ago
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">
          Just finished my morning workout! 💪 Feeling energized for the day
          ahead!
        </div>
        <div className="grid h-[150px] w-full place-items-center bg-gradient-to-br from-[var(--color-bg-medium)] to-[var(--color-bg-light)] text-[40px] text-[#ddd]">
          🏋️
        </div>
        <div className="flex justify-around border-t border-[#f0f0f0] px-3 py-2 text-[var(--color-text-2)]">
          <div>❤️ 28</div>
          <div>💬 5</div>
          <div>📤 Share</div>
        </div>
      </div>
    </Section>
  );
}

function NotificationRow({
  icon,
  title,
  time,
  iconColor,
  background,
}: {
  icon: string;
  title: string;
  time: string;
  iconColor: string;
  background: string;
}) {
  return (
    <div className="mb-3 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-[15px] shadow">
      <div
        className="mr-3 grid h-10 w-10 place-items-center rounded-full"
        style={{ background, color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 text-[var(--color-text)]">
          <strong>{title.split(" ")[0]}</strong>{" "}
          {title.split(" ").slice(1).join(" ")}
        </div>
        <div className="text-[12px] text-[var(--color-text-2)]">{time}</div>
      </div>
    </div>
  );
}

function VipSection() {
  return (
    <div className="p-5 text-center">
      <div className="my-[30px] text-[64px]">👑</div>
      <div className="mb-2 bg-gradient-to-br from-[#FFD700] to-[#FFA500] bg-clip-text text-[28px] font-bold text-transparent">
        VIP Membership
      </div>
      <div className="mb-6 text-[14px] text-[var(--color-text-2)]">
        Enjoy premium features and priority access
      </div>
      {[
        ["✨", "Unlimited Messaging", "No daily message limits"],
        ["🎯", "Advanced Filters", "Fine-tune discovery and matching"],
        ["🔒", "Stealth Mode", "Keep your profile hidden"],
        ["🚀", "Priority Support", "24/7 VIP assistance"],
      ].map(([icon, title, description]) => (
        <div
          key={title}
          className="mb-4 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow"
        >
          <div className="mr-4 w-10 text-[24px]">{icon}</div>
          <div className="text-left">
            <div className="mb-1 font-semibold text-[var(--color-text)]">
              {title}
            </div>
            <div className="text-[12px] text-[var(--color-text-2)]">
              {description}
            </div>
          </div>
        </div>
      ))}
      <button className="mt-2 rounded-[25px] bg-gradient-to-br from-[#FFD700] to-[#FFA500] px-10 py-3 font-semibold text-white shadow-[0_4px_12px_rgba(255,193,7,.4)]">
        Become VIP
      </button>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <SettingsGroup
        title="Account"
        items={[
          ["👤", "Personal information"],
          ["📧", "Contact & verification"],
          ["🔑", "Login & security"],
        ]}
      />
      <SettingsGroup
        title="Privacy & safety"
        items={[
          ["👀", "Profile visibility"],
          ["🚫", "Blocked users"],
        ]}
      />
      <SettingsGroup
        title="Notifications"
        toggles={[
          ["🔔", "Message notifications", true],
          ["📢", "Social notifications", false],
          ["✉️", "Email updates", false],
        ]}
      />
      <SettingsGroup
        title="Data & storage"
        items={[
          ["💾", "Media & storage"],
          ["📤", "Export my data"],
        ]}
      />
      <SettingsGroup
        title="About & support"
        pairs={[
          ["🌐", "Language", "Turkish"],
          ["ℹ️", "About", "v1.0.0"],
        ]}
      />
    </div>
  );
}

type SettingsGroupProps = {
  title: string;
  items?: [string, string][];
  toggles?: [string, string, boolean][];
  pairs?: [string, string, string][];
};

function SettingsGroup({ title, items, toggles, pairs }: SettingsGroupProps) {
  return (
    <div className="mx-[15px] mb-[15px] overflow-hidden rounded-[12px] bg-[var(--color-surface-white)] shadow">
      <div className="border-b border-[#f0f0f0] p-[15px] font-semibold text-[#667eea]">
        {title}
      </div>
      {items?.map(([icon, label]) => (
        <SettingsRow key={label} icon={icon} label={label} />
      ))}
      {toggles?.map(([icon, label, active]) => (
        <ToggleRow key={label} icon={icon} label={label} active={active} />
      ))}
      {pairs?.map(([icon, label, value]) => (
        <SettingsRow key={label} icon={icon} label={label} value={value} />
      ))}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex cursor-pointer items-center justify-between p-[15px] transition hover:bg-[var(--color-bg-light)]">
      <div className="flex items-center gap-3">
        <span className="w-[30px] text-[20px]">{icon}</span>
        <span className="text-[var(--color-text)]">{label}</span>
      </div>
      <span className="text-[var(--color-text-2)]">{value ?? "›"}</span>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-[15px]">
      <div className="flex items-center gap-3">
        <span className="w-[30px] text-[20px]">{icon}</span>
        <span className="text-[var(--color-text)]">{label}</span>
      </div>
      <div
        className={`relative h-6 w-11 rounded-[12px] transition ${active ? "bg-[#4CAF50]" : "bg-[#ddd]"}`}
      >
        <div
          className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-[var(--color-surface-white)] transition ${active ? "translate-x-[20px]" : ""}`}
        />
      </div>
    </div>
  );
}

function MessageInput({
  showAIAssistant = true,
}: {
  showAIAssistant?: boolean;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-[var(--color-surface)] p-[15px] shadow-[0_-4px_20px_rgba(0,0,0,.1)]">
      <div className="flex items-center gap-[10px] rounded-[12px] bg-[var(--color-bg-light)] p-[12px]">
        <span className="text-[22px] text-[var(--color-text-3)]">📎</span>
        <input
          className="flex-1 bg-transparent text-[16px] text-[var(--color-text)] outline-none"
          placeholder="Type your message..."
        />
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[10px] bg-gradient-primary"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
        {showAIAssistant && (
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white transition hover:scale-105 active:scale-95"
            aria-label="AI Assistant"
          >
            <span className="text-sm font-bold tracking-wide">AI</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function AppPhoneMock({
  initialPage = "map",
  showAIAssistant = true,
  showMessageInput = true,
}: AppPhoneMockProps) {
  const [navPosition, setNavPosition] = useState(() => {
    return sectionForPage(initialPage) * MAX_NAV_POSITION;
  });
  const [page, setPage] = useState<PageId>(initialPage);
  const [mapFilters, setMapFilters] = useState<MapFilterState>({
    selectedCategories: new Set(),
    distanceFilter: 0, // 0 means no filter (in kilometers)
  });
  const [groupChats, setGroupChats] = useState<GroupChat[]>(() => [
    ...DEFAULT_GROUP_CHATS,
  ]);
  const [activeGroupUsers, setActiveGroupUsers] = useState<
    Array<{
      id: string;
      displayName: string;
      avatar: string;
      isVip: boolean;
    }>
  >([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startPosition: number;
    hasMoved: boolean;
  }>({
    pointerId: null,
    startX: 0,
    startPosition: 0,
    hasMoved: false,
  });
  const navPositionRef = useRef(navPosition);

  useEffect(() => {
    navPositionRef.current = navPosition;
  }, [navPosition]);

  useEffect(() => {
    setPage(initialPage);
    setNavPosition(sectionForPage(initialPage) * MAX_NAV_POSITION);
  }, [initialPage]);

  // Listen for navigation to chat from map notification
  useEffect(() => {
    const handleNavigateToChat = (event: CustomEvent) => {
      if (event.detail && event.detail.filteredUsers) {
        setActiveGroupUsers(event.detail.filteredUsers);
        setPage("chat");
        setNavPosition(sectionForPage("chat") * MAX_NAV_POSITION);
      }
    };

    window.addEventListener(
      "navigateToChat",
      handleNavigateToChat as EventListener
    );
    return () => {
      window.removeEventListener(
        "navigateToChat",
        handleNavigateToChat as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragStateRef.current.pointerId = event.pointerId;
      dragStateRef.current.startX = event.clientX;
      dragStateRef.current.startPosition = navPositionRef.current;
      dragStateRef.current.hasMoved = false;
      el.style.transition = "none";
      el.style.willChange = "transform";
      if (typeof el.setPointerCapture === "function") {
        el.setPointerCapture(event.pointerId);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (dragStateRef.current.pointerId !== event.pointerId) return;
      const delta = event.clientX - dragStateRef.current.startX;
      if (!dragStateRef.current.hasMoved && Math.abs(delta) > 6) {
        dragStateRef.current.hasMoved = true;
      }
      if (!dragStateRef.current.hasMoved) return;
      const offset = dragStateRef.current.startPosition - delta;
      const visualOffset = normalizeNavPosition(offset);
      el.style.transform = navTransform(visualOffset);
    };

    const finishDrag = (event: PointerEvent) => {
      if (dragStateRef.current.pointerId !== event.pointerId) return;
      if (typeof el.releasePointerCapture === "function") {
        el.releasePointerCapture(event.pointerId);
      }
      el.style.transition = "";
      el.style.willChange = "";

      const delta = event.clientX - dragStateRef.current.startX;
      const moved = dragStateRef.current.hasMoved;
      const originPosition = dragStateRef.current.startPosition;
      dragStateRef.current.pointerId = null;
      dragStateRef.current.hasMoved = false;

      if (!moved) {
        const visualOrigin = normalizeNavPosition(originPosition);
        el.style.transform = navTransform(visualOrigin);
        return;
      }

      const finalPosition = originPosition - delta;
      setNavPosition(finalPosition);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", finishDrag);
    el.addEventListener("pointercancel", finishDrag);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", finishDrag);
      el.removeEventListener("pointercancel", finishDrag);
    };
  }, [navPosition]);

  const onSelect = (id: PageId) => {
    setPage(id);
    // Auto-adjust position based on selected page, ancak sonsuz loop hissini koru
    setNavPosition((prev) => {
      const total = NAV_WIDTH * navMenus.length;
      if (total <= 0) return prev;

      const targetOffset = chatPages.includes(id) ? NAV_WIDTH : 0;
      const remainder = ((prev % total) + total) % total;

      return prev + (targetOffset - remainder);
    });
  };

  const transform = useMemo(
    () => navTransform(normalizeNavPosition(navPosition)),
    [navPosition]
  );

  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden rounded-phone bg-[var(--color-bg-dark)] p-2 shadow-[0_25px_50px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2),_inset_0_0_0_1px_rgba(255,255,255,0.1)]">
      {/* Inline token styles so the component is self-contained in the sandbox */}
      <TokenStyles />
      <div className="relative h-full w-full overflow-hidden rounded-screen bg-[var(--color-surface)]">
        <StatusBar />
        <Navigation
          transform={transform}
          page={page}
          onSelect={onSelect}
          ref={wrapRef}
        />
        <Content
          page={page}
          mapFilters={mapFilters}
          onMapFiltersChange={setMapFilters}
          groupChats={groupChats}
          setGroupChats={setGroupChats}
          activeGroupUsers={activeGroupUsers}
        />
        {showMessageInput && <MessageInput showAIAssistant={showAIAssistant} />}
      </div>
    </div>
  );
}

// ----------------------------
// Lightweight Runtime Testcases
// ----------------------------
// These tests run immediately on import. They are intentionally tiny and safe
// for the sandbox. If any fail, an error will be thrown to surface the problem.
(function runInlineTests() {
  const expect = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(`Test failed: ${msg}`);
  };

  // Test 1: navTransform correctness
  expect(navTransform(0) === "translateX(-0px)", "navTransform(0)");
  expect(navTransform(375) === "translateX(-375px)", "navTransform(375)");

  // Test 2: clampNavPosition correctness
  expect(clampNavPosition(-100) === 0, "clampNavPosition(-100)");
  expect(clampNavPosition(100) === 100, "clampNavPosition(100)");
  expect(clampNavPosition(500) === 375, "clampNavPosition(500)");

  // Test 2: PageId coverage for nav groups
  const all: PageId[] = [
    "map",
    "places",
    "filter",
    "categories",
    "profile",
    "chat",
    "groups",
    "social",
    "notifications",
    "vip",
    "settings",
  ];
  [...chatPages, ...mapPages].forEach((id) =>
    expect(all.includes(id), `Unknown PageId in groups: ${id}`)
  );

  // Test 3: VIP and Settings are accessible from both nav sections (by definition here)
  expect(mapPages.includes("vip"), '"vip" should be in mapPages');
  expect(chatPages.includes("vip"), '"vip" should be in chatPages');

  // Test 4: sectionForPage respects chat/map groupings
  expect(sectionForPage("map") === 0, "Map should be in section 0");
  expect(sectionForPage("chat") === 1, "Chat should be in section 1");

  // If we got here, tests passed.
  if (typeof console !== "undefined")
    console.log("AppPhoneMock inline tests passed ✅");
})();
