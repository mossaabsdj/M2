"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

// ─────────────────────────────────────────────────────────
// DEFAULT CONFIG  (override via props)
// ─────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  brand: {
    name: "محمد بريوط",
    subtitle: "Prof Math ",
    logo: "MP",
  },

  theme: {
    primary: "#047857", // Darker green for header/nav (#047857)
    primaryDark: "#065f46", // Even darker green for hover (#065f46)
    primaryXDark: "#064e3b", // Darkest shade (#064e3b)
    primaryLight: "#bbf7d0", // Light green background (#bbf7d0)
    primaryMid: "#86efac", // Mid green for cards (#86efac)
    accent: "#10b981", // Emerald green for buttons (#10b981)
    accentLight: "#d1fae5", // Light accent background (#d1fae5)
    teal: "#0f766e", // Teal elements (#0f766e)
    white: "#047857", // White text/background (#ffffff)
    bg: "#f0fdf4", // Page background (#f0fdf4)
    muted: "#374151", // Dark gray text (#374151)
    muted2: "#6b7280", // Secondary text (#6b7280)
    border: "#d1fae5", // Borders (#d1fae5)
    borderMd: "#86efac", // Medium border (#86efac)
  },
  navAdmin: [
    { label: "الرئيسية", href: "" },
    { label: "إدارة الدروس", href: "" },
    { label: "إدارة المستخدمين", href: "" },
    { label: "الإعدادات", href: "" },
  ],
  navUser: [
    { label: "الرئيسية", href: "" },
    { label: "الإعدادات", href: "" },
  ],

  cta: {
    login: "دخول",
    signup: "انضم الآن",
  },

  userMenu: [
    { icon: "lessons", label: "دروسي", href: "#" },

    { icon: "settings", label: "الإعدادات", href: "#" },
  ],
  AdminMenu: [{ icon: "settings", label: "لوحة تحكم", href: "#" }],
};

// ─────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────
const Icons = {
  chevron: (cls = "") => (
    <svg
      className={cls}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  profile: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  lessons: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 8h10M7 12h6" />
    </svg>
  ),
  exercises: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  settings: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
    </svg>
  ),
  logout: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  menu: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  home: () => <span>🏠</span>,
  book: () => <span>📖</span>,
  pencil: () => <span>✏️</span>,
  chat: () => <span>💬</span>,
  user: () => <span>👤</span>,
  library: () => <span>📚</span>,
};

// ─────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 28, duration: 0.22 },
  },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15 } },
};

const mobileNavVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemFade = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const headerVariants = {
  top: { backgroundColor: "rgba(255,255,255,0.85)", boxShadow: "none" },
  scrolled: {
    backgroundColor: "rgba(255,255,255,0.97)",
    boxShadow: "0 4px 24px rgba(22,163,74,0.10)",
    transition: { duration: 0.3 },
  },
};

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

/** Rotating logo ring */
function BrandLogo({ logo, primary, accent }) {
  return (
    <div className="relative w-15 h-15 flex-shrink-0">
      <div
        className="absolute inset-[7px] rounded-[10px] flex items-center justify-center text-xl font-black text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primary}, ${accent})`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)",
          }}
        />
        <span className="relative z-10">{logo}</span>
      </div>
    </div>
  );
}

/** Levels mega dropdown */
function LevelsDropdown({ levels, theme, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-[calc(100%+12px)] right-[-16px] w-[430px] bg-white rounded-[20px] p-[18px] flex gap-3 z-[300] origin-top-right"
          style={{
            border: `1.5px solid ${theme.border}`,
            boxShadow:
              "0 16px 48px rgba(22,163,74,0.15), 0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* CEM Column */}
          <div className="flex-1">
            <div
              className="flex items-center gap-2 px-2 pb-3 mb-2"
              style={{ borderBottom: `1.5px solid ${theme.border}` }}
            >
              <span
                className="text-[0.62rem] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                style={{
                  background: theme.primaryLight,
                  color: theme.primaryXDark,
                }}
              >
                {levels.cem.label}
              </span>
            </div>
            {levels.cem.items.map((item) => (
              <motion.a
                key={item.badge}
                href={item.href}
                className="flex items-center gap-2 px-2 py-[9px] rounded-[10px] text-[0.84rem] font-medium no-underline mb-0.5 group"
                style={{ color: theme.muted }}
                whileHover={{
                  x: -3,
                  backgroundColor: theme.primaryLight,
                  color: theme.primaryXDark,
                }}
                transition={{ duration: 0.15 }}
              >
                <span
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                  style={{
                    background: theme.primaryLight,
                    color: theme.primaryXDark,
                  }}
                >
                  {item.badge}
                </span>
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Lycée Column */}
          <div className="flex-1">
            <div
              className="flex items-center gap-2 px-2 pb-3 mb-2"
              style={{ borderBottom: `1.5px solid ${theme.border}` }}
            >
              <span
                className="text-[0.62rem] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                style={{
                  background: theme.accentLight,
                  color: theme.primaryXDark,
                }}
              >
                {levels.lycee.label}
              </span>
            </div>
            {levels.lycee.items.map((item) => (
              <motion.a
                key={item.badge}
                href={item.href}
                className="flex items-center gap-2 px-2 py-[9px] rounded-[10px] text-[0.84rem] font-medium no-underline mb-0.5"
                style={{ color: theme.muted }}
                whileHover={{
                  x: -3,
                  backgroundColor: theme.accentLight,
                  color: theme.primaryXDark,
                }}
                transition={{ duration: 0.15 }}
              >
                <span
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                  style={{ background: theme.accentLight, color: theme.accent }}
                >
                  {item.badge}
                </span>
                {item.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** User dropdown */
function UserDropdown({
  userMenu,
  theme,
  setSelectedNav,
  isOpen,
  onLogout,
  logoutLabel = "تسجيل الخروج",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-[calc(100%+10px)] left-0 w-[215px] bg-white rounded-[16px] p-2 z-[300]"
          style={{
            border: `1.5px solid ${theme.border}`,
            boxShadow: "0 16px 48px rgba(22,163,74,0.15)",
          }}
        >
          {userMenu.map((item) => {
            const Icon = Icons[item.icon] || Icons.profile;
            return (
              <motion.button
                key={item.label}
                onClick={() => setSelectedNav(item.label)}
                className="flex items-center gap-3 w-full px-3 py-[10px] rounded-[10px] text-[0.83rem] font-medium no-underline"
                style={{ color: theme.muted }}
                whileHover={{
                  backgroundColor: theme.primaryLight,
                  color: theme.primaryDark,
                }}
                transition={{ duration: 0.13 }}
              >
                <Icon /> {item.label}
              </motion.button>
            );
          })}
          <div className="h-px my-1.5" style={{ background: theme.border }} />
          <motion.button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-[10px] rounded-[10px] text-[0.83rem] font-medium text-red-500 bg-transparent border-none cursor-pointer font-cairo text-right"
            whileHover={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
            transition={{ duration: 0.13 }}
          >
            <Icons.logout /> {logoutLabel}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Mobile nav panel */
function MobileNav({
  config,
  theme,
  user,
  isOpen,
  onLogin,
  onLogout,
  signup,
  setselectedNav,
}) {
  const { nav, levels, cta, userMenu } = config;

  const mobLink = (
    icon,
    label,
    href = "#",
    color = theme.primaryXDark,
    bg = theme.primaryLight,
  ) => (
    <motion.a
      href={href}
      onClick={() => setselectedNav(label)}
      variants={itemFade}
      className="flex items-center gap-3 px-4 py-[11px] rounded-[11px] text-[0.88rem] font-medium no-underline"
      style={{ color: theme.muted }}
      whileHover={{
        backgroundColor: theme.primaryLight,
        color: theme.primaryDark,
      }}
      transition={{ duration: 0.15 }}
    >
      <span
        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-xs flex-shrink-0"
        style={{ background: bg, color }}
      >
        {icon}
      </span>
      {label}
    </motion.a>
  );

  const SectionLabel = ({ label, color }) => (
    <motion.p
      variants={itemFade}
      className="text-[0.62rem] font-bold tracking-widest uppercase px-4 pt-3 pb-1"
      style={{ color }}
    >
      {label}
    </motion.p>
  );

  const Divider = () => (
    <motion.div
      variants={itemFade}
      className="h-px my-2"
      style={{ background: theme.border }}
    />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={mobileNavVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="overflow-hidden bg-white border-b"
          style={{
            borderColor: theme.border,
            boxShadow: "0 8px 24px rgba(22,163,74,0.08)",
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-1 px-4 py-4"
          >
            {mobLink("🏠", "الرئيسية")}

            <Divider />

            {nav
              .filter((n) => !n.active)
              .map((n) =>
                mobLink(
                  n.label === "الدروس"
                    ? "📖"
                    : n.label === "التمارين"
                      ? "✏️"
                      : "💬",
                  n.label,
                  n.href,
                ),
              )}

            <Divider />
            {!user ? (
              <motion.div variants={itemFade} className="flex gap-2 mt-1">
                <motion.button
                  onClick={onLogin}
                  className="flex-1 py-2 rounded-[10px] text-sm font-semibold border cursor-pointer"
                  style={{
                    borderColor: theme.borderMd,
                    color: theme.muted,
                    background: "white",
                  }}
                  whileHover={{
                    borderColor: theme.primary,
                    color: theme.primaryDark,
                    backgroundColor: theme.primaryLight,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cta.login}
                </motion.button>
                <motion.button
                  onClick={signup}
                  className="flex-1 py-2 rounded-[10px] text-sm font-bold text-white border-none cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: `0 4px 14px ${theme.primary}50`,
                  }}
                  whileHover={{ opacity: 0.88 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cta.signup}
                </motion.button>
              </motion.div>
            ) : (
              <>
                {userMenu.map((item) => {
                  const Icon = Icons[item.icon] || Icons.profile;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      variants={itemFade}
                      className="flex items-center gap-3 px-4 py-[11px] rounded-[11px] text-[0.88rem] font-medium no-underline"
                      style={{ color: theme.muted }}
                      whileHover={{
                        backgroundColor: theme.primaryLight,
                        color: theme.primaryDark,
                      }}
                    >
                      <Icon /> {item.label}
                    </motion.a>
                  );
                })}
                <motion.button
                  onClick={onLogout}
                  variants={itemFade}
                  className="flex items-center gap-3 w-full px-4 py-[11px] rounded-[11px] text-[0.88rem] font-medium text-red-500 bg-transparent border-none cursor-pointer font-cairo text-right"
                  whileHover={{ backgroundColor: "#fef2f2" }}
                >
                  <Icons.logout /> تسجيل الخروج
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN HEADER COMPONENT
// ─────────────────────────────────────────────────────────
export default function MathProfHeader({
  config = DEFAULT_CONFIG,
  user = null,
  onLogin,
  onLogout,
  signup,
  setSelectedNav,
  selectedNav,
}) {
  const { brand, theme, navAdmin, navUser, levels, cta, userMenu, AdminMenu } =
    config;
  const [levelsOpen, setLevelsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const levelsRef = useRef(null);
  const userRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside
  useEffect(() => {
    const handler = (e) => {
      if (levelsRef.current && !levelsRef.current.contains(e.target))
        setLevelsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header dir="rtl" className="font-sans">
      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 z-[100] relative"
        style={{
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        animate={scrolled ? "scrolled" : "top"}
        variants={headerVariants}
        initial="top"
      >
        <div className="max-w-full mx-auto px-12 h-[68px] flex items-center gap-10">
          {/* ── Brand ── */}
          <motion.a
            href="#"
            className="flex items-center gap-3 no-underline flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <div className="flex items-center gap-2 text-green-700 font-black text-2xl">
              <span className="text-2xl">∑</span>
              <span>
                رياض<span className="text-gray-900">ياتي</span>
              </span>
            </div>
          </motion.a>
          <div className="flex-1" />

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {user?.role === "admin"
              ? navAdmin.map((item) => {
                  const isActive = selectedNav === item.label;
                  console.log(isActive + selectedNav + item.label);
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => setSelectedNav(item.label)}
                      className="text-[0.985rem] font-bold px-4 py-[7px] rounded-[9px] no-underline transition-colors whitespace-nowrap"
                      style={{
                        color: isActive ? theme.primaryDark : theme.muted,
                        background: isActive
                          ? theme.primaryLight
                          : "transparent",
                        fontWeight: isActive ? 600 : 500,
                      }}
                      whileHover={{
                        backgroundColor: theme.primaryLight,
                        color: theme.primaryDark,
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {item.label}
                    </motion.button>
                  );
                })
              : navUser.map((item) => {
                  const isActive = selectedNav === item.label;
                  console.log("user" + JSON.stringify(user));
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => setSelectedNav(item.label)}
                      className="text-[0.985rem] font-bold px-4 py-[7px] rounded-[9px] no-underline transition-colors whitespace-nowrap"
                      style={{
                        color: isActive ? theme.primaryDark : theme.muted,
                        background: isActive
                          ? theme.primaryLight
                          : "transparent",
                        fontWeight: isActive ? 600 : 500,
                      }}
                      whileHover={{
                        backgroundColor: theme.primaryLight,
                        color: theme.primaryDark,
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {item.label}
                    </motion.button>
                  );
                })}

            {/* Levels  <div className="relative" ref={levelsRef}>
              <motion.button
                onClick={() => setLevelsOpen((o) => !o)}
                className="flex items-center gap-1.5 text-[0.875rem] font-medium px-4 py-[7px] rounded-[9px] border-none cursor-pointer whitespace-nowrap font-cairo"
                style={{
                  color: levelsOpen ? theme.primaryDark : theme.muted,
                  background: levelsOpen ? theme.primaryLight : "transparent",
                }}
                whileHover={{
                  backgroundColor: theme.primaryLight,
                  color: theme.primaryDark,
                }}
                whileTap={{ scale: 0.97 }}
              >
                المستويات
                <motion.span
                  animate={{ rotate: levelsOpen ? 180 : 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ color: levelsOpen ? theme.primary : theme.muted2 }}
                >
                  {Icons.chevron()}
                </motion.span>
              </motion.button>
              <LevelsDropdown
                levels={levels}
                theme={theme}
                isOpen={levelsOpen}
                onClose={() => setLevelsOpen(false)}
              />
            </div> Dropdown */}
          </nav>
          <div className="flex-1" />

          {/* ── Account ── */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <AnimatePresence mode="wait">
              {!user ? (
                <motion.div
                  key="guest"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    onClick={onLogin}
                    className="text-sm font-semibold px-[18px] py-2 rounded-[10px] border cursor-pointer font-cairo whitespace-nowrap"
                    style={{
                      borderColor: theme.borderMd,
                      color: theme.muted,
                      background: "white",
                    }}
                    whileHover={{
                      borderColor: theme.primary,
                      color: theme.primaryDark,
                      backgroundColor: theme.primaryLight,
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {cta.login}
                  </motion.button>
                  <motion.button
                    onClick={signup}
                    className="bg-green-600 text-white border-0 rounded-xl px-5 py-2.5 font-bold text-sm cursor-pointer  hover:shadow-2xs hover:shadow-gray-500 transition-all"
                    whileHover={{ opacity: 0.88, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {cta.signup}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="user"
                  className="relative"
                  ref={userRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 py-[5px] pr-3 pl-[5px] rounded-[12px] border cursor-pointer font-cairo"
                    style={{
                      borderColor: userMenuOpen
                        ? theme.primary
                        : theme.borderMd,
                      background: userMenuOpen ? theme.primaryLight : "white",
                    }}
                    whileHover={{
                      borderColor: theme.primary,
                      backgroundColor: theme.primaryLight,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="w-[24px] h-[24px] text-green-800 flex items-center justify-center text-sm  flex-shrink-0">
                      <User />{" "}
                    </div>
                    <div className="text-right">
                      <div
                        className="text-[0.82rem] font-semibold leading-tight"
                        style={{ color: theme.primaryXDark }}
                      >
                        {user.name}
                      </div>
                      <div
                        className="text-[0.62rem] font-medium"
                        style={{ color: theme.primary }}
                      >
                        {user.level}
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ color: theme.muted2 }}
                    >
                      {Icons.chevron()}
                    </motion.span>
                  </motion.button>
                  <UserDropdown
                    setSelectedNav={setSelectedNav}
                    userMenu={(user.role = "admin" ? AdminMenu : userMenu)}
                    theme={theme}
                    isOpen={userMenuOpen}
                    onLogout={onLogout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Hamburger ── */}
          <motion.button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[10px] border cursor-pointer"
            style={{
              borderColor: mobileOpen ? theme.primary : theme.borderMd,
              background: mobileOpen ? theme.primaryLight : "white",
              color: mobileOpen ? theme.primaryDark : theme.muted,
            }}
            onClick={() => setMobileOpen((o) => !o)}
            whileTap={{ scale: 0.93 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Icons.close />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Icons.menu />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Mobile Nav ── */}
      <MobileNav
        config={config}
        theme={theme}
        user={user}
        isOpen={mobileOpen}
        onLogin={onLogin}
        setselectedNav={setSelectedNav}
        onLogout={onLogout}
        signup={signup}
      />
    </header>
  );
}

// ─────────────────────────────────────────────────────────
// DEMO PAGE SECTION
// ─────────────────────────────────────────────────────────
