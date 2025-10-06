import { MainAdminLogin } from "../../services/Auth/Auth"; 
import { useState } from "react";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AxiosError } from "axios";

export default function MainAdminLogincheck() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStudentLogin, setIsStudentLogin] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

    
      setLoading(true);

     let res;
    if (isStudentLogin) {
      res = await MainAdminLogin(undefined, password, identifier); 
    } else {
      res = await MainAdminLogin(identifier, password); 
    }


    console.log("res",res)

     if ("otpToken" in res && res.role) {
      localStorage.setItem("otpToken", res.otpToken);
       localStorage.setItem("role", res.role.toLowerCase());
       showToast("OTP sent to your email", "success");
        navigate("/verify-otp", { state: { otpToken: res.otpToken } });
      } else if ("authToken" in res && res.role) {
      localStorage.setItem("authToken", res.authToken);
      localStorage.setItem("role", res.role.toLowerCase());
       showToast("Login successful", "success");
        navigate("/student-dashboard");
} else {
  console.error("Unexpected response from login:", res);
  showToast("Unexpected server response", "error");
}


    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err.response?.data?.message || err.message || "Login failed";
        console.log(err.message)
      showToast(message, "error");
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
          {isStudentLogin ? "Student Login" : "Super Admin / Staff Login"}
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Enter your credentials to access the dashboard
        </p>

       
        <div className="mb-4 flex gap-4 text-white">
          <label>
            <input
              type="radio"
              checked={!isStudentLogin}
              onChange={() => setIsStudentLogin(false)}
              className="mr-2"
            />
            Staff
          </label>
          <label>
            <input
              type="radio"
              checked={isStudentLogin}
              onChange={() => setIsStudentLogin(true)}
              className="mr-2"
            />
            Student
          </label>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder={isStudentLogin ? "Student ID" : "Email"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            type="button"
            className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign Up with Google
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading
              ? "Processing..."
              : isStudentLogin
              ? "Login"
              : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
