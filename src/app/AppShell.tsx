import * as React from "react";

import "../styles/tokens.css";
import "../styles/globals.css";

import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { LogoSvg } from "../components/Brand/LogoSvg";
import { useResourceHints, type ResourceHint } from "../hooks/useResourceHints";
import { DOWNLOAD_URL } from "../lib/env";

type ThemeMode = "light" | "dark";

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage?.getItem("fellowus.theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<ThemeMode>(() => readStoredTheme());

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("fellowus.theme", theme);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [theme]);

  return (
    <button
      type="button"
      className="rounded-full bg-[color:var(--color-background-medium)] px-3 py-1.5 text-sm font-semibold text-[color:var(--color-text-primary)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-primary-main)] hover:bg-[color:var(--color-background-light)]"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
};

type AppShellProps = React.PropsWithChildren<{
  title?: string;
}>;

export const AppShell: React.FC<AppShellProps> = ({
  title = "Fellowus",
  children,
}) => {
  const handleSkip = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const main = document.getElementById("main");
      if (main) {
        event.preventDefault();
        main.focus();
      }
    },
    []
  );
  useResourceHints(
    React.useMemo<ResourceHint[]>(() => {
      if (typeof window === "undefined") return [];
      const downloadOrigin = (() => {
        try {
          return new URL(DOWNLOAD_URL, window.location.origin).origin;
        } catch {
          return undefined;
        }
      })();

      const hints: ResourceHint[] = [];

      if (downloadOrigin) {
        hints.push(
          { rel: "preconnect", href: downloadOrigin, crossOrigin: "anonymous" },
          { rel: "dns-prefetch", href: downloadOrigin }
        );
      }

      hints.push(
        {
          rel: "preconnect",
          href: "https://play.google.com",
          crossOrigin: "anonymous",
        },
        { rel: "dns-prefetch", href: "https://play.google.com" },
        {
          rel: "preconnect",
          href: "https://apps.apple.com",
          crossOrigin: "anonymous",
        },
        { rel: "dns-prefetch", href: "https://apps.apple.com" }
      );

      return hints;
    }, [])
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--color-background-light)] text-[color:var(--color-text-primary)] transition-colors duration-300 ease-[var(--animation-easing)]">
      <a
        href="#main"
        onClick={handleSkip}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 z-50 rounded-xl bg-white px-3 py-2 text-sm font-medium shadow"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 border-b border-white/20 bg-white/80 backdrop-blur-lg shadow-sm"
      >
        <div className="mx-auto flex max-w-5xl items-center gap-12 px-4 py-3">
          <LogoSvg size={32} title="Fellowus" />
          <h1 className="text-base font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-secondary)]">
            {title}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main"
        role="main"
        tabIndex={-1}
        className="mx-auto max-w-5xl px-4 py-6 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary-main)]"
      >
        {children}
      </main>

      <footer
        role="contentinfo"
        className="mx-auto max-w-5xl px-4 py-8 text-sm text-[color:var(--color-text-secondary)]"
      >
        <span>© {new Date().getFullYear()} Fellowus</span>
      </footer>
    </div>
  );
};
