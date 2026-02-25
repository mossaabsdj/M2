"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    role: "CLIENT",
    password: "",
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsers(session.user.email);
    }
  }, [session]);

  const fetchUsers = async (currentEmail) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/users?email=${encodeURIComponent(currentEmail)}`,
      );
      const data = await res.json();

      if (res.ok) setUsers(data);
      else throw new Error(data.error || "فشل في جلب المستخدمين");
    } catch (err) {
      Swal.fire("خطأ", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "",
      role: "CLIENT",
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      country: user.country || "",
      role: user.role,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("تم الحذف!", "تم حذف المستخدم بنجاح.", "success");
        fetchUsers(session.user.email);
      } else {
        Swal.fire("خطأ", data.error || "فشل في حذف المستخدم", "error");
      }
    } catch (err) {
      Swal.fire("خطأ", "خطأ في الشبكة", "error");
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) {
      Swal.fire("تحذير", "الاسم الكامل مطلوب.", "warning");
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire("تحذير", "البريد الإلكتروني مطلوب.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("تحذير", "يرجى إدخال بريد إلكتروني صحيح.", "warning");
      return;
    }

    if (!formData.role) {
      Swal.fire("تحذير", "دور المستخدم مطلوب.", "warning");
      return;
    }

    if (!currentUser && (!formData.password || formData.password.length < 8)) {
      Swal.fire(
        "تحذير",
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل للمستخدمين الجدد.",
        "warning",
      );
      return;
    }

    if (formData.phone && !/^\+?\d{6,15}$/.test(formData.phone)) {
      Swal.fire(
        "تحذير",
        "رقم الهاتف يجب أن يحتوي على أرقام فقط (يمكن أن يبدأ بـ +).",
        "warning",
      );
      return;
    }

    try {
      setLoading(true);
      const method = currentUser ? "PUT" : "POST";
      const body = currentUser ? { id: currentUser.id, ...formData } : formData;

      const res = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          "نجاح",
          currentUser ? "تم تحديث المستخدم بنجاح!" : "تم إنشاء المستخدم بنجاح!",
          "success",
        );
        fetchUsers(session.user.email);
        setIsDialogOpen(false);
      } else {
        Swal.fire("خطأ", data.error || "فشل في حفظ المستخدم.", "error");
      }
    } catch (err) {
      Swal.fire("خطأ", "خطأ في الشبكة أثناء حفظ المستخدم.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    return role === "ADMIN" ? "bg-black text-white" : "bg-gray-200 text-black";
  };

  const getRoleLabel = (role) => {
    return role === "ADMIN" ? "مدير" : "عميل";
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white p-8"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');`}</style>

      <div className="max-w-full mx-auto">
        {/* الترويسة */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            إدارة المستخدمين
          </h1>
          <p className="text-gray-600">إدارة مستخدمي التطبيق وأدوارهم</p>
        </div>

        {/* شريط الإجراءات */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 px-5 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-black text-white hover:bg-gray-800"
          >
            <UserPlus className="w-4 h-4 ml-2" />
            إضافة مستخدم
          </Button>
        </div>

        {/* جدول المستخدمين */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    الاسم الكامل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    الدولة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black text-right">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {user.country || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="bg-white border-gray-200"
                          style={{ direction: "rtl" }}
                        >
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(user)}
                            className="cursor-pointer text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            لا يوجد مستخدمون يطابقون بحثك.
          </div>
        )}

        {/* نافذة إضافة / تعديل مستخدم */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className="bg-white border-gray-200 sm:max-w-[500px]"
            style={{
              direction: "rtl",
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-black text-right">
                {currentUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-right">
                {currentUser
                  ? "تحديث معلومات المستخدم ودوره."
                  : "أدخل التفاصيل لإنشاء حساب مستخدم جديد."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-black text-right">
                  الاسم الكامل *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="text-right border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black text-right">
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="text-right border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-black text-right">
                  الهاتف
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="text-right border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country" className="text-black text-right">
                  الدولة
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="text-right border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-black text-right">
                  الدور *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger
                    className="border-gray-300 focus:border-black focus:ring-black text-right"
                    style={{ direction: "rtl" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border-gray-200"
                    style={{ direction: "rtl" }}
                  >
                    <SelectItem value="CLIENT">عميل</SelectItem>
                    <SelectItem value="ADMIN">مدير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!currentUser && (
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-black text-right">
                    كلمة المرور *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="text-right border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="flex-row-reverse sm:flex-row-reverse gap-2">
              <Button
                onClick={handleSubmit}
                className="bg-black text-white hover:bg-gray-800"
              >
                {currentUser ? "حفظ التغييرات" : "إنشاء مستخدم"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-100"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* نافذة تأكيد الحذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent
            className="bg-white border-gray-200"
            style={{
              direction: "rtl",
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-black text-right">
                حذف المستخدم
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-right">
                هل أنت متأكد من حذف{" "}
                <span className="font-semibold text-black">
                  {userToDelete?.fullName}
                </span>
                ؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row-reverse sm:flex-row-reverse gap-2">
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                حذف
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-100"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
