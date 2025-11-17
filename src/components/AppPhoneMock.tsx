import React, { useEffect, useMemo, useRef, useState } from "react";

// NOTE: Removed the missing import "../styles/tokens.css" and inlined the essential
// token variables and utility classes so this runs in a sandbox without external files.
// Updated to match v2.0.0 specification tokens.
const TOKEN_CSS = `
  :root {
    --color-text: #333333;
    --color-text-2: #666666;
    --color-text-3: #999999;
    --color-text-primary: #333333;
    --color-text-secondary: #666666;
    --color-text-tertiary: #999999;
    --color-text-disabled: #cccccc;
    --color-bg-light: #f5f7fa;
    --color-bg-medium: #e3e9f3;
    --color-bg-dark: #1a1a1a;
    --color-background-light: #f5f7fa;
    --color-background-medium: #e3e9f3;
    --color-background-dark: #1a1a1a;
    --color-surface: #ffffff;
    --color-surface-white: #ffffff;
    --color-surface-gray: #f8f9fa;
    --color-primary-main: #667eea;
    --color-primary-dark: #764ba2;
    --color-primary-light: #8b9ef8;
    --color-vip-main: #ffd700;
    --color-vip-dark: #ffa500;
    --color-vip-light: #ffe44d;
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-vip: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    --shadow-colored: 0 4px 12px rgba(102, 126, 234, 0.4);
    --shadow-colored-vip: 0 4px 12px rgba(255, 193, 7, 0.4);
    --shadow-colored-success: 0 4px 12px rgba(38, 222, 129, 0.4);
  }

  * { box-sizing: border-box; }

  .bg-gradient-primary { background-image: var(--gradient-primary); }
  .bg-gradient-vip { background-image: var(--gradient-vip); }
  .rounded-phone { border-radius: 40px; }
  .rounded-screen { border-radius: 30px; }

  .vip-button {
    background-image: var(--gradient-vip);
    border-radius: 0;
    isolation: isolate;
    overflow: hidden;
    position: relative;
  }
  .vip-button::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: vip-shine 3s infinite;
    opacity: 0.9;
    pointer-events: none;
  }

  .ai-floating {
    position: absolute;
    isolation: isolate;
  }
  .ai-floating::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 999px;
    background: radial-gradient(
      rgba(102, 126, 234, 0.35),
      rgba(102, 126, 234, 0)
    );
    animation: ai-pulse 2s ease-in-out infinite;
    pointer-events: none;
    opacity: 0.7;
    transform: scale(0.9);
  }
  .ai-floating:hover::after,
  .ai-floating:active::after {
    animation-play-state: paused;
    opacity: 0.4;
  }

  @keyframes vip-shine {
    0%   { transform: translateX(-100%); }
    50%  { transform: translateX(150%); }
    100% { transform: translateX(200%); }
  }

  @keyframes ai-pulse {
    0%   { transform: scale(0.9); opacity: 0.6; }
    60%  { transform: scale(1.4); opacity: 0; }
    100% { transform: scale(0.9); opacity: 0; }
  }

  @keyframes slideIn {
    from { transform: translateY(4px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }
`;

function TokenStyles() {
  return <style dangerouslySetInnerHTML={{ __html: TOKEN_CSS }} />;
}

export type PageId =
  | "map"
  | "places"
  | "filter"
  | "categories"
  | "chat"
  | "groups"
  | "social"
  | "notifications"
  | "vip"
  | "settings";

export type AppPhoneMockProps = {
  /**
   * Page that should be displayed on initial render.
   * Defaults to the map section to mirror the product brief.
   */
  initialPage?: PageId;
  /**
   * Allows stories to declutter the mock when explaining copy or IA.
   */
  showAIAssistant?: boolean;
  /**
   * Allows stories to show “above the fold” layout without the input chrome.
   */
  showMessageInput?: boolean;
};

const NAV_WIDTH = 375;
const SWIPE_THRESHOLD = 187.5;
const chatPages: PageId[] = [
  "chat",
  "groups",
  "social",
  "notifications",
  "vip",
  "settings",
];
const mapPages: PageId[] = [
  "map",
  "places",
  "filter",
  "categories",
  "vip",
  "settings",
];

const navMenus: Array<[PageId, string][]> = [
  [
    ["map", "MAP"],
    ["places", "PLACES"],
    ["filter", "FILTER"],
    ["categories", "CATEGORIES"],
  ],
  [
    ["chat", "CHAT"],
    ["groups", "GROUPS"],
    ["social", "SOCIAL"],
    ["notifications", "NOTIFICATIONS"],
  ],
];

// Small helpers so we can unit test important derived values.
function navTransform(section: number) {
  return `translateX(-${section * NAV_WIDTH}px)`;
}

function sectionForPage(page: PageId) {
  return chatPages.includes(page) ? 1 : 0;
}

function StatusBar() {
  return (
    <div className="flex h-[44px] items-center justify-between border-b border-[#e0e0e0] bg-[#f8f9fa] px-5 text-[14px] text-[var(--color-text)]">
      <span className="font-semibold">09:41</span>
      <span className="flex gap-1">📶 📡 🔋</span>
    </div>
  );
}

type NavigationProps = {
  transform: string;
  page: PageId;
  section: number;
  onSelect: (id: PageId) => void;
  onSectionChange: (section: number) => void;
};

const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  function Navigation(
    { transform, page, section, onSelect, onSectionChange },
    ref
  ) {
    return (
      <div className="relative h-[60px] overflow-hidden bg-gradient-primary shadow-[0_4px_15px_rgba(102,126,234,0.3)]">
        <div
          ref={ref}
          className="flex h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform }}
        >
          {navMenus.map((menu, index) => (
            <div
              key={index}
              className="flex w-[375px] min-w-[375px] justify-between"
            >
              {menu.map(([id, label]) => (
                <NavButton
                  key={id}
                  id={id}
                  label={label}
                  active={page === id}
                  onSelect={onSelect}
                />
              ))}
              <VipButton onSelect={onSelect} />
              <SettingsButton onSelect={onSelect} />
            </div>
          ))}
        </div>
        <NavIndicators current={section} onClick={setNavSection} />
      </div>
    );

    function setNavSection(section: number) {
      if (section === 0) {
        onSectionChange(0);
        onSelect(mapPages[0]);
      }
      if (section === 1) {
        onSectionChange(1);
        onSelect(chatPages[0]);
      }
    }
  }
);

function NavIndicators({
  current,
  onClick,
}: {
  current: number;
  onClick: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-[5px] left-1/2 flex -translate-x-1/2 gap-[6px]">
      {[0, 1].map((index) => (
        <div
          key={index}
          role="button"
          tabIndex={0}
          onClick={() => onClick(index)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClick(index);
            }
          }}
          className={`h-[6px] cursor-pointer rounded-full transition-all ${
            current === index ? "w-[18px] bg-white/80" : "w-[6px] bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}

function NavButton({
  id,
  label,
  active,
  onSelect,
}: {
  id: PageId;
  label: string;
  active: boolean;
  onSelect: (id: PageId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`px-[12px] py-[15px] text-[13px] font-semibold uppercase tracking-[0.06em] transition ${
        active
          ? "border-b-2 border-white bg-white/20 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function VipButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect("vip")}
      className="vip-button bg-gradient-vip px-[8px] py-[15px] text-[13px] font-bold uppercase tracking-[0.06em] text-white"
    >
      <span className="relative z-[1]">VIP</span>
    </button>
  );
}

function SettingsButton({ onSelect }: { onSelect: (id: PageId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect("settings")}
      className="w-[45px] py-[15px] text-[22px] font-bold text-white"
    >
      ⚙
    </button>
  );
}

function Content({ page }: { page: PageId }) {
  return (
    <div
      className="relative"
      style={{ height: "calc(100% - 44px - 60px - 70px)" }}
    >
      <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-[var(--color-bg-light)] to-[var(--color-bg-medium)]">
        {page === "map" && <MapView />}
        {page === "places" && (
          <Section title="Nearby Places" subtitle="Locations closest to you">
            <GridTwo>
              {[
                ["🏪", "Market", "3 nearby locations"],
                ["☕", "Cafe", "5 nearby locations"],
                ["🏥", "Hospital", "1 nearby location"],
                ["⛽", "Gas Station", "2 nearby locations"],
                ["🏦", "Bank/ATM", "4 nearby locations"],
                ["🍕", "Restaurant", "8 nearby locations"],
              ].map(([icon, name, count]) => (
                <Card key={name} icon={icon} title={name} description={count} />
              ))}
            </GridTwo>
          </Section>
        )}
        {page === "filter" && (
          <Section title="Filter" subtitle="Customize what appears on the map">
            <FilterGroup
              title="Distance"
              options={["Within 500 m", "Within 1 km", "Within 2 km"]}
              activeIndex={1}
            />
            <FilterGroup
              title="Users"
              options={["Online users", "VIP users", "Friends"]}
              activeIndex={0}
            />
          </Section>
        )}
        {page === "categories" && (
          <Section
            title="Categories"
            subtitle="Select the topics you care about"
          >
            {[
              ["🍔", "Food & Drink", "Restaurants, cafes, and bars"],
              ["🛍️", "Shopping", "Stores and shopping malls"],
              ["🎬", "Entertainment", "Cinema, theatre, and events"],
              ["🏋️", "Fitness & Wellness", "Gyms and health centers"],
              ["🎓", "Education", "Schools and courses"],
            ].map(([icon, title, description]) => (
              <CategoryRow
                key={title}
                icon={icon}
                title={title}
                description={description}
              />
            ))}
          </Section>
        )}
        {page === "chat" && <ChatView />}
        {page === "groups" && (
          <Section title="Groups" subtitle="Active group chats">
            {[
              ["👥", "Project Team", "Ahmet: The meeting starts soon…", "3"],
              ["🎉", "Friends", "Zeynep: Shall we meet this weekend?", "5"],
              ["💼", "Work Group", "Manager: Is the report ready?", ""],
              ["🏠", "Family", "Mom: Come home for dinner", "1"],
            ].map(([icon, title, description, badge]) => (
              <GroupRow
                key={title}
                icon={icon}
                title={title}
                description={description}
                badge={badge}
              />
            ))}
          </Section>
        )}
        {page === "social" && <SocialFeed />}
        {page === "notifications" && (
          <Section title="Notifications" subtitle="Latest activity">
            {[
              [
                "💬",
                "Ahmet sent you a message",
                "5 minutes ago",
                "#667eea",
                "rgba(102,126,234,.1)",
              ],
              [
                "❤️",
                "Zeynep liked your post",
                "1 hour ago",
                "#ff4444",
                "rgba(255,68,68,.1)",
              ],
              [
                "➕",
                "Can started following you",
                "2 hours ago",
                "#4CAF50",
                "rgba(76,175,80,.1)",
              ],
              [
                "💬",
                "New message in Project Team",
                "3 hours ago",
                "#667eea",
                "rgba(102,126,234,.1)",
              ],
            ].map(([icon, title, time, color, background]) => (
              <NotificationRow
                key={title}
                icon={icon}
                title={title}
                time={time}
                iconColor={color}
                background={background}
              />
            ))}
          </Section>
        )}
        {page === "vip" && <VipSection />}
        {page === "settings" && <Settings />}
      </div>
    </div>
  );
}

function MapView() {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute left-[15px] top-[15px] z-10 grid h-[50px] w-[50px] place-items-center rounded-full bg-[var(--color-surface-white)] shadow-md">
        🧭
      </div>
      <div className="absolute right-[15px] top-[15px] z-10 grid h-[50px] w-[50px] place-items-center rounded-full bg-[var(--color-surface-white)] shadow-md">
        👥
        <div className="absolute -right-[5px] -top-[5px] grid min-w-[20px] place-items-center rounded-full bg-[#ff4444] px-2 text-[12px] font-bold text-white">
          7
        </div>
      </div>
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,transparent,transparent_35px,rgba(255,255,255,.05)_35px,rgba(255,255,255,.05)_70px),repeating-linear-gradient(90deg,transparent,transparent_35px,rgba(255,255,255,.05)_35px,rgba(255,255,255,.05)_70px)]" />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,#ffd700_0%,#ffed4e_50%,#ffd700_100%)] shadow-[0_3px_10px_rgba(255,215,0,.4)]">
        <div className="h-[25px]" />
      </div>
      <div className="absolute top-0 bottom-0 left-[40%] w-[25px] bg-[linear-gradient(90deg,#ffd700_0%,#ffed4e_50%,#ffd700_100%)] shadow-[0_3px_10px_rgba(255,215,0,.4)]" />
      <Building left="20px" top="20px" width="120px" height="180px" />
      <Building right="20px" top="20px" width="140px" height="160px" />
      <Building left="20px" bottom="120px" width="100px" height="120px" />
      <Building right="20px" bottom="120px" width="130px" height="140px" />
      <Park left="30px" top="220px" size="80px" />
      <Park right="40px" top="320px" size="100px" />
      <div className="absolute bottom-[70px] left-0 right-0 h-[50px] bg-[linear-gradient(90deg,#74b9ff,#0984e3,#74b9ff)] shadow-[-0_4px_12px_rgba(9,132,227,.3)]" />
      <Pin
        icon="🏛️"
        top="80px"
        left="50px"
        background="linear-gradient(135deg,#ff6b6b,#ee5a24)"
      />
      <Pin
        icon="💰"
        top="80px"
        right="80px"
        background="linear-gradient(135deg,#26de81,#20bf6b)"
      />
      <Pin
        icon="🏥"
        top="200px"
        right="180px"
        background="linear-gradient(135deg,#4ecdc4,#44a3aa)"
      />
      <Pin
        icon="🍴"
        bottom="200px"
        left="80px"
        background="linear-gradient(135deg,#a55eea,#8854d0)"
      />
      <Pin
        icon="⛽"
        bottom="200px"
        right="60px"
        background="linear-gradient(135deg,#fc5c65,#eb3b5a)"
      />
      <div className="absolute left-1/2 top-1/2 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2">
        <div className="h-full w-full rounded-full border-[3px] border-[#4285F4] bg-[rgba(66,133,244,.15)]" />
        <div className="absolute left-1/2 top-1/2 h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]" />
      </div>
    </div>
  );
}

function Building({
  left,
  right,
  top,
  bottom,
  width,
  height,
}: {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  width: string;
  height: string;
}) {
  return (
    <div
      className="absolute rounded-lg bg-[linear-gradient(135deg,#ffeaa7,#fdcb6e)] shadow"
      style={{ left, right, top, bottom, width, height }}
    />
  );
}

function Park({
  left,
  right,
  top,
  size,
}: {
  left?: string;
  right?: string;
  top: string;
  size: string;
}) {
  return (
    <div
      className="absolute rounded-full bg-[linear-gradient(135deg,#55efc4,#00b894)] shadow-[0_4px_12px_rgba(0,184,148,.3)]"
      style={{ left, right, top, width: size, height: size }}
    />
  );
}

function Pin({
  icon,
  top,
  right,
  bottom,
  left,
  background,
}: {
  icon: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  background: string;
}) {
  return (
    <div
      className="absolute h-[60px] w-[50px] cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110"
      style={{ top, right, bottom, left }}
    >
      <div className="relative flex h-full w-full items-center justify-center text-[24px] text-white drop-shadow">
        <div
          className="absolute top-0 left-1/2 h-[45px] w-[45px] -ml-[22.5px] -rotate-45 rounded-[50%_50%_50%_0]"
          style={{ background }}
        />
        <div className="relative z-[1] rotate-45">{icon}</div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-[15px] bg-[var(--color-surface-white)] p-5 shadow">
        <div className="mb-1 text-[24px] font-bold text-[var(--color-text)]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[14px] text-[var(--color-text-2)]">
            {subtitle}
          </div>
        )}
      </div>
      <div className="px-[15px]">{children}</div>
    </div>
  );
}

function GridTwo({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-[15px]">{children}</div>;
}

function Card({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[12px] bg-[var(--color-surface-white)] p-[15px] shadow transition hover:-translate-y-[2px]">
      <div className="mb-2 text-[32px]">{icon}</div>
      <div className="mb-1 font-semibold text-[var(--color-text)]">{title}</div>
      <div className="text-[12px] text-[var(--color-text-2)]">
        {description}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  activeIndex = 0,
}: {
  title: string;
  options: string[];
  activeIndex?: number;
}) {
  return (
    <div className="m-[15px] rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow">
      <div className="mb-[15px] font-semibold text-[var(--color-text)]">
        {title}
      </div>
      {options.map((option, index) => (
        <div
          key={option}
          className={`mb-2 flex cursor-pointer items-center justify-between rounded-[8px] p-3 transition ${
            index === activeIndex
              ? "bg-gradient-primary text-white"
              : "bg-[var(--color-bg-light)] hover:bg-[#e8ecf4]"
          }`}
        >
          <span>{option}</span>
          <div
            className={`relative h-6 w-11 rounded-[12px] transition ${index === activeIndex ? "bg-[#4CAF50]" : "bg-[#ddd]"}`}
          >
            <div
              className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-[var(--color-surface-white)] transition ${index === activeIndex ? "translate-x-[20px]" : ""}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow transition hover:translate-x-[5px]">
      <div className="mr-[15px] grid h-[50px] w-[50px] place-items-center rounded-[12px] bg-gradient-to-br from-[var(--color-bg-light)] to-[var(--color-bg-medium)] text-[28px]">
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 font-semibold text-[var(--color-text)]">
          {title}
        </div>
        <div className="text-[12px] text-[var(--color-text-2)]">
          {description}
        </div>
      </div>
    </div>
  );
}

function ChatView() {
  return (
    <div className="h-full p-[15px]">
      {[
        ["A", "Merhaba! Bugün nasılsın? 😊"],
        ["Z", "Toplantı saat 15:00'te başlayacak"],
        ["M", "Dosyaları gönderdim ✅"],
      ].map(([avatar, message], index) => (
        <div
          key={index}
          className="mb-5 flex items-start animate-[slideIn_.3s_ease]"
        >
          <div className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--color-primary-main)] to-[var(--color-primary-dark)] text-white font-bold">
            {avatar}
          </div>
          <div className="rounded-[18px] rounded-tl-[4px] bg-[var(--color-surface-white)] px-[15px] py-[12px] shadow">
            {message}
          </div>
        </div>
      ))}
    </div>
  );
}

function GroupRow({
  icon,
  title,
  description,
  badge,
}: {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="mb-3 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-[15px] shadow">
      <div className="mr-[15px] grid h-[50px] w-[50px] place-items-center rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white font-bold">
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 font-semibold text-[var(--color-text)]">
          {title}
        </div>
        <div className="text-[13px] text-[var(--color-text-2)]">
          {description}
        </div>
      </div>
      {badge && (
        <div className="rounded-[10px] bg-[#ff4444] px-2 py-[2px] text-[11px] text-white">
          {badge}
        </div>
      )}
    </div>
  );
}

function SocialFeed() {
  return (
    <Section title="Social Feed" subtitle="Updates from your friends">
      <div className="mb-4 overflow-hidden rounded-[12px] bg-[var(--color-surface-white)] shadow">
        <div className="flex items-center p-[15px]">
          <div className="mr-3 h-10 w-10 rounded-full bg-gradient-to-br from-[#f093fb] to-[#f5576c]" />
          <div className="flex-1">
            <div className="mb-[2px] font-semibold text-[var(--color-text)]">
              Ayşe Yılmaz
            </div>
            <div className="text-[12px] text-[var(--color-text-2)]">
              2 hours ago
            </div>
          </div>
        </div>
        <div className="px-[15px] pb-[15px]">
          What a beautiful day! ☀️ Enjoying coffee by the seaside.
        </div>
        <div className="grid h-[200px] w-full place-items-center bg-gradient-to-br from-[var(--color-bg-medium)] to-[var(--color-bg-light)] text-[48px] text-[#ddd]">
          📷
        </div>
        <div className="flex justify-around border-t border-[#f0f0f0] p-[15px] text-[var(--color-text-2)]">
          <div>❤️ 42</div>
          <div>💬 8</div>
          <div>📤 Share</div>
        </div>
      </div>
    </Section>
  );
}

function NotificationRow({
  icon,
  title,
  time,
  iconColor,
  background,
}: {
  icon: string;
  title: string;
  time: string;
  iconColor: string;
  background: string;
}) {
  return (
    <div className="mb-3 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-[15px] shadow">
      <div
        className="mr-3 grid h-10 w-10 place-items-center rounded-full"
        style={{ background, color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 text-[var(--color-text)]">
          <strong>{title.split(" ")[0]}</strong>{" "}
          {title.split(" ").slice(1).join(" ")}
        </div>
        <div className="text-[12px] text-[var(--color-text-2)]">{time}</div>
      </div>
    </div>
  );
}

function VipSection() {
  return (
    <div className="p-5 text-center">
      <div className="my-[30px] text-[64px]">👑</div>
      <div className="mb-2 bg-gradient-to-br from-[#FFD700] to-[#FFA500] bg-clip-text text-[28px] font-bold text-transparent">
        VIP Membership
      </div>
      <div className="mb-6 text-[14px] text-[var(--color-text-2)]">
        Enjoy premium features and priority access
      </div>
      {[
        ["✨", "Unlimited Messaging", "No daily message limits"],
        ["🎯", "Advanced Filters", "Fine-tune discovery and matching"],
        ["🔒", "Stealth Mode", "Keep your profile hidden"],
        ["🚀", "Priority Support", "24/7 VIP assistance"],
      ].map(([icon, title, description]) => (
        <div
          key={title}
          className="mb-4 flex items-center rounded-[12px] bg-[var(--color-surface-white)] p-5 shadow"
        >
          <div className="mr-4 w-10 text-[24px]">{icon}</div>
          <div className="text-left">
            <div className="mb-1 font-semibold text-[var(--color-text)]">
              {title}
            </div>
            <div className="text-[12px] text-[var(--color-text-2)]">
              {description}
            </div>
          </div>
        </div>
      ))}
      <button className="mt-2 rounded-[25px] bg-gradient-to-br from-[#FFD700] to-[#FFA500] px-10 py-3 font-semibold text-white shadow-[0_4px_12px_rgba(255,193,7,.4)]">
        Become VIP
      </button>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <SettingsGroup
        title="Account"
        items={[
          ["👤", "Profile"],
          ["🔐", "Privacy"],
          ["🔑", "Security"],
        ]}
      />
      <SettingsGroup
        title="Notifications"
        toggles={[
          ["🔔", "Message Notifications", true],
          ["📢", "Social Notifications", false],
        ]}
      />
      <SettingsGroup
        title="Other"
        pairs={[
          ["🌐", "Language", "Turkish"],
          ["ℹ️", "About", "v1.0.0"],
        ]}
      />
    </div>
  );
}

type SettingsGroupProps = {
  title: string;
  items?: [string, string][];
  toggles?: [string, string, boolean][];
  pairs?: [string, string, string][];
};

function SettingsGroup({ title, items, toggles, pairs }: SettingsGroupProps) {
  return (
    <div className="mx-[15px] mb-[15px] overflow-hidden rounded-[12px] bg-[var(--color-surface-white)] shadow">
      <div className="border-b border-[#f0f0f0] p-[15px] font-semibold text-[#667eea]">
        {title}
      </div>
      {items?.map(([icon, label]) => (
        <SettingsRow key={label} icon={icon} label={label} />
      ))}
      {toggles?.map(([icon, label, active]) => (
        <ToggleRow key={label} icon={icon} label={label} active={active} />
      ))}
      {pairs?.map(([icon, label, value]) => (
        <SettingsRow key={label} icon={icon} label={label} value={value} />
      ))}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex cursor-pointer items-center justify-between p-[15px] transition hover:bg-[var(--color-bg-light)]">
      <div className="flex items-center gap-3">
        <span className="w-[30px] text-[20px]">{icon}</span>
        <span className="text-[var(--color-text)]">{label}</span>
      </div>
      <span className="text-[var(--color-text-2)]">{value ?? "›"}</span>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-[15px]">
      <div className="flex items-center gap-3">
        <span className="w-[30px] text-[20px]">{icon}</span>
        <span className="text-[var(--color-text)]">{label}</span>
      </div>
      <div
        className={`relative h-6 w-11 rounded-[12px] transition ${active ? "bg-[#4CAF50]" : "bg-[#ddd]"}`}
      >
        <div
          className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-[var(--color-surface-white)] transition ${active ? "translate-x-[20px]" : ""}`}
        />
      </div>
    </div>
  );
}

function AiAssistantButton() {
  return (
    <button
      type="button"
      aria-label="AI Assistant"
      className="ai-floating absolute bottom-[85px] right-[20px] z-[999] grid h-[56px] w-[56px] place-items-center rounded-full bg-gradient-primary text-white shadow-[var(--shadow-colored)] transition hover:scale-105 active:scale-95"
    >
      <span className="font-bold tracking-wide">AI</span>
    </button>
  );
}

function MessageInput() {
  return (
    <div className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-[var(--color-surface)] p-[15px] shadow-[0_-4px_20px_rgba(0,0,0,.1)]">
      <div className="flex items-center gap-[10px] rounded-[12px] bg-[var(--color-bg-light)] p-[12px]">
        <span className="text-[22px] text-[var(--color-text-3)]">📎</span>
        <input
          className="flex-1 bg-transparent text-[16px] text-[var(--color-text)] outline-none"
          placeholder="Type your message..."
        />
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[10px] bg-gradient-primary"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function AppPhoneMock({
  initialPage = "map",
  showAIAssistant = true,
  showMessageInput = true,
}: AppPhoneMockProps) {
  const [navSection, setNavSection] = useState(() =>
    sectionForPage(initialPage)
  );
  const [page, setPage] = useState<PageId>(initialPage);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    currentSection: number;
    hasMoved: boolean;
  }>({
    pointerId: null,
    startX: 0,
    currentSection: 0,
    hasMoved: false,
  });
  const navSectionRef = useRef(navSection);

  useEffect(() => {
    navSectionRef.current = navSection;
  }, [navSection]);

  useEffect(() => {
    setPage(initialPage);
    setNavSection(sectionForPage(initialPage));
  }, [initialPage]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragStateRef.current.pointerId = event.pointerId;
      dragStateRef.current.startX = event.clientX;
      dragStateRef.current.currentSection = navSectionRef.current;
      dragStateRef.current.hasMoved = false;
      el.style.transition = "none";
      el.style.willChange = "transform";
      el.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (dragStateRef.current.pointerId !== event.pointerId) return;
      const delta = event.clientX - dragStateRef.current.startX;
      if (!dragStateRef.current.hasMoved && Math.abs(delta) > 6) {
        dragStateRef.current.hasMoved = true;
      }
      if (!dragStateRef.current.hasMoved) return;
      const offset = -dragStateRef.current.currentSection * NAV_WIDTH + delta;
      el.style.transform = `translateX(${offset}px)`;
    };

    const finishDrag = (event: PointerEvent) => {
      if (dragStateRef.current.pointerId !== event.pointerId) return;
      el.releasePointerCapture(event.pointerId);
      el.style.transition = "";
      el.style.willChange = "";

      const delta = event.clientX - dragStateRef.current.startX;
      const moved = dragStateRef.current.hasMoved;
      const originSection = dragStateRef.current.currentSection;
      dragStateRef.current.pointerId = null;
      dragStateRef.current.hasMoved = false;

      if (!moved) {
        el.style.transform = navTransform(originSection);
        return;
      }

      if (Math.abs(delta) >= SWIPE_THRESHOLD) {
        if (delta < 0 && originSection < 1) {
          setNavSection(1);
          return;
        }
        if (delta > 0 && originSection > 0) {
          setNavSection(0);
          return;
        }
      }

      el.style.transform = navTransform(originSection);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", finishDrag);
    el.addEventListener("pointercancel", finishDrag);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", finishDrag);
      el.removeEventListener("pointercancel", finishDrag);
    };
  }, []);

  const onSelect = (id: PageId) => {
    setPage(id);
    if (chatPages.includes(id)) setNavSection(1);
    if (mapPages.includes(id)) setNavSection(0);
  };

  const transform = useMemo(() => navTransform(navSection), [navSection]);

  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden rounded-phone bg-[var(--color-bg-dark)] p-2 shadow-[0_25px_50px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2),_inset_0_0_0_1px_rgba(255,255,255,0.1)]">
      {/* Inline token styles so the component is self-contained in the sandbox */}
      <TokenStyles />
      <div className="relative h-full w-full overflow-hidden rounded-screen bg-[var(--color-surface)]">
        <StatusBar />
        <Navigation
          transform={transform}
          page={page}
          section={navSection}
          onSelect={onSelect}
          onSectionChange={setNavSection}
          ref={wrapRef}
        />
        <Content page={page} />
        {showAIAssistant && <AiAssistantButton />}
        {showMessageInput && <MessageInput />}
      </div>
    </div>
  );
}

// ----------------------------
// Lightweight Runtime Testcases
// ----------------------------
// These tests run immediately on import. They are intentionally tiny and safe
// for the sandbox. If any fail, an error will be thrown to surface the problem.
(function runInlineTests() {
  const expect = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(`Test failed: ${msg}`);
  };

  // Test 1: navTransform correctness
  expect(navTransform(0) === "translateX(-0px)", "navTransform(0)");
  expect(navTransform(1) === "translateX(-375px)", "navTransform(1)");

  // Test 2: PageId coverage for nav groups
  const all: PageId[] = [
    "map",
    "places",
    "filter",
    "categories",
    "chat",
    "groups",
    "social",
    "notifications",
    "vip",
    "settings",
  ];
  [...chatPages, ...mapPages].forEach((id) =>
    expect(all.includes(id), `Unknown PageId in groups: ${id}`)
  );

  // Test 3: VIP and Settings are accessible from both nav sections (by definition here)
  expect(mapPages.includes("vip"), '"vip" should be in mapPages');
  expect(chatPages.includes("vip"), '"vip" should be in chatPages');

  // Test 4: sectionForPage respects chat/map groupings
  expect(sectionForPage("map") === 0, "Map should be in section 0");
  expect(sectionForPage("chat") === 1, "Chat should be in section 1");

  // If we got here, tests passed.
  if (typeof console !== "undefined")
    console.log("AppPhoneMock inline tests passed ✅");
})();
