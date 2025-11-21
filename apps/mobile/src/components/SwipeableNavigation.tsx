import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { nativeTokens } from "../theme/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NAV_WIDTH = SCREEN_WIDTH;
const SWIPE_THRESHOLD = SCREEN_WIDTH / 2;

export type PageId =
  | "map"
  | "places"
  | "search"
  | "filter"
  | "categories"
  | "profile"
  | "chat"
  | "groups"
  | "social"
  | "vip"
  | "settings"
  | "account"
  | "privacy"
  | "notifications-settings"
  | "appearance"
  | "help";

const navMenus: Array<[PageId, string][]> = [
  [
    ["map", "HARİTA"],
    ["places", "YERLER"],
    ["search", "ARA"],
    ["filter", "FİLTRE"],
  ],
  [
    ["social", "SOSYAL"],
    ["account", "HESAP"],
    ["notifications-settings", "BİLDİRİM"],
    ["appearance", "GÖRÜNÜM"],
    ["categories", "KATEGORİ"],
  ],
];

const chatPages: PageId[] = [
  "social",
  "account",
  "notifications-settings",
  "appearance",
  "categories",
  "profile",
  "chat",
  "groups",
  "vip",
  "settings",
  "privacy",
  "help",
];
const mapPages: PageId[] = [
  "map",
  "places",
  "search",
  "filter",
  "categories",
  "vip",
  "settings",
];

function sectionForPage(page: PageId): number {
  return chatPages.includes(page) ? 1 : 0;
}

type SwipeableNavigationProps = {
  currentPage: PageId;
  onPageSelect: (page: PageId) => void;
};

export function SwipeableNavigation({
  currentPage,
  onPageSelect,
}: SwipeableNavigationProps) {
  const [section, setSection] = useState(() => sectionForPage(currentPage));
  const pan = useRef(new Animated.Value(-section * NAV_WIDTH)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = -section * NAV_WIDTH + gestureState.dx;
        const clampedX = Math.max(-NAV_WIDTH, Math.min(0, newX));
        pan.setValue(clampedX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = SWIPE_THRESHOLD;
        const velocity = gestureState.vx;

        let newSection = section;
        if (Math.abs(gestureState.dx) > threshold || Math.abs(velocity) > 0.5) {
          if (gestureState.dx > 0 && section > 0) {
            newSection = section - 1;
          } else if (gestureState.dx < 0 && section < 1) {
            newSection = section + 1;
          }
        }

        Animated.spring(pan, {
          toValue: -newSection * NAV_WIDTH,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();

        if (newSection !== section) {
          setSection(newSection);
          const targetPage = newSection === 0 ? mapPages[0] : chatPages[0];
          onPageSelect(targetPage);
        } else {
          Animated.spring(pan, {
            toValue: -section * NAV_WIDTH,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleSectionChange = useCallback(
    (newSection: number) => {
      setSection(newSection);
      const targetPage = newSection === 0 ? mapPages[0] : chatPages[0];
      onPageSelect(targetPage);
      Animated.spring(pan, {
        toValue: -newSection * NAV_WIDTH,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    },
    [onPageSelect, pan]
  );

  useEffect(() => {
    const currentSection = sectionForPage(currentPage);
    if (currentSection !== section) {
      setSection(currentSection);
      Animated.spring(pan, {
        toValue: -currentSection * NAV_WIDTH,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [currentPage, section, pan]);

  return (
    <View
      style={{
        height: 60,
        backgroundColor: nativeTokens.palette.primary.main,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={[
          nativeTokens.palette.primary.main,
          nativeTokens.palette.primary.dark,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            flexDirection: "row",
            height: "100%",
            transform: [{ translateX: pan }],
          }}
        >
          {navMenus.map((menu, index) => (
            <View
              key={index}
              style={{
                width: NAV_WIDTH,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 8,
              }}
            >
              {menu.map(([id, label]) => (
                <NavButton
                  key={id}
                  id={id}
                  label={label}
                  active={currentPage === id}
                  onSelect={onPageSelect}
                />
              ))}
              {index === 0 && (
                <>
                  <VipButton onSelect={onPageSelect} />
                  <ProfileIconButton onSelect={onPageSelect} />
                </>
              )}
              {index === 1 && <SettingsButton onSelect={onPageSelect} />}
            </View>
          ))}
        </Animated.View>
        <NavIndicators current={section} onClick={handleSectionChange} />
      </LinearGradient>
    </View>
  );
}

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
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderBottomWidth: active ? 2 : 0,
        borderBottomColor: "#fff",
        backgroundColor: active ? "rgba(255,255,255,0.2)" : "transparent",
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: active ? "#fff" : "rgba(255,255,255,0.7)",
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function VipButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect("vip")}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 15,
        backgroundColor: nativeTokens.palette.vip.main,
        borderRadius: 0,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        VIP
      </Text>
    </TouchableOpacity>
  );
}

function ProfileIconButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect("profile")}
      style={{
        width: 45,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>👤</Text>
    </TouchableOpacity>
  );
}

function SettingsButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect("settings")}
      style={{
        width: 45,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff" }}>⚙</Text>
    </TouchableOpacity>
  );
}

function NavIndicators({
  current,
  onClick,
}: {
  current: number;
  onClick: (index: number) => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 5,
        left: "50%",
        transform: [{ translateX: -18 }],
        flexDirection: "row",
        gap: 6,
      }}
    >
      {[0, 1].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onClick(index)}
          style={{
            height: 6,
            width: current === index ? 18 : 6,
            borderRadius: 3,
            backgroundColor:
              current === index
                ? "rgba(255,255,255,0.8)"
                : "rgba(255,255,255,0.3)",
          }}
        />
      ))}
    </View>
  );
}

export { sectionForPage, chatPages, mapPages };
