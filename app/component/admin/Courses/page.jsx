import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllNiveaux,
  createNiveau,
  deleteNiveau,
  updateNiveau,
} from "@/lib/niveauApi";
import {
  getAllChapters,
  createChapter,
  deleteChapter,
  updateChapter,
} from "@/lib/chapterApi";
import {
  getAllCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/lib/courseApi";
import {
  getAllSeries,
  createSeries,
  deleteSeries,
  updateSeries,
} from "@/lib/seriesApi";
import uploadFileToCloudinary from "@/lib/Cloudinry";

import {
  BookOpen,
  ChevronLeft,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Video,
  FileText,
  Link,
  Moon,
  Sun,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  BookMarked,
  ClipboardList,
  Search,
  Eye,
  Loader2,
  Menu,
  Filter,
  Upload,
  File,
} from "lucide-react";

// ─── Theme ───────────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    bg: "bg-white",
    sidebar: "bg-white border-r border-[#E5E7EB]",
    card: "bg-white border border-[#E5E7EB]",
    cardHover: "hover:border-[#16A34A] hover:shadow-md",
    text: "text-[#111827]",
    textMuted: "text-[#6B7280]",
    input:
      "bg-white border border-[#D1D5DB] focus:border-[#16A34A] text-[#111827]",
    badge: "bg-[#DCFCE7] text-[#166534]",
    accent: "#16A34A",
    accentBg: "bg-[#16A34A]",
    accentHover: "hover:bg-[#15803D]",
    accentText: "text-[#16A34A]",
    modal: "bg-white",
    divider: "border-[#E5E7EB]",
    activeSidebar: "bg-[#DCFCE7] text-[#166534]",
    tag: "bg-[#F0FDF4] text-[#166534]",
    filterActive: "bg-[#16A34A] text-white",
    filterInactive: "bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7]",
    mobileNav: "bg-white border-t border-[#E5E7EB]",
    overlay: "bg-black/40",
    uploadArea:
      "bg-[#F0FDF4] border-2 border-dashed border-[#86EFAC] hover:border-[#16A34A]",
    uploadAreaActive: "bg-[#DCFCE7] border-[#16A34A]",
  },
  dark: {
    bg: "bg-[#0F172A]",
    sidebar: "bg-[#111827] border-r border-[#1F2937]",
    card: "bg-[#1F2937] border border-[#1F2937]",
    cardHover: "hover:border-[#22C55E] hover:shadow-lg hover:shadow-black/30",
    text: "text-white",
    textMuted: "text-[#9CA3AF]",
    input:
      "bg-[#111827] border border-[#374151] focus:border-[#22C55E] text-white",
    badge: "bg-[#14532D] text-[#86EFAC]",
    accent: "#22C55E",
    accentBg: "bg-[#22C55E]",
    accentHover: "hover:bg-[#16A34A]",
    accentText: "text-[#22C55E]",
    modal: "bg-[#1F2937]",
    divider: "border-[#1F2937]",
    activeSidebar: "bg-[#14532D] text-[#86EFAC]",
    tag: "bg-[#052E16] text-[#86EFAC]",
    filterActive: "bg-[#22C55E] text-[#052E16]",
    filterInactive: "bg-[#052E16] text-[#86EFAC] hover:bg-[#14532D]",
    mobileNav: "bg-[#111827] border-t border-[#1F2937]",
    overlay: "bg-black/60",
    uploadArea:
      "bg-[#052E16] border-2 border-dashed border-[#166534] hover:border-[#22C55E]",
    uploadAreaActive: "bg-[#14532D] border-[#22C55E]",
  },
};

// ─── API ─────────────────────────────────────────────────────────────────────
const api = {
  getNiveaux: async () => getAllNiveaux(),
  createNiveau: async (data) => createNiveau(data),
  updateNiveau: async (id, data) => updateNiveau(id, data),
  deleteNiveau: async (id) => deleteNiveau(id),
  getCourses: async () => await getAllCourses(),
  createCourse: async (data) => await createCourse(data),
  updateCourse: async (id, data) => await updateCourse(id, data),
  deleteCourse: async (id) => {
    await deleteCourse(id);
  },
  getChapters: async () => await getAllChapters(),
  createChapter: async (data) => await createChapter(data),
  updateChapter: async (id, data) => await updateChapter(id, data),
  deleteChapter: async (id) => {
    await deleteChapter(id);
    return { ok: true };
  },
  getSeries: async () => await getAllSeries(),
  createSerie: async (data) => await createSeries(data),
  updateSerie: async (id, data) => await updateSeries(id, data),
  deleteSerie: async (id) => {
    await deleteSeries(id);
    return { ok: true };
  },
};

// ─── File Upload Field ────────────────────────────────────────────────────────
/**
 * FileUploadField
 * Props:
 *  - label: string
 *  - currentUrl: string | null  (existing URL from DB, shown when no new file picked)
 *  - onUploaded: (url: string) => void  (called after successful Cloudinary upload)
 *  - onClear: () => void  (called when user removes the file/url)
 *  - accept: string  (e.g. "application/pdf,image/*")
 *  - t: theme object
 */
const FileUploadField = ({
  label,
  currentUrl,
  onUploaded,
  onClear,
  accept = "*/*",
  t,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [localFileName, setLocalFileName] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setLocalFileName(file.name);
    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadFileToCloudinary(file, setProgress);
      onUploaded(result.url);
    } catch {
      setLocalFileName(null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const displayUrl = currentUrl;
  const fileName =
    localFileName || (displayUrl ? displayUrl.split("/").pop() : null);

  const handleClear = () => {
    setLocalFileName(null);
    onClear();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium opacity-70">{label}</label>
      )}

      {/* Show current file if exists */}
      {displayUrl && !uploading && (
        <div
          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs ${t.tag} border ${t.divider}`}
        >
          <button
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 flex-shrink-0"
          >
            <X size={13} />
          </button>
          <a
            href={displayUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate hover:underline flex-1 text-right"
          >
            {fileName || "عرض الملف"}
          </a>
          <File size={13} className="flex-shrink-0 opacity-60" />
        </div>
      )}

      {/* Upload area — shown when no file or to replace */}
      {!displayUrl && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl cursor-pointer transition-all duration-150 text-center
            ${dragOver ? t.uploadAreaActive : t.uploadArea}
            ${uploading ? "pointer-events-none" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className={`${t.accentText} animate-spin`} />
              <span className={`text-xs ${t.textMuted}`}>
                جارٍ الرفع... {progress}%
              </span>
              <div
                className={`w-full h-1.5 rounded-full bg-black/10 overflow-hidden`}
              >
                <div
                  className={`h-full ${t.accentBg} transition-all duration-200`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload size={18} className={t.accentText} />
              <span className={`text-xs ${t.textMuted}`}>
                اسحب الملف هنا أو{" "}
                <span className={`${t.accentText} font-medium`}>
                  اضغط للاختيار
                </span>
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}

      {/* Replace button when file already uploaded */}
      {displayUrl && !uploading && (
        <button
          onClick={() => inputRef.current?.click()}
          className={`text-xs ${t.accentText} hover:underline text-right`}
        >
          استبدال الملف
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
        </button>
      )}
    </div>
  );
};

// ─── Shared Components ────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.9 }}
    className={`fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium whitespace-nowrap
      ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
  >
    {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
    {message}
    <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100">
      <X size={14} />
    </button>
  </motion.div>
);

const UrlTag = ({ url, icon: Icon, label, t }) => {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${t.tag} hover:opacity-80 transition-opacity`}
    >
      <Icon size={11} />
      {label}
    </a>
  );
};

const Modal = ({ open, onClose, title, children, t }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
          className={`${t.modal} ${t.text} w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border ${t.divider} overflow-hidden`}
          dir="rtl"
        >
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${t.divider}`}
          >
            <h3 className="font-semibold text-base">{title}</h3>
            <button
              onClick={onClose}
              className={`${t.textMuted} transition-colors`}
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium opacity-70">{label}</label>}
    {children}
  </div>
);

const Inp = ({ label, t, ...props }) => (
  <Field label={label}>
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all text-right ${t.input} ${props.className || ""}`}
    />
  </Field>
);

const Sel = ({ label, t, children, ...props }) => (
  <Field label={label}>
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all text-right ${t.input}`}
    >
      {children}
    </select>
  </Field>
);

const DeleteConfirm = ({ open, onConfirm, onClose, t }) => (
  <Modal open={open} onClose={onClose} title="تأكيد الحذف" t={t}>
    <p className={`${t.textMuted} text-sm mb-6`}>
      هذا الإجراء لا يمكن التراجع عنه. هل تريد حذف هذا العنصر؟
    </p>
    <div className="flex gap-3 justify-start">
      <button
        onClick={onClose}
        className={`px-4 py-2 rounded-lg text-sm border ${t.divider} ${t.textMuted} hover:opacity-80`}
      >
        إلغاء
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        حذف
      </button>
    </div>
  </Modal>
);

const StatCard = ({ icon: Icon, label, value, color, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${t.card} ${t.cardHover} rounded-2xl p-4 sm:p-5 transition-all duration-200`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-xs ${t.textMuted} mb-1`}>{label}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${t.text}`}>{value}</p>
      </div>
      <div
        className="p-2.5 rounded-xl"
        style={{ backgroundColor: color + "22" }}
      >
        <Icon size={20} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

// ─── Niveau Filter Pills ──────────────────────────────────────────────────────
const NiveauFilter = ({ niveaux, value, onChange, t }) => (
  <div className="flex gap-2 flex-wrap flex-row-reverse mb-4">
    <button
      onClick={() => onChange("")}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
        ${value === "" ? t.filterActive : t.filterInactive}`}
    >
      <Filter size={11} />
      الكل
    </button>
    {niveaux.map((n) => (
      <button
        key={n.id}
        onClick={() => onChange(String(n.id))}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
          ${value === String(n.id) ? t.filterActive : t.filterInactive}`}
      >
        {n.label}
      </button>
    ))}
  </div>
);

// ─── Btn helpers ──────────────────────────────────────────────────────────────
const SaveBtn = ({ saving, editing, onClick, t }) => (
  <button
    onClick={onClick}
    disabled={saving}
    className={`px-4 py-2 rounded-lg text-sm ${t.accentBg} ${t.accentHover} text-[#1A1714] font-semibold flex items-center gap-2`}
  >
    {saving && <Loader2 size={14} className="animate-spin" />}
    {editing ? "تحديث" : "إنشاء"}
  </button>
);

const CancelBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm border ${t.divider} ${t.textMuted} hover:opacity-80`}
  >
    إلغاء
  </button>
);

const AddBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 ${t.accentBg} ${t.accentHover} text-[#1A1714] px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm`}
  >
    <Plus size={16} />
    <span className="hidden sm:inline">إضافة</span>
  </button>
);

const SearchBar = ({ value, onChange, placeholder, t }) => (
  <div
    className={`flex items-center gap-2 ${t.input} rounded-xl px-3 py-2 mb-3`}
  >
    <Search size={15} className={t.textMuted} />
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-transparent outline-none text-sm w-full text-right"
      dir="rtl"
    />
  </div>
);

const EditBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg ${t.tag} hover:opacity-80 transition-opacity`}
  >
    <Edit3 size={14} />
  </button>
);

const DelBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-lg bg-red-100 text-red-600 hover:opacity-80 transition-opacity"
  >
    <Trash2 size={14} />
  </button>
);

const SectionHeader = ({ title, count, unit, onAdd, t }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="text-right">
      <h2 className={`text-lg sm:text-xl font-bold ${t.text}`}>{title}</h2>
      <p className={`text-sm ${t.textMuted}`}>
        {count} {unit}
      </p>
    </div>
    <AddBtn onClick={onAdd} t={t} />
  </div>
);

const EmptyState = ({ t, label }) => (
  <p className={`text-center py-10 ${t.textMuted} text-sm`}>{label}</p>
);

// ─── Niveaux ──────────────────────────────────────────────────────────────────
const NiveauxSection = ({ t, toast }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: "", label: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getNiveaux().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", label: "" });
    setModal(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ code: item.code, label: item.label });
    setModal(true);
  };

  const save = async () => {
    if (!form.code || !form.label) return;
    setSaving(true);
    try {
      if (editing) {
        const u = await api.updateNiveau(editing.id, form);
        setData((d) => d.map((x) => (x.id === editing.id ? u : x)));
        toast("تم تحديث المستوى", "success");
      } else {
        const n = await api.createNiveau(form);
        setData((d) => [...d, n]);
        toast("تم إنشاء المستوى", "success");
      }
      setModal(false);
    } catch {
      toast("حدث خطأ", "error");
    }
    setSaving(false);
  };

  const del = async () => {
    await api.deleteNiveau(deleteId);
    setData((d) => d.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    toast("تم حذف المستوى", "success");
  };

  const filtered = data.filter(
    (x) =>
      x.label.includes(search) ||
      x.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <SectionHeader
        title="المستويات"
        count={data.length}
        unit="مستويات مسجّلة"
        onAdd={openAdd}
        t={t}
      />
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="البحث عن مستوى..."
        t={t}
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className={`${t.accentText} animate-spin`} />
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className={`${t.card} ${t.cardHover} rounded-xl p-4 flex items-center justify-between transition-all duration-200`}
              >
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className={`p-2 rounded-lg ${t.badge}`}>
                    <GraduationCap size={18} />
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${t.text}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${t.textMuted}`}>{item.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DelBtn onClick={() => setDeleteId(item.id)} />
                  <EditBtn onClick={() => openEdit(item)} t={t} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <EmptyState t={t} label="لا توجد مستويات" />
          )}
        </div>
      )}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "تعديل المستوى" : "مستوى جديد"}
        t={t}
      >
        <div className="flex flex-col gap-4">
          <Inp
            label="الرمز"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="مثال: PREMIERE"
            t={t}
          />
          <Inp
            label="التسمية"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="مثال: السنة الأولى"
            t={t}
          />
          <div className="flex gap-3 justify-start mt-2">
            <CancelBtn onClick={() => setModal(false)} t={t} />
            <SaveBtn saving={saving} editing={editing} onClick={save} t={t} />
          </div>
        </div>
      </Modal>
      <DeleteConfirm
        open={!!deleteId}
        onConfirm={del}
        onClose={() => setDeleteId(null)}
        t={t}
      />
    </div>
  );
};

// ─── Courses ──────────────────────────────────────────────────────────────────
const CoursesSection = ({ t, toast }) => {
  const [data, setData] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    niveauId: "",
    videoUrl: "",
    resumeUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("");

  useEffect(() => {
    Promise.all([api.getCourses(), api.getNiveaux()]).then(([c, n]) => {
      setData(c);
      setNiveaux(n);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: "",
      niveauId: niveauFilter || niveaux[0]?.id || "",
      videoUrl: "",
      resumeUrl: "",
    });
    setModal(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      niveauId: item.niveauId,
      videoUrl: item.videoUrl || "",
      resumeUrl: item.resumeUrl || "",
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.title || !form.niveauId) return;
    setSaving(true);
    const payload = {
      ...form,
      niveauId: Number(form.niveauId),
      videoUrl: form.videoUrl || null,
      resumeUrl: form.resumeUrl || null,
    };
    try {
      if (editing) {
        const u = await api.updateCourse(editing.id, payload);
        setData((d) => d.map((x) => (x.id === editing.id ? u : x)));
        toast("تم تحديث الدرس", "success");
      } else {
        const n = await api.createCourse(payload);
        setData((d) => [...d, n]);
        toast("تم إنشاء الدرس", "success");
      }
      setModal(false);
    } catch {
      toast("حدث خطأ", "error");
    }
    setSaving(false);
  };

  const del = async () => {
    await api.deleteCourse(deleteId);
    setData((d) => d.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    toast("تم حذف الدرس", "success");
  };

  const getNiveauLabel = (id) => niveaux.find((n) => n.id === id)?.label || "—";
  const filtered = data.filter((x) => {
    const matchSearch = x.title.includes(search);
    const matchNiveau =
      niveauFilter === "" || String(x.niveauId) === niveauFilter;
    return matchSearch && matchNiveau;
  });

  return (
    <div>
      <SectionHeader
        title="الدروس"
        count={data.length}
        unit="دروس مسجّلة"
        onAdd={openAdd}
        t={t}
      />
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="البحث عن درس..."
        t={t}
      />
      <NiveauFilter
        niveaux={niveaux}
        value={niveauFilter}
        onChange={setNiveauFilter}
        t={t}
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className={`${t.accentText} animate-spin`} />
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className={`${t.card} ${t.cardHover} rounded-xl p-4 transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <DelBtn onClick={() => setDeleteId(item.id)} />
                    <EditBtn onClick={() => openEdit(item)} t={t} />
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse min-w-0">
                    <div className={`p-2 rounded-lg ${t.badge} flex-shrink-0`}>
                      <BookOpen size={18} />
                    </div>
                    <div className="text-right min-w-0">
                      <p className={`font-semibold text-sm ${t.text} truncate`}>
                        {item.title}
                      </p>
                      <p className={`text-xs ${t.textMuted}`}>
                        {getNiveauLabel(item.niveauId)}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap justify-end">
                        <UrlTag
                          url={item.videoUrl}
                          icon={Video}
                          label="فيديو"
                          t={t}
                        />
                        <UrlTag
                          url={item.resumeUrl}
                          icon={FileText}
                          label="ملخص"
                          t={t}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && <EmptyState t={t} label="لا توجد دروس" />}
        </div>
      )}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "تعديل الدرس" : "درس جديد"}
        t={t}
      >
        <div className="flex flex-col gap-4">
          <Inp
            label="العنوان"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="عنوان الدرس"
            t={t}
          />
          <Sel
            label="المستوى"
            value={form.niveauId}
            onChange={(e) =>
              setForm((f) => ({ ...f, niveauId: e.target.value }))
            }
            t={t}
          >
            <option value="">اختر المستوى</option>
            {niveaux.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </Sel>
          <Inp
            label="رابط الفيديو (اختياري)"
            value={form.videoUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, videoUrl: e.target.value }))
            }
            placeholder="https://..."
            t={t}
          />
          {/* ── resumeUrl → file upload ── */}
          <FileUploadField
            label="ملف الملخص (اختياري)"
            currentUrl={form.resumeUrl}
            onUploaded={(url) => setForm((f) => ({ ...f, resumeUrl: url }))}
            onClear={() => setForm((f) => ({ ...f, resumeUrl: "" }))}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            t={t}
          />
          <div className="flex gap-3 justify-start mt-2">
            <CancelBtn onClick={() => setModal(false)} t={t} />
            <SaveBtn saving={saving} editing={editing} onClick={save} t={t} />
          </div>
        </div>
      </Modal>
      <DeleteConfirm
        open={!!deleteId}
        onConfirm={del}
        onClose={() => setDeleteId(null)}
        t={t}
      />
    </div>
  );
};

// ─── Chapters ─────────────────────────────────────────────────────────────────
const ChaptersSection = ({ t, toast }) => {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    courseId: "",
    videoUrl: "",
    resumeUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("");

  useEffect(() => {
    Promise.all([api.getChapters(), api.getCourses(), api.getNiveaux()]).then(
      ([ch, co, n]) => {
        setData(ch);
        setCourses(co);
        setNiveaux(n);
        setLoading(false);
      },
    );
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", courseId: "", videoUrl: "", resumeUrl: "" });
    setModal(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      courseId: item.courseId,
      videoUrl: item.videoUrl || "",
      resumeUrl: item.resumeUrl || "",
    });
    setModal(true);
  };

  const modalCourses = niveauFilter
    ? courses.filter((c) => String(c.niveauId) === niveauFilter)
    : courses;

  const save = async () => {
    if (!form.title || !form.courseId) return;
    setSaving(true);
    const payload = {
      ...form,
      courseId: Number(form.courseId),
      videoUrl: form.videoUrl || null,
      resumeUrl: form.resumeUrl || null,
    };
    try {
      if (editing) {
        const u = await api.updateChapter(editing.id, payload);
        setData((d) => d.map((x) => (x.id === editing.id ? u : x)));
        toast("تم تحديث الفصل", "success");
      } else {
        const n = await api.createChapter(payload);
        setData((d) => [...d, n]);
        toast("تم إنشاء الفصل", "success");
      }
      setModal(false);
    } catch {
      toast("حدث خطأ", "error");
    }
    setSaving(false);
  };

  const del = async () => {
    await api.deleteChapter(deleteId);
    setData((d) => d.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    toast("تم حذف الفصل", "success");
  };

  const getCourseTitle = (id) => courses.find((c) => c.id === id)?.title || "—";

  function matchNiveauFilter(chapter, filter, coursesList) {
    if (filter === "") return true;
    const course = coursesList.find((c) => c.id === chapter.courseId);
    return course ? String(course.niveauId) === filter : false;
  }

  const filtered = data.filter((x) => {
    const matchSearch = x.title.includes(search);
    if (!matchNiveauFilter(x, niveauFilter, courses)) return false;
    return matchSearch;
  });

  return (
    <div>
      <SectionHeader
        title="الفصول"
        count={data.length}
        unit="فصول مسجّلة"
        onAdd={openAdd}
        t={t}
      />
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="البحث عن فصل..."
        t={t}
      />
      <NiveauFilter
        niveaux={niveaux}
        value={niveauFilter}
        onChange={setNiveauFilter}
        t={t}
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className={`${t.accentText} animate-spin`} />
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className={`${t.card} ${t.cardHover} rounded-xl p-4 transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <DelBtn onClick={() => setDeleteId(item.id)} />
                    <EditBtn onClick={() => openEdit(item)} t={t} />
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse min-w-0">
                    <div className={`p-2 rounded-lg ${t.badge} flex-shrink-0`}>
                      <Layers size={18} />
                    </div>
                    <div className="text-right min-w-0">
                      <p className={`font-semibold text-sm ${t.text} truncate`}>
                        {item.title}
                      </p>
                      <p className={`text-xs ${t.textMuted} truncate`}>
                        {getCourseTitle(item.courseId)}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap justify-end">
                        <UrlTag
                          url={item.videoUrl}
                          icon={Video}
                          label="فيديو"
                          t={t}
                        />
                        <UrlTag
                          url={item.resumeUrl}
                          icon={FileText}
                          label="ملخص"
                          t={t}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && <EmptyState t={t} label="لا توجد فصول" />}
        </div>
      )}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "تعديل الفصل" : "فصل جديد"}
        t={t}
      >
        <div className="flex flex-col gap-4">
          <Inp
            label="العنوان"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="عنوان الفصل"
            t={t}
          />
          <Sel
            label="الدرس"
            value={form.courseId}
            onChange={(e) =>
              setForm((f) => ({ ...f, courseId: e.target.value }))
            }
            t={t}
          >
            <option value="">اختر الدرس</option>
            {modalCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Sel>
          <Inp
            label="رابط الفيديو (اختياري)"
            value={form.videoUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, videoUrl: e.target.value }))
            }
            placeholder="https://..."
            t={t}
          />
          {/* ── resumeUrl → file upload ── */}
          <FileUploadField
            label="ملف الملخص (اختياري)"
            currentUrl={form.resumeUrl}
            onUploaded={(url) => setForm((f) => ({ ...f, resumeUrl: url }))}
            onClear={() => setForm((f) => ({ ...f, resumeUrl: "" }))}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            t={t}
          />
          <div className="flex gap-3 justify-start mt-2">
            <CancelBtn onClick={() => setModal(false)} t={t} />
            <SaveBtn saving={saving} editing={editing} onClick={save} t={t} />
          </div>
        </div>
      </Modal>
      <DeleteConfirm
        open={!!deleteId}
        onConfirm={del}
        onClose={() => setDeleteId(null)}
        t={t}
      />
    </div>
  );
};

// ─── Series ───────────────────────────────────────────────────────────────────
const SeriesSection = ({ t, toast }) => {
  const [data, setData] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    label: "",
    chapterId: "",
    serieUrl: "",
    solutionUrl: "",
    videoUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("");

  useEffect(() => {
    Promise.all([
      api.getSeries(),
      api.getChapters(),
      api.getCourses(),
      api.getNiveaux(),
    ]).then(([s, ch, co, n]) => {
      setData(s);
      setChapters(ch);
      setCourses(co);
      setNiveaux(n);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      label: "",
      chapterId: "",
      serieUrl: "",
      solutionUrl: "",
      videoUrl: "",
    });
    setModal(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      label: item.label,
      chapterId: item.chapterId,
      serieUrl: item.serieUrl || "",
      solutionUrl: item.solutionUrl || "",
      videoUrl: item.videoUrl || "",
    });
    setModal(true);
  };

  const modalChapters = niveauFilter
    ? chapters.filter((ch) => {
        const course = courses.find((c) => c.id === ch.courseId);
        return course ? String(course.niveauId) === niveauFilter : false;
      })
    : chapters;

  const save = async () => {
    if (!form.label || !form.chapterId) return;
    setSaving(true);
    const payload = {
      ...form,
      chapterId: Number(form.chapterId),
      serieUrl: form.serieUrl || null,
      solutionUrl: form.solutionUrl || null,
      videoUrl: form.videoUrl || null,
    };
    try {
      if (editing) {
        const u = await api.updateSerie(editing.id, payload);
        setData((d) => d.map((x) => (x.id === editing.id ? u : x)));
        toast("تم تحديث السلسلة", "success");
      } else {
        const n = await api.createSerie(payload);
        setData((d) => [...d, n]);
        toast("تم إنشاء السلسلة", "success");
      }
      setModal(false);
    } catch {
      toast("حدث خطأ", "error");
    }
    setSaving(false);
  };

  const del = async () => {
    await api.deleteSerie(deleteId);
    setData((d) => d.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    toast("تم حذف السلسلة", "success");
  };

  const getChapterTitle = (id) =>
    chapters.find((c) => c.id === id)?.title || "—";

  function getNiveauIdForSerie(serie) {
    const chapter = chapters.find((ch) => ch.id === serie.chapterId);
    if (!chapter) return null;
    const course = courses.find((c) => c.id === chapter.courseId);
    return course ? course.niveauId : null;
  }

  const filtered = data.filter((x) => {
    const matchSearch = x.label.includes(search);
    if (!matchSearch) return false;
    if (niveauFilter === "") return true;
    return String(getNiveauIdForSerie(x)) === niveauFilter;
  });

  return (
    <div>
      <SectionHeader
        title="السلاسل"
        count={data.length}
        unit="سلاسل مسجّلة"
        onAdd={openAdd}
        t={t}
      />
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="البحث عن سلسلة..."
        t={t}
      />
      <NiveauFilter
        niveaux={niveaux}
        value={niveauFilter}
        onChange={setNiveauFilter}
        t={t}
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className={`${t.accentText} animate-spin`} />
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className={`${t.card} ${t.cardHover} rounded-xl p-4 transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <DelBtn onClick={() => setDeleteId(item.id)} />
                    <EditBtn onClick={() => openEdit(item)} t={t} />
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse min-w-0">
                    <div className={`p-2 rounded-lg ${t.badge} flex-shrink-0`}>
                      <ClipboardList size={18} />
                    </div>
                    <div className="text-right min-w-0">
                      <p className={`font-semibold text-sm ${t.text} truncate`}>
                        {item.label}
                      </p>
                      <p className={`text-xs ${t.textMuted} truncate`}>
                        {getChapterTitle(item.chapterId)}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap justify-end">
                        <UrlTag
                          url={item.serieUrl}
                          icon={Link}
                          label="السلسلة"
                          t={t}
                        />
                        <UrlTag
                          url={item.solutionUrl}
                          icon={Check}
                          label="الحل"
                          t={t}
                        />
                        <UrlTag
                          url={item.videoUrl}
                          icon={Video}
                          label="فيديو"
                          t={t}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && <EmptyState t={t} label="لا توجد سلاسل" />}
        </div>
      )}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "تعديل السلسلة" : "سلسلة جديدة"}
        t={t}
      >
        <div className="flex flex-col gap-4">
          <Inp
            label="التسمية"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="مثال: السلسلة 1 - تمارين أساسية"
            t={t}
          />
          <Sel
            label="الفصل"
            value={form.chapterId}
            onChange={(e) =>
              setForm((f) => ({ ...f, chapterId: e.target.value }))
            }
            t={t}
          >
            <option value="">اختر الفصل</option>
            {modalChapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Sel>

          {/* ── serieUrl → file upload ── */}
          <FileUploadField
            label="ملف السلسلة (اختياري)"
            currentUrl={form.serieUrl}
            onUploaded={(url) => setForm((f) => ({ ...f, serieUrl: url }))}
            onClear={() => setForm((f) => ({ ...f, serieUrl: "" }))}
            accept="application/pdf,image/*"
            t={t}
          />

          {/* ── solutionUrl → file upload ── */}
          <FileUploadField
            label="ملف الحل (اختياري)"
            currentUrl={form.solutionUrl}
            onUploaded={(url) => setForm((f) => ({ ...f, solutionUrl: url }))}
            onClear={() => setForm((f) => ({ ...f, solutionUrl: "" }))}
            accept="application/pdf,image/*"
            t={t}
          />

          <Inp
            label="رابط الفيديو (اختياري)"
            value={form.videoUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, videoUrl: e.target.value }))
            }
            placeholder="https://..."
            t={t}
          />
          <div className="flex gap-3 justify-start mt-2">
            <CancelBtn onClick={() => setModal(false)} t={t} />
            <SaveBtn saving={saving} editing={editing} onClick={save} t={t} />
          </div>
        </div>
      </Modal>
      <DeleteConfirm
        open={!!deleteId}
        onConfirm={del}
        onClose={() => setDeleteId(null)}
        t={t}
      />
    </div>
  );
};

// ─── Overview ─────────────────────────────────────────────────────────────────
const Overview = ({ t }) => {
  const [stats, setStats] = useState({
    niveaux: 0,
    courses: 0,
    chapters: 0,
    series: 0,
  });
  useEffect(() => {
    Promise.all([
      api.getNiveaux(),
      api.getCourses(),
      api.getChapters(),
      api.getSeries(),
    ]).then(([n, c, ch, s]) => {
      setStats({
        niveaux: n.length,
        courses: c.length,
        chapters: ch.length,
        series: s.length,
      });
    });
  }, []);

  const cards = [
    {
      icon: GraduationCap,
      label: "المستويات",
      value: stats.niveaux,
      color: "#C4A882",
    },
    { icon: BookOpen, label: "الدروس", value: stats.courses, color: "#7BBFA0" },
    { icon: Layers, label: "الفصول", value: stats.chapters, color: "#7B9EC4" },
    {
      icon: ClipboardList,
      label: "السلاسل",
      value: stats.series,
      color: "#C47B9E",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-right"
      >
        <h2 className={`text-xl sm:text-2xl font-bold ${t.text} mb-1`}>
          أهلاً وسهلاً 👋
        </h2>
        <p className={`${t.textMuted} text-sm`}>
          أدِر محتواك التعليمي من لوحة التحكم هذه.
        </p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...c} t={t} />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`${t.card} rounded-2xl p-4 sm:p-5`}
      >
        <h3 className={`font-semibold text-sm ${t.text} mb-4 text-right`}>
          هيكل المحتوى
        </h3>
        <div className="flex items-center gap-2 flex-wrap flex-row-reverse text-xs">
          {[
            { icon: GraduationCap, label: "المستوى" },
            { icon: ChevronLeft, label: null },
            { icon: BookOpen, label: "الدرس" },
            { icon: ChevronLeft, label: null },
            { icon: Layers, label: "الفصل" },
            { icon: ChevronLeft, label: null },
            { icon: ClipboardList, label: "السلسلة" },
          ]
            .reverse()
            .map((item, i) =>
              item.label ? (
                <span
                  key={i}
                  className={`flex items-center gap-1.5 ${t.tag} px-3 py-1.5 rounded-lg`}
                >
                  <item.icon size={13} /> {item.label}
                </span>
              ) : (
                <item.icon key={i} size={14} className={t.textMuted} />
              ),
            )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { key: "overview", label: "نظرة عامة", icon: Eye },
  { key: "niveaux", label: "المستويات", icon: GraduationCap },
  { key: "courses", label: "الدروس", icon: BookOpen },
  { key: "chapters", label: "الفصول", icon: Layers },
  { key: "series", label: "السلاسل", icon: ClipboardList },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const t = THEMES[isDark ? "dark" : "light"];

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const sections = {
    overview: <Overview t={t} />,
    niveaux: <NiveauxSection t={t} toast={showToast} />,
    courses: <CoursesSection t={t} toast={showToast} />,
    chapters: <ChaptersSection t={t} toast={showToast} />,
    series: <SeriesSection t={t} toast={showToast} />,
  };

  const handleNavClick = (key) => {
    setActive(key);
    setMobileSidebarOpen(false);
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-row ${t.bg} transition-colors duration-300`}
      style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-30 ${t.overlay} md:hidden`}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${t.sidebar} flex-col h-screen sticky top-0 overflow-hidden z-20 hidden md:flex`}
      >
        <div
          className={`flex items-center gap-3 flex-row-reverse px-4 py-5 border-b ${t.divider}`}
        >
          <div
            className={`w-8 h-8 rounded-xl ${t.accentBg} flex items-center justify-center flex-shrink-0`}
          >
            <BookMarked size={16} className="text-[#1A1714]" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`font-bold text-sm ${t.text} whitespace-nowrap`}
              >
                إدارة التعليم
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 flex-row-reverse px-3 py-2.5 rounded-xl transition-all duration-150 text-right w-full
                ${active === item.key ? t.activeSidebar : t.textMuted}`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
        <div className={`px-2 py-4 border-t ${t.divider} flex flex-col gap-2`}>
          <button
            onClick={() => setIsDark((d) => !d)}
            className={`flex items-center gap-3 flex-row-reverse px-3 py-2.5 rounded-xl ${t.textMuted} transition-all duration-150 w-full`}
          >
            {isDark ? (
              <Sun size={18} className="flex-shrink-0" />
            ) : (
              <Moon size={18} className="flex-shrink-0" />
            )}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {isDark ? "الوضع الفاتح" : "الوضع الداكن"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className={`flex items-center justify-center px-3 py-2 rounded-xl ${t.textMuted} transition-all duration-150 w-full`}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft size={16} />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${t.sidebar} fixed top-0 right-0 h-full w-64 z-40 flex flex-col md:hidden shadow-2xl`}
          >
            <div
              className={`flex items-center justify-between px-4 py-5 border-b ${t.divider}`}
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className={t.textMuted}
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-2 flex-row-reverse">
                <div
                  className={`w-8 h-8 rounded-xl ${t.accentBg} flex items-center justify-center flex-shrink-0`}
                >
                  <BookMarked size={16} className="text-[#1A1714]" />
                </div>
                <span className={`font-bold text-sm ${t.text}`}>
                  إدارة التعليم
                </span>
              </div>
            </div>
            <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
              {NAV.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`flex items-center gap-3 flex-row-reverse px-3 py-3 rounded-xl transition-all duration-150 text-right w-full
                    ${active === item.key ? t.activeSidebar : t.textMuted}`}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className={`px-2 py-4 border-t ${t.divider}`}>
              <button
                onClick={() => setIsDark((d) => !d)}
                className={`flex items-center gap-3 flex-row-reverse px-3 py-2.5 rounded-xl ${t.textMuted} transition-all duration-150 w-full`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-sm font-medium">
                  {isDark ? "الوضع الفاتح" : "الوضع الداكن"}
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <main className="flex-1 min-h-screen overflow-y-auto pb-20 md:pb-0">
        <div
          className={`md:hidden flex items-center justify-between px-4 py-3 border-b ${t.divider} ${t.bg} sticky top-0 z-10`}
        >
          <button
            onClick={() => setIsDark((d) => !d)}
            className={`p-2 rounded-xl ${t.textMuted}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-xl ${t.accentBg} flex items-center justify-center`}
            >
              <BookMarked size={14} className="text-[#1A1714]" />
            </div>
            <span className={`font-bold text-sm ${t.text}`}>إدارة التعليم</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className={`p-2 rounded-xl ${t.textMuted}`}
          >
            <Menu size={20} />
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {sections[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-20 ${t.mobileNav} flex items-center justify-around px-2 py-2`}
      >
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 flex-1
              ${active === item.key ? t.activeSidebar : t.textMuted}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
