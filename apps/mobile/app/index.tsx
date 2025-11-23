import React, { useMemo, useState } from "react";
import { SafeAreaView, StatusBar as RNStatusBar, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppPhoneMockNative, type PageId } from "../src/components/AppPhoneMock/AppPhoneMockNative";
import { nativeTokens } from "../src/theme/tokens";

export default function AppPhoneMockScreen() {
  const [currentPage, setCurrentPage] = useState<PageId>("map");
  const pages = useMemo<PageId[]>(() => ["map", "places", "filter", "categories", "chat", "groups", "social", "notifications", "vip", "settings"], []);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <RNStatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[nativeTokens.palette.primary.main, nativeTokens.palette.primary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />
      <View style={styles.content}>
        <AppPhoneMockNative
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pages={pages}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nativeTokens.palette.background.light,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
