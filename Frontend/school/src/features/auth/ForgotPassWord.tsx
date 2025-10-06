
import { useState } from "react";
import {
  requestParentPasswordOtp,
  verifyParentOtp,
  resetParentPassword,
} from "../../services/Auth/Auth";
import { showToast } from "../../utils/toast";

export default function ParentForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    if (!email) {
      showToast("Email is required", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await requestParentPasswordOtp(email);
      setOtpToken(res.otpToken);
      showToast("OTP sent to your email", "success");
      setStep(2);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || err.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showToast("OTP is required", "error");
      return;
    }
    try {
      setLoading(true);
      await verifyParentOtp(otpToken, otp);
      showToast("OTP verified", "success");
      setStep(3);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || err.message || "OTP verification failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("All fields are required", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    try {
      setLoading(true);
      await resetParentPassword(email, newPassword);
      showToast("Password updated successfully", "success");

      // Reset form
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || err.message || "Password reset failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-inter">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-2xl border border-white/20">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Enter your email to receive an OTP
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Verify OTP
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Enter the OTP sent to your email
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Reset Password
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Enter and confirm your new password
            </p>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
