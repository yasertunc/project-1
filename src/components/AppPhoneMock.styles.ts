// Dynamic styles that cannot be moved to CSS due to runtime calculations
export const getNavigationStyle = (transform: string) => ({
  transform,
});

export const getContentStyle = () => ({
  height: "calc(100% - 44px - 60px - 70px)",
});
