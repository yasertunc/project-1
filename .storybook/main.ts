import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  staticDirs: ["../public"],
  features: {
    storyStoreV7: true,
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (baseConfig) => {
    const finalConfig = { ...baseConfig };

    if (process.env.ANALYZE === "true") {
      const visualizerModule = await import("rollup-plugin-visualizer");
      const pluginFactory =
        typeof visualizerModule.default === "function"
          ? visualizerModule.default
          : visualizerModule.visualizer;
      if (typeof pluginFactory === "function") {
        finalConfig.plugins = [
          ...(finalConfig.plugins ?? []),
          pluginFactory({
            open: false,
            filename: "storybook-static/stats.html",
          }),
        ];
      }
    }

    finalConfig.build = {
      ...(finalConfig.build ?? {}),
      chunkSizeWarningLimit: Math.max(
        finalConfig.build?.chunkSizeWarningLimit ?? 0,
        1500,
      ),
    };

    const existingExcludes = finalConfig.optimizeDeps?.exclude ?? [];
    finalConfig.optimizeDeps = {
      ...(finalConfig.optimizeDeps ?? {}),
      exclude: Array.from(
        new Set([...existingExcludes, "i18next-browser-languagedetector"]),
      ),
    };

    return finalConfig;
  },
};

export default config;
