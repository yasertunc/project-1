type DetoxConfig = Record<string, unknown>;

const config: DetoxConfig = {
  testRunner: {
    type: "jest",
    args: {
      $0: "jest",
      config: "detox/jest.config.js",
    },
  },
  artifacts: {
    rootDir: "detox/artifacts",
    plugins: {
      log: { enabled: true },
      screenshot: { enabled: true, keepOnlyFailedTestsArtifacts: true },
      video: { enabled: true, keepOnlyFailedTestsArtifacts: true },
    },
  },
  apps: {
    "android.release": {
      type: "android.apk",
      binaryPath: "artifacts/android/FellowusMobile-release.apk",
      build:
        "npx expo run:android --variant release --no-install && mkdir -p artifacts/android && copy dist/*.apk artifacts/android/FellowusMobile-release.apk",
    },
  },
  devices: {
    "pixel-6": {
      type: "android.emulator",
      device: {
        avdName: "Pixel_6_API_34",
      },
    },
  },
  configurations: {
    "android.emu.release": {
      device: "pixel-6",
      app: "android.release",
    },
  },
  behavior: {
    init: {
      exposeGlobals: true,
    },
  },
};

export default config;
