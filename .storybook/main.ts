import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    if (process.env.ANALYZE === "true") {
      const visualizerModule = await import("rollup-plugin-visualizer");
      const pluginFactory =
        typeof visualizerModule.default === "function"
          ? visualizerModule.default
          : visualizerModule.visualizer;
      if (typeof pluginFactory === "function") {
        config.plugins = [
          ...(config.plugins ?? []),
          pluginFactory({
            open: false,
            filename: "storybook-static/stats.html",
          }),
        ];
      }
    }
    return config;
  },
};

export default config;
