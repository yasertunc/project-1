import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-200 bg-white/60 backdrop-blur-sm"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
        <span>© {new Date().getFullYear()} Fellowus</span>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-6">
            <li>
              <a className="hover:underline" href="#features">
                Features
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
