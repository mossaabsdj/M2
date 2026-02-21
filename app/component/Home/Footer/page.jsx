"use client";

import {
  Bird,
  Book,
  Camera,
  Facebook,
  Instagram,
  Tv,
  X,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-slate-900 px-10 pt-14 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div
              className="text-green-400 font-black text-xl mb-4"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              ∑ رياضياتي
            </div>
            <p
              className="text-white/55 text-sm leading-loose"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              منصة تعليمية جزائرية متخصصة في الرياضيات لجميع المراحل الدراسية.
              نهدف إلى تمكين كل طالب من تحقيق أعلى النتائج.
            </p>
            <div className="flex gap-2.5 mt-5">
              {[Facebook, Instagram, X, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center text-base cursor-pointer hover:bg-green-400/20 transition-all"
                >
                  <Icon />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "الدروس",
              links: ["الجبر", "الهندسة", "الإحصاء", "التحليل", "المنطق"],
            },
            {
              title: "المستويات",
              links: ["متوسط 1-4", "ثانوي 1-3", "تحضير BEM", "تحضير BAC"],
            },
            {
              title: "المنصة",
              links: ["من نحن", "فريقنا", "شروط الاستخدام", "تواصل معنا"],
            },
          ].map((col, i) => (
            <div key={i}>
              <div
                className="text-white font-extrabold text-sm mb-4"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {col.title}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l, j) => (
                  <a
                    key={j}
                    href="#"
                    className="text-white/50 text-sm no-underline hover:text-green-400 transition-colors"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className="border-none border-t border-white/10 max-w-5xl mx-auto mb-6" />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p
            className="text-white/45 text-sm"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            © 2025 رياضياتي — جميع الحقوق محفوظة
          </p>
          <p
            className="text-white/45 text-sm"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            Mdev للبرمجيات
          </p>
        </div>
      </footer>
    </>
  );
}
