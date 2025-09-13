import { MainAdminLogin } from "../../services/authapi"; 
import { useState } from "react";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function MainAdminLogincheck() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await MainAdminLogin(email, password);

      localStorage.setItem("otpToken", res.otpToken);

      showToast("OTP sent to your email", "success");

      navigate("/verify-otp", { state: { otpToken: res.otpToken } });
    } catch (error: any) {
      showToast(error.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

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
          Super Admin Login
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Enter your credentials to access the dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />

          <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1E1E1E] text-gray-300">or</span>
          </div>
        </div>

        <button
         
          className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign Up with Google
        </button>

         
             <button
            type="submit"  disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading ? "SENDING OTP..." : "SEND OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
