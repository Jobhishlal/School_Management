

import { MainAdminLogin } from "../../services/Auth/Auth";
import { useState, useEffect } from "react";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AxiosError } from "axios";

type LoginType = "student" | "parent" | "staff";

export default function MainAdminLogincheck() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>("staff");


  useEffect(() => {
    const token = localStorage.getItem("accessToken"); 
    const role = localStorage.getItem("role");
    if (token && role) {
      switch (role) {
        case "students":
          navigate("/student-dashboard", { replace: true });
          break;
        case "parent":
          navigate("/parent/dashboard", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }
  }, []);


  //// current working code not remove this 

  // async function handleLogin(e: React.FormEvent) {
  //   e.preventDefault();

  //   // --- Validation ---
  //   if (loginType === "parent" && (!email || !studentId || !password)) {
  //     showToast("Please enter Email, Student ID, and Password", "error");
  //     return;
  //   }
  //   if (loginType === "student" && (!studentId || !password)) {
  //     showToast("Please enter Student ID and Password", "error");
  //     return;
  //   }
  //   if (loginType === "staff" && (!email || !password)) {
  //     showToast("Please enter Email and Password", "error");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // --- Call API ---
  //     const res = await MainAdminLogin(
  //       loginType === "parent" || loginType === "staff" ? email : undefined,
  //       password,
  //       loginType === "parent" || loginType === "student" ? studentId : undefined
  //     );

  //     // --- OTP Required ---
  //     if ("otpToken" in res && res.otpToken) {
  //       localStorage.setItem("otpToken", res.otpToken); // temporary token
  //       localStorage.setItem("role", res.role.toLowerCase());
  //       showToast("OTP sent to your email", "success");
  //       navigate("/verify-otp", { state: { otpToken: res.otpToken } });
  //       return;
  //     }

  //     if ("authToken" in res && res.authToken) {
  //       const role = res.role.toLowerCase();
  //       localStorage.setItem("accessToken", res.authToken);
  //       localStorage.setItem("role", role);
  //       showToast("Login successful", "success");

  //       switch (role) {
  //         case "students":
  //           navigate("/student-dashboard", { replace: true });
  //           break;
  //         case "parent":
  //           navigate("/parent/dashboard", { replace: true });
  //           break;
  //         default:
  //           navigate("/dashboard", { replace: true });
  //       }
  //       return;
  //     }

  //     showToast("Unexpected server response", "error");
  //   } catch (error: unknown) {
  //     const err = error as AxiosError<{ message: string }>;
  //     const message = err.response?.data?.message || err.message || "Login failed";
  //     showToast(message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  if (loginType === "parent" && (!email || !studentId || !password)) {
    showToast("Please enter Email, Student ID, and Password", "error");
    return;
  }

  try {
    setLoading(true);
    const res = await MainAdminLogin(
      loginType === "parent" || loginType === "staff" ? email : undefined,
      password,
      loginType === "parent" || loginType === "student" ? studentId : undefined
    );

    if ("otpToken" in res && res.otpToken) {
      localStorage.setItem("otpToken", res.otpToken);
      localStorage.setItem("role", res.role.toLowerCase());
      showToast("OTP sent to your email", "success");
      navigate("/verify-otp", { state: { otpToken: res.otpToken } });
      return;
    }

  
    if ("authToken" in res && res.authToken) {
      const role = res.role.toLowerCase();
      localStorage.setItem("accessToken", res.authToken);
      localStorage.setItem("role", role);

      if (role === "parent") {
        localStorage.setItem("email", email);
        localStorage.setItem("studentId", studentId);
      }

      showToast("Login successful", "success");

      switch (role) {
        case "students":
          navigate("/student-dashboard", { replace: true });
          break;
        case "parent":
          navigate("/parent/dashboard", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
      return;
    }

    showToast("Unexpected server response", "error");
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || err.message || "Login failed";
    showToast(message, "error");
  } finally {
    setLoading(false);
  }
}


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

        if (!accessToken || !refreshToken || !user) return;

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 font-inter">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-lg border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-2">
          {loginType === "student"
            ? "Student Login"
            : loginType === "parent"
            ? "Parent Login"
            : "Super Admin / Staff Login"}
        </h2>
        <p className="text-gray-400 text-center mb-6 text-base">
          Enter your credentials to access the dashboard
        </p>

        {/* Login Type Selector */}
        <div className="mb-6 flex justify-center gap-6 text-white">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={loginType === "staff"}
              onChange={() => setLoginType("staff")}
              className="accent-blue-500"
            />
            Staff
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={loginType === "student"}
              onChange={() => setLoginType("student")}
              className="accent-blue-500"
            />
            Student
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={loginType === "parent"}
              onChange={() => setLoginType("parent")}
              className="accent-blue-500"
            />
            Parent
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {(loginType === "parent" || loginType === "staff") && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}

          {(loginType === "parent" || loginType === "student") && (
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {loginType === "parent" && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-blue-400 hover:underline text-sm"
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1E1E1E] text-gray-400">or</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg"
          >
            <FcGoogle className="mr-2 text-xl" /> Sign Up with Google
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : loginType === "student" || loginType === "parent"
              ? "Login"
              : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
