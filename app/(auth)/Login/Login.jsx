"use client";
import { Eye, EyeOff } from "lucide-react";

import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { countries } from "@/data/countries";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import OtpModal from "@/app/component/OtpModal";
import ForgotOtpModal from "@/app/component/OtpModalForgot";
import Progression from "@/app/component/Proogression/page";

const COLORS = {
  formBorder: "border-green-500",
  formFocus: "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
  buttonBg: "bg-emerald-500",
  buttonHover: "hover:bg-emerald-600",
  socialBg: "bg-green-100",
  rightPaneBg: "bg-emerald-500",
};

const SOCIAL_ICONS = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaTwitter, label: "Twitter" },
  { Icon: FaInstagram, label: "Instagram" },
];

const FormInput = ({ type, placeholder, value, onChange, className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    dir="rtl"
    className={`h-14 px-4 rounded-lg border-2 ${COLORS.formBorder} ${COLORS.formFocus} text-gray-800 outline-none transition text-right ${className}`}
    required
  />
);

const SocialButtons = () => (
  <div className="flex gap-4 mt-4">
    {SOCIAL_ICONS.map(({ Icon, label }, idx) => (
      <button
        key={idx}
        type="button"
        className={`${COLORS.socialBg} p-3 rounded-full shadow-md hover:scale-110 cursor-pointer transition ${COLORS.formFocus}`}
        aria-label={label}
      >
        <Icon className="text-emerald-600" />
      </button>
    ))}
  </div>
);

const WelcomeSection = ({ title, description, isRight }) => (
  <div
    className={`hidden md:flex w-full md:w-1/2 ${
      COLORS.rightPaneBg
    } text-white flex-col justify-center items-center text-center p-10 ${
      isRight ? "order-2" : "order-1"
    }`}
    style={{ minHeight: "600px" }}
    dir="rtl"
  >
    <img
      src="/images/logo.png"
      alt="الشعار"
      className="w-32 h-32 rounded-full mb-6 shadow-2xl object-cover bg-white"
    />
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-lg opacity-90 max-w-sm">{description}</p>
  </div>
);

export default function FlipAuthPages() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForogtOtpModal, setShowForogtOtpModal] = useState(false);

  const [pendingUser, setPendingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (field) => (e) => {
    setLoginData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleForgotPassword = () => {
    setShowResetPassword(true);
  };

  const handleRegisterChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "phone") {
      value = value.replace(/[^\d+]/g, "");
      if (value.includes("+")) {
        value = "+" + value.replace(/\+/g, "");
      }
      if (value.length > 13) value = value.slice(0, 13);
    }
    setRegisterData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "country") {
        const selectedCountry = countries.find((c) => c.name === value);
        if (selectedCountry) {
          updated.phone = selectedCountry.code + " ";
        }
      }
      return updated;
    });
  };

  const handleLoginSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const { email, password } = loginData;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/DashBoard",
    });
    setIsLoading(false);

    if (res?.ok) {
      Swal.fire({
        icon: "success",
        title: "تم تسجيل الدخول بنجاح",
        showConfirmButton: false,
        customClass: { popup: "shadow-lg rounded-lg" },
        timer: 1500,
      }).then(() => {
        setIsLoading(true);
        window.location.href = res.url;
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "فشل تسجيل الدخول",
        text: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        confirmButtonColor: "#d32f2f",
        customClass: { popup: "shadow-lg rounded-lg" },
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, country, password, confirmPassword } =
      registerData;

    if (
      !fullName ||
      !email ||
      !phone ||
      !country ||
      !password ||
      !confirmPassword
    ) {
      Swal.fire({
        icon: "warning",
        title: "حقول مفقودة",
        text: "يرجى ملء جميع الحقول المطلوبة.",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "بريد إلكتروني غير صالح",
        text: "يرجى إدخال بريد إلكتروني صحيح.",
      });
      return;
    }

    const phoneRegex = /^\+?\d{8,13}$/;
    if (!phoneRegex.test(phone)) {
      Swal.fire({
        icon: "error",
        title: "رقم هاتف غير صالح",
        text: "يجب أن يحتوي رقم الهاتف على أرقام فقط (مع + اختياري)، بين 8 و13 رقمًا.",
      });
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "كلمة مرور ضعيفة",
        text: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "كلمتا المرور غير متطابقتين",
        text: "يرجى التأكد من تطابق كلمتي المرور.",
      });
      return;
    }

    setIsLoading(true);
    const otpRes = await fetch("/api/register/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setIsLoading(false);

    if (!otpRes.ok) {
      Swal.fire({
        icon: "error",
        title: "فشل إرسال رمز التحقق",
      });
      return;
    }

    setPendingUser({
      fullName,
      email,
      phone,
      country,
      password,
      confirmPassword,
    });
    setShowOtpModal(true);
  };

  const handleResetPassword = () => {
    setShowResetPassword(false);
    setShowForogtOtpModal(true);
  };

  return (
    <>
      {showResetPassword && (
        <div
          className="  fixed inset-0 z-[1000] bg-opacity-40 backdrop-blur-md flex justify-center items-center"
          dir="rtl"
        >
          <div className="bg-white p-10 rounded-3xl w-[90%] max-w-xl shadow-2xl transform scale-105">
            <h3 className="text-3xl font-extrabold text-center mb-6">
              إعادة تعيين كلمة المرور
            </h3>

            <p className="text-gray-600 text-base mb-6 text-center">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.
            </p>

            <FormInput
              type="email"
              placeholder="البريد الإلكتروني"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="text-lg w-full"
            />

            <button
              onClick={handleResetPassword}
              className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-full shadow-md transition-colors"
            >
              التالي
            </button>

            <button
              className="w-full mt-3 text-gray-600 hover:text-gray-800 underline text-base transition-colors"
              onClick={() => setShowResetPassword(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {isLoading && <Progression isVisible={true} />}

      {showOtpModal && (
        <OtpModal
          email={pendingUser?.email || resetEmail}
          onExit={() => setShowOtpModal(false)}
          onVerify={{
            userData: pendingUser || resetEmail,
            success: () => {
              setShowOtpModal(false);
              setIsFlipped(false);
            },
          }}
        />
      )}

      {showForogtOtpModal && (
        <ForgotOtpModal
          email={resetEmail}
          onExit={() => setShowForogtOtpModal(false)}
        />
      )}

      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        dir="rtl"
      >
        <div className="w-full max-w-6xl" style={{ perspective: "2000px" }}>
          <div
            className="relative w-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
              minHeight: "600px",
            }}
          >
            {/* LOGIN PAGE (Front) */}
            <div
              className="absolute w-full"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <div className="flex flex-col md:flex-row-reverse bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Login Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center order-1">
                  <div className="w-full max-w-sm" dir="rtl">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-2 text-center">
                      تسجيل الدخول
                    </h2>
                    <p className="text-gray-500 mb-6 text-center">
                      مرحبًا بعودتك! يرجى تسجيل الدخول إلى حسابك.
                    </p>

                    <div className="w-full flex flex-col space-y-4">
                      <FormInput
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={loginData.email}
                        onChange={handleLoginChange("email")}
                        className="w-full"
                      />

                      <FormInput
                        type="password"
                        placeholder="كلمة المرور"
                        value={loginData.password}
                        onChange={handleLoginChange("password")}
                        className="w-full"
                      />

                      <button
                        onClick={handleLoginSubmit}
                        className={`w-full h-14 text-xl ${COLORS.buttonBg} text-white font-bold rounded-full shadow-md ${COLORS.buttonHover} hover:scale-105 transition-all duration-200 mt-2`}
                      >
                        تسجيل الدخول
                      </button>

                      <p className="text-gray-700 text-sm text-center pt-2">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-emerald-600 font-semibold hover:underline"
                        >
                          نسيت كلمة المرور؟
                        </button>
                      </p>

                      <p className="text-gray-700 text-sm text-center pt-2">
                        ليس لديك حساب؟{" "}
                        <button
                          type="button"
                          onClick={() => setIsFlipped(true)}
                          className="text-emerald-600 font-semibold hover:underline"
                        >
                          إنشاء حساب
                        </button>
                      </p>

                      <div className="flex justify-center">
                        <SocialButtons />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Welcome Section - Left (RTL: appears on right visually) */}
                <WelcomeSection
                  title="مرحبًا بعودتك!"
                  description="أدر طلباتك، استكشف منتجات جديدة، وتواصل مع مزارعك المفضلة — كل ذلك من مكان واحد."
                  isRight={true}
                />
              </div>
            </div>

            {/* REGISTER PAGE (Back) */}
            <div
              className="absolute w-full"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Welcome Section */}
                <WelcomeSection
                  title="انضم إلى مجتمعنا!"
                  description="أنشئ حسابًا للوصول إلى ميزات حصرية، وتتبع طلباتك، والتواصل مع المزارع المحلية."
                  isRight={false}
                />

                {/* Register Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center order-2">
                  <div className="w-full max-w-2xl" dir="rtl">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-2 text-center">
                      إنشاء حساب
                    </h2>
                    <p className="text-gray-500 mb-6 text-center">
                      أنشئ حسابك للبدء.
                    </p>

                    <div className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          type="text"
                          placeholder="الاسم الكامل"
                          value={registerData.fullName}
                          onChange={handleRegisterChange("fullName")}
                          className="w-full"
                        />
                        <FormInput
                          type="email"
                          placeholder="البريد الإلكتروني"
                          value={registerData.email}
                          onChange={handleRegisterChange("email")}
                          className="w-full"
                        />
                        <select
                          value={registerData.country}
                          onChange={handleRegisterChange("country")}
                          dir="rtl"
                          className={`h-14 px-4 rounded-lg border-2 ${COLORS.formBorder} ${COLORS.formFocus} text-gray-800 outline-none transition w-full text-right`}
                          required
                        >
                          <option value="">اختر الدولة</option>
                          {countries.map((country, idx) => (
                            <option key={idx} value={country.name}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                        <FormInput
                          type="tel"
                          placeholder="رقم الهاتف"
                          value={registerData.phone}
                          onChange={handleRegisterChange("phone")}
                          className="w-full"
                          maxLength={12}
                        />

                        <div className="relative w-full">
                          <FormInput
                            type={showPassword ? "text" : "password"}
                            placeholder="كلمة المرور"
                            value={registerData.password}
                            onChange={handleRegisterChange("password")}
                            className="w-full pl-10"
                          />
                          {/* Eye icon on LEFT side for RTL */}
                          <button
                            type="button"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onMouseLeave={() => setShowPassword(false)}
                            onTouchStart={() => setShowPassword(true)}
                            onTouchEnd={() => setShowPassword(false)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>

                        <div className="relative w-full">
                          <FormInput
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="تأكيد كلمة المرور"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange("confirmPassword")}
                            className="w-full pl-10"
                          />
                          {/* Eye icon on LEFT side for RTL */}
                          <button
                            type="button"
                            onMouseDown={() => setShowConfirmPassword(true)}
                            onMouseUp={() => setShowConfirmPassword(false)}
                            onMouseLeave={() => setShowConfirmPassword(false)}
                            onTouchStart={() => setShowConfirmPassword(true)}
                            onTouchEnd={() => setShowConfirmPassword(false)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleRegisterSubmit}
                        className={`w-full h-14 text-xl ${COLORS.buttonBg} text-white font-bold rounded-full shadow-md ${COLORS.buttonHover} hover:scale-105 transition-all duration-200 mt-6`}
                      >
                        إنشاء الحساب
                      </button>

                      <p className="text-gray-700 text-sm text-center pt-4">
                        هل لديك حساب بالفعل؟{" "}
                        <button
                          type="button"
                          onClick={() => setIsFlipped(false)}
                          className="text-emerald-600 font-semibold hover:underline"
                        >
                          تسجيل الدخول
                        </button>
                      </p>

                      <div className="flex justify-center">
                        <SocialButtons />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
