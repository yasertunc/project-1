module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [
      // daima en sonda:
      "react-native-reanimated/plugin",
    ],
  };
};
