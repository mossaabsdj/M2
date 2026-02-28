"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Swal from "sweetalert2";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Progression from "@/app/component/Proogression/page";

const TEXTS = {
  brandName: "Math",
  home: "الرئيسية",
  login: "تسجيل الدخول",
  logout: "تسجيل الخروج",

  navItemsAdmin: [
    { label: "المنتجات", href: "/admin/products" },
    { label: "الطلبات", href: "/admin/commande" },
    { label: "المستويات والدروس", href: "/admin/Courses" },
    { label: "المستخدمون", href: "/admin/Users" },
    { label: "الإعدادات", href: "/admin/parametre" },
  ],

  navItemsClient: [
    { label: "طلباتي", href: "/admin/Users" },
    { label: "الإعدادات", href: "/admin/parametre" },
  ],
};

export default function AppNavbar({ onNavChange, currentPage }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { data: session, status } = useSession();
  const [navs, setNavs] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const role = session?.user?.role;
    setNavs(role === "ADMIN" ? TEXTS.navItemsAdmin : TEXTS.navItemsClient);
  }, [session]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم تسجيل خروجك.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a56db",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "نعم، تسجيل الخروج",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        signOut({ callbackUrl: "/" });
      }
    });
  };

  return (
    <>
      {isLoading && <Progression isVisible={true} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

        .math-navbar {
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          direction: rtl;
          background: #ffffff;
          border-bottom: 1.5px solid #d1fae5;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: box-shadow 0.25s ease, background 0.25s ease;
        }

        .math-navbar.scrolled {
          box-shadow: 0 2px 24px 0 rgba(22,163,74,0.08);
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(10px);
        }

        .math-navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* Brand */
        .math-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .math-brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(22,163,74,0.22);
          font-size: 20px;
          color: white;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .math-brand-name {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.3px;
        }

        /* Desktop nav */
        .math-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          justify-content: center;
        }
        .math-nav-btn {
          position: relative;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.18s, background 0.18s;
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          white-space: nowrap;
        }
        .math-nav-btn:hover {
          color: #16a34a;
          background: #ecfdf5;
        }
        .math-nav-btn.active {
          color: #16a34a;
          background: #ecfdf5;
          font-weight: 600;
        }
        .math-nav-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          right: 16px;
          left: 16px;
          height: 2px;
          border-radius: 2px;
          background: #16a34a;
        }
        .math-nav-btn.home-btn {
          color: #111827;
          font-weight: 600;
        }
        .math-nav-btn.home-btn:hover {
          color: #16a34a;
          background: #ecfdf5;
        }

        /* Auth button */
        .math-auth-area {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .math-btn-login {
          padding: 8px 20px;
          border-radius: 8px;
          background: #16a34a;
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.18s, transform 0.1s;
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .math-btn-login:hover {
          background: #15803d;
          transform: translateY(-1px);
        }
        .math-btn-logout {
          padding: 8px 18px;
          border-radius: 8px;
          background: transparent;
          color: #dc2626;
          font-size: 13.5px;
          font-weight: 600;
          border: 1.5px solid #fca5a5;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .math-btn-logout:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        /* Skeleton */
        .math-skeleton {
          width: 88px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(90deg, #f0fdf4 25%, #bbf7d0 50%, #f0fdf4 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Mobile toggle */
        .math-mobile-toggle {
          display: none;
          background: transparent;
          border: 1.5px solid #d1fae5;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          color: #16a34a;
          transition: background 0.15s;
        }
        .math-mobile-toggle:hover {
          background: #ecfdf5;
        }

        /* Divider */
        .math-divider {
          width: 1px;
          height: 24px;
          background: #d1fae5;
          flex-shrink: 0;
        }

        /* Mobile Sheet */
        .math-mobile-sheet {
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          direction: rtl;
        }
        .math-mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 20px;
          border-bottom: 1px solid #d1fae5;
          margin-bottom: 16px;
        }
        .math-mobile-link {
          display: block;
          padding: 10px 14px;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 500;
          color: #374151;
          text-align: right;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .math-mobile-link:hover {
          background: #ecfdf5;
          color: #16a34a;
        }
        .math-mobile-link.active {
          background: #ecfdf5;
          color: #16a34a;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .math-nav-links { display: none; }
          .math-auth-area { display: none; }
          .math-divider { display: none; }
          .math-mobile-toggle { display: flex; }
        }
      `}</style>

      <header className={`math-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="math-navbar-inner">
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

          <div className="math-divider" />

          {/* Desktop Nav */}
          <nav className="math-nav-links">
            <button
              type="button"
              className="math-nav-btn home-btn"
              onClick={() => {
                setIsLoading(true);
                router.push("/");
              }}
            >
              {TEXTS.home}
            </button>

            {navs?.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`math-nav-btn${currentPage === item.label ? " active" : ""}`}
                onClick={() => onNavChange(item.label)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="math-auth-area">
            {status === "loading" ? (
              <div className="math-skeleton" />
            ) : session ? (
              <button className="math-btn-logout" onClick={handleLogout}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            ) : (
              <Link href="/Login" className="math-btn-login">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                {TEXTS.login}
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="math-mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-label="فتح القائمة"
          >
            {open ? "✕" : "≡"}
          </button>
        </div>
      </header>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[75%] p-6 math-mobile-sheet"
          style={{
            direction: "rtl",
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          }}
        >
          <div className="math-mobile-brand">
            <div
              className="math-brand-logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#1a56db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(26,86,219,0.18)",
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={36}
                height={36}
                style={{ borderRadius: 9, objectFit: "cover" }}
              />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
              {TEXTS.brandName}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button
              type="button"
              className="math-mobile-link"
              onClick={() => {
                setIsLoading(true);
                setOpen(false);
                router.push("/");
              }}
            >
              {TEXTS.home}
            </button>

            {navs?.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`math-mobile-link${currentPage === item.label ? " active" : ""}`}
                onClick={() => {
                  onNavChange(item.label);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}

            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid #e5e9f2",
              }}
            >
              {session ? (
                <button
                  className="math-btn-logout"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {TEXTS.logout}
                </button>
              ) : (
                <Link
                  href="/Login"
                  className="math-btn-login"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setOpen(false)}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  {TEXTS.login}
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
