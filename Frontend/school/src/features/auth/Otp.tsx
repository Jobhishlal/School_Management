import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyOtp, ResendOtp } from "../../services/authapi";
import { setCredentials } from "../../store/slice/authslice";
import { showToast } from "../../utils/toast";

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const otpTokenFromState = location.state?.otpToken || null;
  const [otpToken, setOtpToken] = useState<string | null>(otpTokenFromState);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeleft, setTimeleft] = useState<number>(0);

  useEffect(() => {
    if (!otpToken) {
      const saved = localStorage.getItem("otpToken");
      if (saved) {
        setOtpToken(saved);
      } else {
        navigate("/login");
      }
    }
  }, [otpToken, navigate]);

  useEffect(() => {
    const expiry = localStorage.getItem("otp_expiry");
    if (expiry) {
      const remaining = Math.floor((+expiry - Date.now()) / 1000);
      setTimeleft(remaining > 0 ? remaining : 0);
    }
  }, []);

  useEffect(() => {
    if (timeleft <= 0) return;
    const timer = setInterval(() => {
      setTimeleft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeleft]);

  // ---------- Verify OTP ----------
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!otpToken) {
      showToast("OTP token missing", "error");
      return;
    }

    try {
      setLoading(true);
    const res = await VerifyOtp(otpToken, otp);
    localStorage.setItem("authToken", res.authToken);
     localStorage.setItem("role", res.role);

  // dispatch(setCredentials({ authToken: res.authToken, role: res.role }));

    dispatch(
        setCredentials({
          accessToken: res.authToken,   
          refreshToken: "",          
          user: { role: res.role },     
        })
      );
      showToast("Login successful!", "success");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.message) {
        showToast(err.response.data.message, "error");
      } else {
        
        showToast("Invalid OTP", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  function Timemove(secondes: number) {
    const m = Math.floor(secondes / 60);
    const s = secondes % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // ---------- Resend OTP ----------
  async function handleResend() {
    if (!otpToken) {
      showToast("OTP token missing", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await ResendOtp(otpToken);

      setOtpToken(res.otpToken);
      localStorage.setItem("otpToken", res.otpToken);

      const newExpiry = Date.now() + 2 * 60 * 1000;
      localStorage.setItem("otp_expiry", newExpiry.toString());

      setTimeleft(120);
      showToast("New OTP sent to your email!", "success");
    } catch (err: any) {
      showToast("Failed to resend OTP", "error");
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
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Verify OTP
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
            placeholder="Enter OTP"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4">
          {timeleft > 0 ? (
            <p className="text-gray-400 text-sm">
              Resend available in{" "}
              <span className="text-white">{Timemove(timeleft)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-400 hover:underline text-sm"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
