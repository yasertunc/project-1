import type { TestRunnerConfig } from "@storybook/test-runner";

const disableAnimations = `
  *{animation:none!important;transition:none!important}
  html{scroll-behavior:auto!important}
`;

const demoteSkipLink = `
  (() => {
    const SELECTOR = 'a.sr-only[href="#main"]';
    const apply = (root = document) => {
      root.querySelectorAll(SELECTOR).forEach((el) => {
        el.setAttribute('data-ci-skiplink', 'true');
        el.tabIndex = -1;
        el.setAttribute('aria-hidden', 'true');
        if (el === document.activeElement) {
          el.blur();
        }
      });
    };
    apply();
    const obs = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            apply(node);
          }
        });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  })();
`;

export default {
  async prepare({ page }) {
    await page.addStyleTag({ content: disableAnimations });
    await page.addInitScript(demoteSkipLink);
    await page.evaluate(demoteSkipLink);
  },
} satisfies TestRunnerConfig;
