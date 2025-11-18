import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

const theme = create({
  base: "light",
  brandTitle: "Fellowus UI",
  brandUrl: "https://www.fellowus.com",
  brandImage: "/brand/fellowus-logo-blue.png",
  brandTarget: "_self",
});

addons.setConfig({ theme });
