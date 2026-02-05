import { useState } from "react";
import { useDispatch } from "react-redux";
import { ParentSignup } from "../../services/Auth/Auth";
import { MESSAGE } from "../../constants/AuthErrorMessages";
import { showToast } from "../../utils/toast";
import { setCredentials } from "../../store/slice/authslice";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";


export default function ParentSignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ----------------- Form Submit -----------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.studentId || !form.email || !form.password || !form.confirmPassword) {
      showToast(MESSAGE.ERROR.FIELDS_REQUIRED, "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast(MESSAGE.ERROR.COMFIRM_PASS, "error");
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
      setLoading(true);
      await ParentSignup({
        studentId: form.studentId,
        email: form.email,
        password: form.password,
      });

      showToast("Parent signed up successfully", "success");
      navigate("/parent/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      showToast(error.response?.data?.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  }

  // ----------------- Google Signup -----------------


  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-inter">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Parent Signup
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          Enter details to create your parent account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Student ID"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading ? "Processing..." : "SIGN UP"}
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


      


        <p className="text-gray-300 mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
