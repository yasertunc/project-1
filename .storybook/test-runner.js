// .storybook/test-runner.js
// A11Y ihlallerini otomatik olarak fail eden test runner ayarı.
// Bazı görsel-only hikayeleri (palette/contrast) hariç bırakıyoruz.

const config = {
  storybookUrl: "http://localhost:6006",
  async preVisit(page, context) {
    const id = context.id || "";
    const skipA11y =
      id.includes("tokens-palette") || id.includes("tokens-contrastgrid");
    if (skipA11y) {
      context.parameters = { ...context.parameters, a11y: { disable: true } };
    }
  },
};

module.exports = config;
