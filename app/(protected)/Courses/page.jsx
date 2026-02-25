"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  FileCheck,
  PlayCircle,
  ChevronLeft,
  Layers,
  GraduationCap,
} from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getLinkType(url) {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.endsWith(".pdf") || url.includes("pdf")) return "pdf";
  if (url.endsWith(".doc") || url.endsWith(".docx") || url.includes("word"))
    return "word";
  return "link";
}

// ─── Sidebar sections ──────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "courses",
    label: "الدروس و التمارين",
    icon: BookOpen,
    color: "#2563eb",
  },

  { id: "exams", label: "الامتحانات", icon: FileCheck, color: "#dc2626" },
  { id: "douraat", label: "دورات", icon: PlayCircle, color: "#7c3aed" },
];

// ─── Data ──────────────────────────────────────────────────────────────────────
const niveaux = [
  {
    id: 1,
    slug: "1as",
    label: "أولى ثانوي",
    tag: "1ère AS",
    color: "#059669",
    light: "#d1fae5",
    courses: [
      {
        id: 101,
        title: "الدوال العددية",
        chapters: [
          {
            id: 1001,
            title: "مفهوم الدالة",
            videoUrl: "https://youtube.com/watch?v=example",
            resumeUrl: "https://example.com/resume-dalles.pdf",
            series: [
              {
                id: 1,
                label: "السلسلة 01",
                serieUrl: "https://example.com/serie1.pdf",
                solutionUrl: "https://example.com/sol1.pdf",
              },
              {
                id: 2,
                label: "السلسلة 02",
                serieUrl: "https://example.com/serie2.pdf",
                solutionUrl: null,
              },
              {
                id: 3,
                label: "السلسلة 03",
                serieUrl: "https://example.com/serie3.docx",
                solutionUrl: "https://youtube.com/watch?v=sol3",
              },
            ],
          },
          {
            id: 1002,
            title: "الدوال المتزايدة والمتناقصة",
            videoUrl: null,
            resumeUrl: "https://example.com/resume2.pdf",
            series: [
              {
                id: 4,
                label: "السلسلة 01",
                serieUrl: "https://example.com/serie4.pdf",
                solutionUrl: "https://example.com/sol4.pdf",
              },
              { id: 5, label: "السلسلة 02", serieUrl: null, solutionUrl: null },
            ],
          },
        ],
      },
      {
        id: 102,
        title: "المتتاليات العددية",
        chapters: [
          {
            id: 1003,
            title: "المتتاليات الحسابية",
            videoUrl: "https://youtube.com/watch?v=example2",
            resumeUrl: null,
            series: [
              {
                id: 6,
                label: "السلسلة 01",
                serieUrl: "https://example.com/serie6.pdf",
                solutionUrl: "https://example.com/sol6.pdf",
              },
              {
                id: 7,
                label: "السلسلة 02",
                serieUrl: "https://example.com/serie7.docx",
                solutionUrl: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "2as",
    label: "ثانية ثانوي",
    tag: "2ème AS",
    color: "#2563eb",
    light: "#dbeafe",
    courses: [
      {
        id: 201,
        title: "الاشتقاق والتفاضل",
        chapters: [
          {
            id: 2001,
            title: "مشتق الدالة",
            videoUrl: "https://youtube.com/watch?v=example3",
            resumeUrl: "https://example.com/resume-deriv.pdf",
            series: [
              {
                id: 11,
                label: "السلسلة 01",
                serieUrl: "https://example.com/serie11.pdf",
                solutionUrl: "https://example.com/sol11.pdf",
              },
              {
                id: 12,
                label: "السلسلة 02",
                serieUrl: "https://example.com/serie12.pdf",
                solutionUrl: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "3as",
    label: "ثالثة ثانوي",
    tag: "BAC",
    color: "#dc2626",
    light: "#fee2e2",
    courses: [
      {
        id: 301,
        title: "التكامل",
        chapters: [
          {
            id: 3001,
            title: "التكامل المحدد",
            videoUrl: "https://youtube.com/watch?v=example4",
            resumeUrl: "https://example.com/resume-integ.pdf",
            series: [
              {
                id: 18,
                label: "السلسلة 01",
                serieUrl: "https://example.com/serie18.pdf",
                solutionUrl: "https://example.com/sol18.pdf",
              },
              {
                id: 19,
                label: "السلسلة 02",
                serieUrl: "https://example.com/serie19.pdf",
                solutionUrl: "https://youtube.com/watch?v=sol19",
              },
              {
                id: 20,
                label: "السلسلة 03",
                serieUrl: null,
                solutionUrl: null,
              },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Clickable text link ───────────────────────────────────────────────────────
function TLink({ url, children, color }) {
  if (!url) return <span className="text-gray-300 text-sm">—</span>;
  const isVideo = getLinkType(url) === "video";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 hover:opacity-60 transition-opacity"
      style={{ color: isVideo ? "#dc2626" : color }}
    >
      {isVideo && <PlayCircle className="h-3.5 w-3.5 shrink-0" />}
      {children}
    </a>
  );
}

// ─── Chapter Card (for Courses section) ───────────────────────────────────────
function ChapterCard({ ch, color, light, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.04 }}
      className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-gray-50/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
            style={{ background: light, color }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-bold text-gray-800 text-sm text-right">
            {ch.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 mr-2">
          {ch.resumeUrl && (
            <a
              href={ch.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold px-3 py-1 rounded-full border transition-opacity hover:opacity-60"
              style={{ borderColor: color, color }}
            >
              الملخص
            </a>
          )}
          {ch.videoUrl && (
            <a
              href={ch.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-full text-white hover:opacity-80 transition-opacity"
              style={{ background: "#dc2626" }}
            >
              <PlayCircle className="h-3 w-3" /> فيديو
            </a>
          )}
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <ChevronLeft className="h-4 w-4 text-gray-300" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 pt-2 border-t border-gray-100"
              style={{ background: light + "44" }}
            >
              <p className="text-xs font-bold text-gray-400 mb-3">
                السلاسل والحلول
              </p>
              <div className="space-y-2">
                {ch.series.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 text-sm">
                    <span className="w-24 text-gray-500 font-medium shrink-0">
                      {s.label}
                    </span>
                    <TLink url={s.serieUrl} color={color}>
                      التمارين
                    </TLink>
                    {s.solutionUrl && (
                      <>
                        <span className="text-gray-200">|</span>
                        <TLink url={s.solutionUrl} color={color}>
                          الحل
                        </TLink>
                      </>
                    )}
                    {!s.serieUrl && !s.solutionUrl && (
                      <span className="text-xs text-gray-300">
                        غير متاح بعد
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Courses Section ───────────────────────────────────────────────────────────
function CoursesSection() {
  return (
    <div>
      {niveaux.map((niveau) => (
        <div key={niveau.id} className="mb-10">
          {/* Niveau label */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: niveau.color }}
            />
            <span className="font-black text-gray-800 text-base">
              {niveau.label}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{ borderColor: niveau.color, color: niveau.color }}
            >
              {niveau.tag}
            </span>
          </div>
          {/* Courses */}
          {niveau.courses.map((course) => (
            <div key={course.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Layers
                  className="h-3.5 w-3.5"
                  style={{ color: niveau.color }}
                />
                <h3 className="font-bold text-gray-700 text-sm">
                  {course.title}
                </h3>
              </div>
              <div className="space-y-3">
                {course.chapters.map((ch, i) => (
                  <ChapterCard
                    key={ch.id}
                    ch={ch}
                    color={niveau.color}
                    light={niveau.light}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Placeholder sections ──────────────────────────────────────────────────────
function PlaceholderSection({ section }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
        style={{ background: section.color + "15" }}
      >
        <section.icon className="h-8 w-8" style={{ color: section.color }} />
      </div>
      <h2 className="font-black text-gray-700 text-xl mb-2">{section.label}</h2>
      <p className="text-gray-400 text-sm max-w-xs">
        سيتم إضافة محتوى {section.label} قريباً. ابقَ معنا!
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [activeSection, setActiveSection] = useState("courses");

  const current = SECTIONS.find((s) => s.id === activeSection);

  const handleNav = (id) => {
    setActiveSection(id);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
      `}</style>

      {/* ── Sidebar — desktop only ── */}
      <aside className="hidden md:flex fixed top-0 right-0 h-full w-56 bg-white border-l border-gray-100 shadow-sm z-40 flex-col">
        {/* Sidebar top */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gray-700" />
            <span className="font-black text-gray-800 text-base">
              الرياضيات
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">اختر القسم</p>
        </div>

        {/* Nav items */}
        <nav className="p-4 space-y-2 flex-1">
          {SECTIONS.map((s) => {
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleNav(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-right transition-all"
                style={
                  active
                    ? {
                        background: s.color,
                        color: "#fff",
                        boxShadow: `0 4px 14px ${s.color}44`,
                      }
                    : { background: "transparent", color: "#6b7280" }
                }
              >
                <s.icon className="h-4 w-4 shrink-0" />
                <span className="font-bold text-sm">{s.label}</span>
                {active && (
                  <motion.div
                    layoutId="active-dot"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-white/60"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main wrapper ── */}
      <div className="md:flex md:gap-0">
        {/* Sidebar spacer for desktop */}
        <div className="hidden md:block w-56 shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <current.icon
                className="h-4 w-4"
                style={{ color: current.color }}
              />
              <span className="font-black text-gray-800 text-sm">
                {current.label}
              </span>
            </div>

            {/* Color accent line */}
            <div
              className="absolute bottom-0 right-0 left-0 h-0.5 transition-colors duration-300"
              style={{ background: current.color }}
            />
          </header>

          {/* Page content */}
          <main className="max-w-6xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "courses" && <CoursesSection />}
                {activeSection !== "courses" && (
                  <PlaceholderSection section={current} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Mobile bottom nav (alternative quick access) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 md:hidden bg-white border-t border-gray-100 flex">
        {SECTIONS.map((s) => {
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleNav(s.id)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
              style={{ color: active ? s.color : "#9ca3af" }}
            >
              <s.icon className="h-5 w-5" />
              <span className="text-[10px] font-bold">{s.label}</span>
              {active && (
                <motion.div
                  layoutId="bottom-indicator"
                  className="absolute top-0 h-0.5 w-12 rounded-full"
                  style={{ background: s.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom nav spacer on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
