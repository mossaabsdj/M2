"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";

import { User, Mail, Phone, Globe, Lock, Loader2, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import LoadingPage from "@/app/component/loading/page";

export default function CompteParamPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const { data: session, status, update } = useSession();

  const [loading, setLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    console.log(session);
  }, [session]);

  // ✅ جلب بيانات الحساب
  useEffect(() => {
    const fetchCompte = async () => {
      try {
        setLoading(true);
        const email = session?.user.email;
        if (!email) {
          return;
        }
        const res = await fetch(
          `/api/compte?email=${encodeURIComponent(email)}`,
        );
        const data = await res.json();

        if (res.ok) {
          setForm({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            country: data.country || "",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: data.error || "تعذّر تحميل معلوماتك.",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "خطأ في الشبكة",
          text: "تعذّر جلب بيانات الحساب.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCompte();
  }, [session]);

  // ✅ تحديث بيانات الحساب
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/compte", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        await update({
          user: {
            ...session.user,
            email: newEmail || session.user.email,
            name: form.fullName,
          },
        });
        Swal.fire({
          icon: "success",
          title: "تم تحديث الملف الشخصي",
          text: "تم تحديث معلوماتك بنجاح.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.error || "حدث خطأ أثناء التحديث.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الشبكة",
        text: "تعذّر تحديث الحساب.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ تغيير كلمة المرور
  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "كلمة مرور ضعيفة",
        text: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/compte", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم تحديث كلمة المرور",
          timer: 1500,
          showConfirmButton: false,
        });
        setPasswordModal(false);
        setNewPassword("");
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.error || "تعذّر تغيير كلمة المرور.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الشبكة",
        text: "فشل الاتصال بالخادم.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ تغيير البريد الإلكتروني
  const handleEmailChange = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      Swal.fire({
        icon: "warning",
        title: "بريد إلكتروني غير صالح",
        text: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/compte", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, newEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم تحديث البريد الإلكتروني",
          text: "تم تغيير بريدك الإلكتروني بنجاح.",
          timer: 1500,
          showConfirmButton: false,
        });

        setForm({ ...form, email: newEmail });
        setEmailModal(false);
        setNewEmail("");

        Swal.fire({
          icon: "info",
          title: "يرجى تسجيل الدخول مجدداً",
          text: "يجب تحديث جلستك بعد هذا التعديل.",
        }).then(() => {
          signOut({ callbackUrl: "/Login" });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.error || "تعذّر تحديث البريد الإلكتروني.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الشبكة",
        text: "تعذّر الاتصال بالخادم.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingPage isVisible={true} />}

      <div
        dir="rtl"
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      >
        <Card className="w-full max-w-lg shadow-xl border-none rounded-2xl bg-white">
          <CardContent className="p-8 space-y-6">
            {/* رأس الملف الشخصي */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-black text-white w-24 h-24 rounded-full flex items-center justify-center shadow-lg">
                <User size={50} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                إعدادات الحساب
              </h2>
              <p className="text-sm text-gray-500">
                إدارة معلوماتك الشخصية وأمان حسابك.
              </p>
            </div>

            {/* نموذج المعلومات */}
            <div className="space-y-4 mt-8">
              <div className="relative">
                <User
                  className="absolute right-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  className="pr-10 text-right"
                  placeholder="الاسم الكامل"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute right-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  className="pr-10 pl-20 text-right"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={form.email}
                  disabled
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-2 top-2 text-gray-600 border-gray-300"
                  onClick={() => setEmailModal(true)}
                >
                  <Edit3 size={15} className="ml-1" /> تعديل
                </Button>
              </div>

              <div className="relative">
                <Phone
                  className="absolute right-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  className="pr-10 text-right"
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={form.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d+]/g, "");
                    if (value.includes("+"))
                      value = "+" + value.replace(/\+/g, "");
                    if (value.length > 13) value = value.slice(0, 13);
                    setForm({ ...form, phone: value });
                  }}
                />
              </div>

              <div className="relative">
                <Globe
                  className="absolute right-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  className="pr-10 text-right"
                  placeholder="الدولة"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between items-stretch sm:items-center pt-2">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 w-full sm:w-auto"
                  onClick={() => setPasswordModal(true)}
                >
                  <Lock className="ml-2" size={16} /> تغيير كلمة المرور
                </Button>

                <Button
                  className="bg-black text-white px-6 w-full sm:w-auto"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin ml-2" size={16} />
                  ) : null}
                  تحديث المعلومات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔐 نافذة تغيير كلمة المرور */}
      <Dialog open={passwordModal} onOpenChange={setPasswordModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تغيير كلمة المرور</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-right"
            />
          </div>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-start">
            <Button variant="outline" onClick={() => setPasswordModal(false)}>
              إلغاء
            </Button>
            <Button
              className="bg-black text-white"
              onClick={handlePasswordChange}
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 📧 نافذة تغيير البريد الإلكتروني */}
      <Dialog open={emailModal} onOpenChange={setEmailModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              تغيير البريد الإلكتروني
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="البريد الإلكتروني الجديد"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="text-right"
            />
          </div>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-start">
            <Button variant="outline" onClick={() => setEmailModal(false)}>
              إلغاء
            </Button>
            <Button className="bg-black text-white" onClick={handleEmailChange}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
