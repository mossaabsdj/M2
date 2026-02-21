import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import FeedbackModal from "../FeedBack/page";
import Image from "next/image";
import {
  Ruler,
  FileText,
  Trophy,
  GraduationCap,
  School,
  Award,
  Rocket,
  Play,
  BookUser,
  BookOpen,
  PenTool,
  Star,
  User,
  Group,
  Users2,
  Plus,
} from "lucide-react";
const floatingShapes = [
  {
    size: 90,
    top: "6%",
    left: "4%",
    delay: 0,
    opacity: 0.18,
    type: "circle",
    color: "#22c55e",
  },
  {
    size: 130,
    top: "12%",
    right: "6%",
    delay: 0.3,
    opacity: 0.12,
    type: "hexagon",
    color: "#16a34a",
  },
  {
    size: 55,
    top: "58%",
    left: "1%",
    delay: 0.6,
    opacity: 0.2,
    type: "triangle",
    color: "#4ade80",
  },
  {
    size: 100,
    bottom: "18%",
    right: "2%",
    delay: 0.9,
    opacity: 0.1,
    type: "circle",
    color: "#86efac",
  },
  {
    size: 45,
    top: "42%",
    left: "14%",
    delay: 0.4,
    opacity: 0.16,
    type: "square",
    color: "#22c55e",
  },
  {
    size: 65,
    bottom: "8%",
    left: "18%",
    delay: 0.7,
    opacity: 0.12,
    type: "hexagon",
    color: "#4ade80",
  },
  {
    size: 38,
    top: "22%",
    left: "44%",
    delay: 1.1,
    opacity: 0.14,
    type: "triangle",
    color: "#16a34a",
  },
  {
    size: 58,
    bottom: "28%",
    right: "18%",
    delay: 0.2,
    opacity: 0.13,
    type: "circle",
    color: "#34d399",
  },
  {
    size: 70,
    top: "70%",
    right: "30%",
    delay: 0.5,
    opacity: 0.1,
    type: "hexagon",
    color: "#22c55e",
  },
  {
    size: 42,
    top: "30%",
    right: "22%",
    delay: 0.8,
    opacity: 0.15,
    type: "square",
    color: "#86efac",
  },
];

const mathSymbols = [
  "∫",
  "∑",
  "π",
  "√",
  "∞",
  "∂",
  "Δ",
  "θ",
  "α",
  "β",
  "λ",
  "±",
  "≈",
  "∇",
];

const navLinks = ["الرئيسية", "الدروس", "التمارين", "الامتحانات", "المدرسون"];

const features = [
  {
    icon: Ruler,
    title: "دروس تفاعلية",
    desc: "شروحات مفصّلة بالفيديو والنص",
  },
  {
    icon: FileText,
    title: "تمارين محلولة",
    desc: "أكثر من 200 تمرين بالحل الكامل",
  },
  {
    icon: Trophy,
    title: "اختبارات تجريبية",
    desc: "محاكاة حقيقية لامتحانات BEM و BAC",
  },
  {
    icon: GraduationCap,
    title: "أساتذة متخصصون",
    desc: "نخبة من أفضل الأساتذة الجزائريين",
  },
];

const testimonials = [
  {
    name: "أحمد بن علي",
    level: "ثانوي 3",
    rating: 5,
    text: "المنصة غيّرت طريقة فهمي للرياضيات تماماً، نجحت في الباكالوريا بتفوق!",
  },
  {
    name: "فاطمة الزهراء",
    level: "متوسط 4",
    rating: 5,
    text: "الدروس واضحة جداً والأستاذ يشرح بطريقة سهلة ومبسّطة.",
  },
  {
    name: "يوسف كريم",
    level: "ثانوي 2",
    rating: 5,
    text: "التمارين المحلولة ساعدتني كثيراً في الاستعداد للامتحانات.",
  },
];
const levels = [
  {
    title: "المرحلة المتوسطة",
    sub: "CEM",
    icon: BookOpen,
    desc: "من الأول إلى الرابع متوسط — مسار مدروس لإتقان أساسيات الجبر والهندسة والإحصاء.",
    items: ["أول متوسط", "ثاني متوسط", "ثالث متوسط", "رابع متوسط — BEM"],
    dotColor: "#15803d",
    borderColor: "rgba(21,128,61,0.25)",
    btnColor: "#15803d",
    bg: "from-green-50 to-white",
  },
  {
    title: "المرحلة الثانوية",
    sub: "Lycée",
    icon: School,
    desc: "من الأول إلى الثالث ثانوي — تحضير شامل للباكالوريا بجميع شعبها.",
    items: ["أول ثانوي", "ثاني ثانوي", "ثالث ثانوي — BAC"],
    dotColor: "#16a34a",
    borderColor: "rgba(22,163,74,0.3)",
    btnColor: "#16a34a",
    bg: "from-green-100 to-green-50",
  },
  {
    title: "التحضير للامتحانات",
    sub: "BEM & BAC",
    icon: Award,
    desc: "دورات مكثّفة لاجتياز امتحانات الشهادات بنتائج متميزة.",
    items: ["اختبارات تجريبية", "مسابقات سابقة", "تصحيحات مفصّلة"],
    dotColor: "#22c55e",
    borderColor: "rgba(34,197,94,0.25)",
    btnColor: "#22c55e",
    bg: "from-green-50 to-white",
  },
];

function Shape({ size, type, color }) {
  if (type === "hexagon")
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  if (type === "triangle")
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon
          points="50,5 95,90 5,90"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  if (type === "square")
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          fill="none"
          stroke={color}
          strokeWidth="2"
          transform="rotate(15 50 50)"
        />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

function ProfSVG() {
  return (
    <svg
      viewBox="0 0 200 330"
      width="250"
      height="400"
      style={{ position: "relative", zIndex: 2 }}
    >
      <rect x="52" y="162" width="96" height="168" rx="8" fill="#14532d" />
      <path d="M100 167 L73 167 L65 222 L100 197 Z" fill="#0f3d22" />
      <path d="M100 167 L127 167 L135 222 L100 197 Z" fill="#0f3d22" />
      <rect
        x="91"
        y="167"
        width="18"
        height="54"
        rx="3"
        fill="white"
        opacity="0.9"
      />
      <path d="M100 172 L105 188 L100 235 L95 188 Z" fill="#22c55e" />
      <ellipse cx="100" cy="98" rx="40" ry="47" fill="#d4a574" />
      <ellipse cx="100" cy="58" rx="40" ry="22" fill="#1f2937" />
      <path
        d="M62 72 Q60 55 100 52 Q140 55 138 72 Q120 60 80 60 Z"
        fill="#1f2937"
      />
      <ellipse cx="86" cy="94" rx="6" ry="7" fill="white" />
      <ellipse cx="114" cy="94" rx="6" ry="7" fill="white" />
      <circle cx="88" cy="95" r="3.5" fill="#1f2937" />
      <circle cx="116" cy="95" r="3.5" fill="#1f2937" />
      <circle cx="89" cy="94" r="1.2" fill="white" />
      <circle cx="117" cy="94" r="1.2" fill="white" />
      <rect
        x="78"
        y="87"
        width="17"
        height="14"
        rx="4"
        fill="none"
        stroke="#1f2937"
        strokeWidth="2.2"
      />
      <rect
        x="105"
        y="87"
        width="17"
        height="14"
        rx="4"
        fill="none"
        stroke="#1f2937"
        strokeWidth="2.2"
      />
      <line x1="95" y1="94" x2="105" y2="94" stroke="#1f2937" strokeWidth="2" />
      <line x1="78" y1="93" x2="72" y2="91" stroke="#1f2937" strokeWidth="2" />
      <line
        x1="122"
        y1="93"
        x2="128"
        y2="91"
        stroke="#1f2937"
        strokeWidth="2"
      />
      <path
        d="M98 105 Q100 110 102 105"
        fill="none"
        stroke="#a0522d"
        strokeWidth="1.5"
      />
      <path
        d="M88 118 Q100 126 112 118"
        fill="none"
        stroke="#8b5e3c"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="86" y="140" width="28" height="26" rx="5" fill="#d4a574" />
      <rect
        x="16"
        y="166"
        width="40"
        height="24"
        rx="11"
        fill="#14532d"
        transform="rotate(-16 36 178)"
      />
      <rect
        x="144"
        y="166"
        width="40"
        height="24"
        rx="11"
        fill="#14532d"
        transform="rotate(16 164 178)"
      />
      <ellipse
        cx="19"
        cy="208"
        rx="9"
        ry="7"
        fill="#d4a574"
        transform="rotate(-16 19 208)"
      />
      <rect
        x="10"
        y="210"
        width="5"
        height="22"
        rx="2.5"
        fill="white"
        transform="rotate(-16 12 220)"
      />
      <ellipse
        cx="181"
        cy="208"
        rx="9"
        ry="7"
        fill="#d4a574"
        transform="rotate(16 181 208)"
      />
      <rect
        x="178"
        y="195"
        width="4"
        height="32"
        rx="2"
        fill="#22c55e"
        transform="rotate(12 180 211)"
      />
      <circle cx="182" cy="196" r="4" fill="#4ade80" />
    </svg>
  );
}

export default function MathHero() {
  const heroRef = useRef(null);
  const featRef = useRef(null);
  const testRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const featInView = useInView(featRef, { once: true, margin: "-80px" });
  const testInView = useInView(testRef, { once: true, margin: "-80px" });
  const [showModal, setShowModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("/api/feedback")
      .then((res) => res.json())
      .then(setFeedbacks);
  }, []);

  return (
    <div dir="rtl" className="font-sans bg-white overflow-x-hidden">
      {/* ══════════════ GOOGLE FONTS ══════════════ */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Amiri:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Glow blobs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600,
            height: 600,
            background: "rgba(34,197,94,0.07)",
            top: -180,
            right: -200,
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 450,
            height: 450,
            background: "rgba(74,222,128,0.06)",
            bottom: -100,
            left: -100,
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            background: "rgba(134,239,172,0.08)",
            top: "30%",
            left: "30%",
            filter: "blur(100px)",
          }}
        />

        {/* Content */}
        <div
          ref={heroRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-10 py-16 flex flex-col lg:flex-row items-center gap-14"
        >
          {/* TEXT */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-flex items-center gap-2 bg-green-50 border border-green-300 rounded-full px-5 py-1.5 text-green-700 font-bold text-sm"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <span className="text-base">🎓</span>
                منصة تعليمية متخصصة في الرياضيات
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-5 mb-2 font-black text-gray-900 leading-tight"
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(2.2rem,4.5vw,3.8rem)",
              }}
            >
              تعلّم الرياضيات
              <br />
              <span className="bg-gradient-to-r from-green-700 via-green-500 to-green-400 bg-clip-text text-transparent">
                بأسلوب مختلف
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-gray-500 text-base leading-loose max-w-lg mt-4 mb-8"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              منصة متكاملة للأستاذ الجزائري — دروس وتمارين وامتحانات للمرحلة
              المتوسطة <strong className="text-green-700">(CEM)</strong>{" "}
              والمرحلة الثانوية{" "}
              <strong className="text-green-600">(Lycée)</strong>، مصممة لتحقيق
              أفضل النتائج في الباكالوريا والبيام.
            </motion.p>

            {/* Level tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-2.5 mb-9"
            >
              {[
                {
                  label: "متوسط 1 – 4",
                  cls: "bg-green-50 border-green-200 text-green-800",
                },
                {
                  label: "ثانوي 1 – 3",
                  cls: "bg-green-100 border-green-300 text-green-700",
                },
                {
                  label: "BEM",
                  cls: "bg-emerald-50 border-emerald-200 text-emerald-700",
                },
                {
                  label: "BAC",
                  cls: "bg-teal-50 border-teal-200 text-teal-700",
                },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className={`${tag.cls} border rounded-lg px-4 py-1.5 text-sm font-bold`}
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {tag.label}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-3.5"
            >
              <button
                className="bg-gradient-to-br from-green-500 flex flex-row gap-1 justify-center  to-green-700 text-white border-0 rounded-xl px-8 py-3.5 font-bold text-base cursor-pointer shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5 transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <span>ابدأ التعلّم</span>
                <Rocket />
              </button>
              <button
                className="bg-white text-green-700 border-2 border-green-200 rounded-xl  flex flex-row gap-1 justify-center px-7 py-3 font-bold text-base cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <Play />
                <span> استعرض الدروس</span>
              </button>
            </motion.div>

            {/* Stats */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3.5 mt-12"
            >
              {[
                {
                  value: "+500",
                  label: "درس ومحاضرة",
                  icon: BookOpen,
                },
                {
                  value: "+200",
                  label: "تمرين محلول",
                  icon: PenTool,
                },
                {
                  value: "+50",
                  label: "أستاذ متخصص",
                  icon: GraduationCap,
                },
                {
                  value: "4.9",
                  label: "تقييم الطلاب",
                  icon: Star,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 min-w-[90px] bg-white border border-green-100 rounded-2xl p-4 text-center shadow-sm shadow-green-100 hover:shadow-md hover:shadow-green-200 hover:-translate-y-1 transition-all"
                >
                  <div className="flex justify-center mb-1 text-green-600">
                    <stat.icon size={22} strokeWidth={2.2} />
                  </div>

                  <div
                    className="font-black text-green-700 text-xl leading-none"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {stat.value}
                    {stat.label === "تقييم الطلاب" && "★"}
                  </div>

                  <div
                    className="text-gray-400 text-xs mt-1"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* PROFESSOR IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, x: -30 }}
            animate={heroInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="
    relative flex-shrink-0
    w-[280px] h-[420px]
    sm:w-[440px] sm:h-[520px]
  "
          >
            {/* Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -(ring * 18),
                  borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
                  border: `1.5px solid rgba(34,197,94,${0.18 - ring * 0.05})`,
                }}
                animate={{ scale: [1, 1.022, 1] }}
                transition={{
                  duration: 3 + ring,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ring * 0.4,
                }}
              />
            ))}

            {/* Animated blob */}
            <motion.div
              className="absolute"
              style={{
                top: -25,
                left: -25,
                right: -25,
                bottom: -12,
                background:
                  "linear-gradient(160deg, rgba(34,197,94,0.1) 0%, rgba(134,239,172,0.06) 100%)",
                border: "1.5px solid rgba(34,197,94,0.15)",
              }}
              animate={{
                borderRadius: [
                  "60% 40% 60% 40% / 50% 60% 40% 50%",
                  "50% 50% 40% 60% / 60% 40% 60% 40%",
                  "60% 40% 60% 40% / 50% 60% 40% 50%",
                ],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Glow dots */}
            {[
              { top: "8%", right: "-6%", color: "#22c55e" },
              { top: "48%", left: "-8%", color: "#4ade80" },
              { bottom: "18%", right: "-7%", color: "#86efac" },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full w-3 h-3"
                style={{
                  background: dot.color,
                  boxShadow: `0 0 20px ${dot.color}80`,
                  top: dot.top,
                  bottom: dot.bottom,
                  left: dot.left,
                  right: dot.right,
                }}
                animate={{ scale: [1, 1.65, 1], opacity: [0.9, 0.4, 0.9] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.6 }}
              />
            ))}

            {/* Image container */}
            <div
              className="
    absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden
    w-[240px] h-[350px]
    sm:w-[300px] sm:h-[400px]
    md:w-[370px] md:h-[480px]
  "
            >
              <div className="w-full h-full bg-gradient-to-b from-green-100 via-green-50 to-green-50 flex items-end justify-center relative overflow-hidden">
                {/* Formula watermark */}
                <div
                  className="absolute z-0 inset-0 flex flex-col justify-around px-7 py-6 overflow-hidden pointer-events-none"
                  style={{
                    opacity: 0.32,
                    fontFamily: "'Amiri', serif",
                    fontSize: 13,
                    color: "#15803d",
                    lineHeight: 2.2,
                  }}
                >
                  {[
                    "f(x) = ax² + bx + c",
                    "∫₀^π sin(x)dx = 2",
                    "lim(x→∞) 1/x = 0",
                    "P(A∪B) = P(A)+P(B)-P(A∩B)",
                    "cos²θ + sin²θ = 1",
                    "e^(iπ) + 1 = 0",
                    "d/dx(xⁿ) = nxⁿ⁻¹",
                  ].map((f, i) => (
                    <div key={i}>{f}</div>
                  ))}
                </div>
                <Image
                  src="/images/prof.webp"
                  width={300}
                  className="z-10"
                  height={400}
                  alt="Profile image"
                />
              </div>
            </div>

            {/* Badge: level */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.85, type: "spring" }}
              className="
    absolute
    top-6 right-0 
    bg-white border border-green-200 rounded-2xl
    px-3 py-2
    sm:px-4 sm:py-3
    shadow-lg shadow-green-100
    top-4 right-2
    sm:top-7 sm:-right-6
  "
            >
              <div
                className="text-gray-400 text-xs mb-0.5"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                المستوى
              </div>
              <div
                className="text-green-700 font-extrabold text-sm"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                CEM & Lycée
              </div>
            </motion.div>

            {/* Badge: rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -10 }}
              animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.05, type: "spring" }}
              className="absolute bg-white border text-green-700 border-green-200 rounded-2xl px-4 py-3 shadow-lg shadow-green-100 flex items-center gap-2.5"
              style={{ bottom: 38, left: -28 }}
            >
              <Star />
              <div>
                <div
                  className="text-green-700 font-extrabold text-base leading-none"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  4.9/5
                </div>
                <div
                  className="text-gray-400 text-xs mt-0.5"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  تقييم الطلاب
                </div>
              </div>
            </motion.div>

            {/* Badge: students */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
              className="absolute bg-white border text-green-700 border-green-200 rounded-2xl px-4 py-2.5 shadow-md shadow-green-100 flex items-center gap-2"
              style={{ top: "40%", left: -32 }}
            >
              <Users2 />
              <div>
                <div
                  className="text-green-700 font-extrabold text-sm leading-none"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  +12,000
                </div>
                <div
                  className="text-gray-400 text-xs mt-0.5"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  طالب مسجّل
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          height="70"
        >
          <path d="M0,35 C480,70 960,0 1440,35 L1440,70 L0,70 Z" fill="white" />
        </svg>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="bg-white py-24 px-10" ref={featRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={featInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="font-black text-gray-900"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(1.8rem,3vw,2.5rem)",
            }}
          >
            لماذا تختار منصتنا؟
          </h2>
          <p
            className="text-gray-500 text-base mt-2.5"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            كل ما تحتاجه في مكان واحد لتحقيق النجاح
          </p>
          <div className="w-14 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full mx-auto mt-3.5" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8 text-center shadow-sm shadow-green-100 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-1.5 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-green-700" />
              </div>

              <div
                className="font-extrabold text-gray-900 text-base mb-2"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {f.title}
              </div>
              <div
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ LEVELS ══════════════ */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-24 px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="font-black text-gray-900"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(1.8rem,3vw,2.5rem)",
            }}
          >
            اختر مستواك
          </h2>
          <p
            className="text-gray-500 text-base mt-2.5"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            محتوى مصمّم خصيصاً لكل مرحلة دراسية
          </p>
          <div className="w-14 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full mx-auto mt-3.5" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {levels.map((lv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className={`bg-gradient-to-br ${lv.bg} rounded-2xl p-9 text-center shadow-md shadow-green-100 transition-all`}
              style={{ border: `1.5px solid ${lv.borderColor}` }}
            >
              <div className="text-4xl mb-4">
                <lv.icon></lv.icon>
              </div>
              <div
                className="font-black text-lg mb-1"
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  color: lv.dotColor,
                }}
              >
                {lv.title}
              </div>
              <div
                className="text-gray-400 text-xs font-bold mb-3"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {lv.sub}
              </div>
              <p
                className="text-gray-500 text-sm leading-loose mb-5"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {lv.desc}
              </p>

              <div className="flex flex-col gap-2 mb-6">
                {lv.items.map((item, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 text-sm text-gray-600"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: lv.dotColor }}
                    />
                    {item}
                  </div>
                ))}
              </div>

              <LevelButton color={lv.btnColor} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <div className="relative">
        <section className="bg-white py-24 px-10" ref={testRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className="font-black text-gray-900"
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(1.8rem,3vw,2.5rem)",
              }}
            >
              ماذا يقول طلابنا؟
            </h2>
            <p
              className="text-gray-500 text-base mt-2.5"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              آراء حقيقية من طلاب حققوا نجاحهم معنا
            </p>
            <div className="w-14 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full mx-auto mt-3.5" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {feedbacks.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={testInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.13 }}
                className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-7 shadow-sm shadow-green-100 hover:shadow-md hover:shadow-green-200 hover:-translate-y-1 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.rating)
                    .fill(0)
                    .map((_, j) => (
                      <span key={j} className="text-yellow-400 text-base">
                        ★
                      </span>
                    ))}
                </div>
                <p
                  className="text-gray-600 text-sm leading-loose mb-5"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black text-base flex-shrink-0"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div
                      className="font-extrabold text-gray-900 text-sm"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-green-600 text-xs"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      {t.level}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className=" text-center mt-5">
            <button
              onClick={() => setShowModal(true)}
              className="  px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all"
            >
              أضف رأيك
            </button>
          </div>
        </section>

        <FeedbackModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={(newFeedback) => setFeedbacks([newFeedback, ...feedbacks])}
        />
      </div>

      {/* ══════════════ CTA BANNER ══════════════ */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 py-24 px-10 text-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute w-72 h-72 rounded-full border border-white/15 -top-20 -right-20 pointer-events-none" />
        <div className="absolute w-52 h-52 rounded-full border border-white/10 -bottom-14 -left-14 pointer-events-none" />
        <div className="absolute w-40 h-40 rounded-full border border-white/10 top-10 left-1/3 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <h2
            className="font-black text-white mb-4"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(1.8rem,3.5vw,2.6rem)",
            }}
          >
            ابدأ رحلتك مع الرياضيات اليوم!
          </h2>
          <p
            className="text-white/85 text-base max-w-lg mx-auto mb-10"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            انضم إلى أكثر من 12,000 طالب يتعلمون ويتفوقون مع أفضل أساتذة الجزائر
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="bg-white text-green-700 border-0 rounded-xl px-9 py-3.5 font-extrabold text-base cursor-pointer shadow-xl shadow-black/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              🎓 سجّل مجاناً الآن
            </button>
            <button
              className="bg-transparent text-white border-2 border-white/50 rounded-xl px-8 py-3 font-bold text-base cursor-pointer hover:border-white hover:bg-white/10 transition-all"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تعرّف علينا أكثر
            </button>
          </div>
        </motion.div>
      </section>
      <div className="absolute top-35 right-6 pointer-events-none flex flex-row">
        {/* Circle */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-green-200/60 mb-0 "
        />

        {/* Triangle */}
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] 
                   border-l-transparent border-r-transparent border-b-green-300/60 ml-8 mb-8"
        />

        {/* Square */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-8 bg-green-400/50 rotate-12 ml-3"
        />
      </div>
    </div>
  );
}

// Small component to handle hover state for level button
function LevelButton({ color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full rounded-xl py-2.5 font-bold text-sm cursor-pointer transition-all"
      style={{
        fontFamily: "'Cairo', sans-serif",
        background: hovered ? color : "transparent",
        color: hovered ? "white" : color,
        border: `1.5px solid ${color}`,
      }}
    >
      ابدأ الآن
    </button>
  );
}
