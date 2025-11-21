/* Auto-generated from tokens_fellowus_v1.json. Do not edit by hand. */

export const palette = {
  primary: {
    main: "#667eea",
    dark: "#764ba2",
    light: "#8b9ef8",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  vip: {
    main: "#FFD700",
    dark: "#FFA500",
    light: "#FFE44D",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  },
  semantic: {
    success: "#26de81",
    error: "#ff4444",
    warning: "#FFA500",
    info: "#4285F4",
    online: "#26de81",
    offline: "#95a5a6",
  },
  background: {
    light: "#f5f7fa",
    medium: "#e3e9f3",
    dark: "#1a1a1a",
  },
  surface: {
    white: "#ffffff",
    gray: "#f8f9fa",
  },
  text: {
    primary: "#333333",
    secondary: "#666666",
    tertiary: "#999999",
    disabled: "#cccccc",
  },
  border: {
    light: "rgba(0,0,0,0.05)",
    medium: "rgba(0,0,0,0.1)",
    dark: "rgba(0,0,0,0.2)",
  },
  mapElements: {
    streets: "linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
    buildings: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
    parks: "linear-gradient(135deg, #55efc4 0%, #00b894 100%)",
    water: "linear-gradient(90deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)",
  },
  markers: {
    bank: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    money: "linear-gradient(135deg, #26de81 0%, #20bf6b 100%)",
    hospital: "linear-gradient(135deg, #4ecdc4 0%, #44a3aa 100%)",
    food: "linear-gradient(135deg, #a55eea 0%, #8854d0 100%)",
    gas: "linear-gradient(135deg, #fc5c65 0%, #eb3b5a 100%)",
  },
  shadows: {
    elevation0: "none",
    elevation1: "0 1px 3px rgba(0, 0, 0, 0.05)",
    elevation2: "0 2px 8px rgba(0, 0, 0, 0.08)",
    elevation3: "0 4px 12px rgba(0, 0, 0, 0.12)",
    elevation4: "0 6px 16px rgba(0, 0, 0, 0.15)",
    elevation5: "0 10px 20px rgba(0, 0, 0, 0.2)",
    elevation6: "0 25px 50px rgba(0, 0, 0, 0.3)",
    colored: "0 4px 12px rgba(102, 126, 234, 0.4)",
    coloredVip: "0 4px 12px rgba(255, 193, 7, 0.4)",
    coloredSuccess: "0 4px 12px rgba(38, 222, 129, 0.4)",
  },
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  none: "0",
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 25,
  round: "50%",
  phone: 40,
  screen: 30,
  card: 15,
  button: 10,
  input: 12,
} as const;

export const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  sizes: {
    xxl: 28,
    xl: 24,
    large: 20,
    title: 18,
    body: 16,
    medium: 14,
    small: 13,
    tiny: 12,
    micro: 11,
    nav: 13,
  },
  weights: {
    thin: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
} as const;

export const nativeTokens = {
  palette,
  spacing,
  radius,
  typography,
} as const;
