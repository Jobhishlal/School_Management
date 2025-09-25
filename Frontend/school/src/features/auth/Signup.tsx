



import { useState } from "react";
import { useDispatch } from "react-redux";
import { SignupAdmin } from "../../services/Auth/Auth"; 
import type { AdminDoc } from "../../types/Admin";
import { MESSAGE } from "../../constants/AuthErrorMessages";
import { showToast } from "../../utils/toast";
import { FcGoogle } from "react-icons/fc";
import { setCredentials } from "../../store/slice/authslice";
import { useNavigate } from "react-router-dom";
import  { AxiosError } from "axios";

export default function SignupAdminPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminDoc>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const dispatch = useDispatch();

  // ----------------- Signup Step -----------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      showToast(MESSAGE.ERROR.FIELDS_REQUIRED, "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast(MESSAGE.ERROR.COMFIRM_PASS, "error");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      showToast(MESSAGE.ERROR.USERVALID, "error");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      showToast(MESSAGE.ERROR.INVALID_EMAIL, "error");
      return;
    }
    if (form.password.length < 8) {
      showToast(MESSAGE.ERROR.WEAK_PASSWORD, "error");
      return;
    }

    try {
      const res = await SignupAdmin(form);
      navigate("/verify-otp", { state: { otpToken: res.otpToken } }); 
      showToast("OTP sent to your email!", "success");
    }
catch (err: unknown) {
  const error = err as AxiosError<{ message: string }>;

  if (error.response?.data?.message) {
    showToast(error.response.data.message, "error");
  } else {
    showToast("Signup failed", "error");
  }
}
  }

  // ----------------- Google Signup -----------------
  async function handleGoogleLogin() {
    try {
      const popup = window.open(
        "http://localhost:5000/auth/google",
        "_blank",
        "width=500,height=600"
      );

      const listener = (event: MessageEvent) => {
        if (event.origin !== "http://localhost:5000") return;

        const { accessToken, refreshToken, user, error } = event.data;

        if (error) {
          showToast(error, "error");
          popup?.close();
          window.removeEventListener("message", listener);
          return;
        }

        if (!accessToken || !refreshToken || !user) {
          console.error("Tokens not received");
          return;
        }

        dispatch(setCredentials({ accessToken, refreshToken, user }));

        window.removeEventListener("message", listener);
        popup?.close();
        showToast("Google login successful", "success");
      };

      window.addEventListener("message", listener);
      showToast("Google login initiated", "info");
    } catch (err) {
      console.error("Google login failed", err);
      showToast("Google login failed", "error");
    }
  }

  // ----------------- UI -----------------
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-inter">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          Sign Up
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Embark on your educational journey
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="User Name"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Send OTP
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1E1E1E] text-gray-300">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign Up with Google
        </button>

        <p className="text-gray-300 mt-6 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

