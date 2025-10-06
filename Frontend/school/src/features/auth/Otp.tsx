// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { VerifyOtp, ResendOtp } from "../../services/Auth/Auth";
// import { setCredentials } from "../../store/slice/authslice";
// import { showToast } from "../../utils/toast";
// import axios, { AxiosError } from "axios";
// import * as jwt_decode from "jwt-decode";


// interface DecodedToken {
//   id: string;
//   email: string;
//   role: string;
//   exp?: number;
//   iat?: number;
// }


// export default function VerifyOtpPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const otpTokenFromState = location.state?.otpToken || null;
//   const [otpToken, setOtpToken] = useState<string | null>(otpTokenFromState);

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeleft, setTimeleft] = useState<number>(0);

//   useEffect(() => {
//     if (!otpToken) {
//       const saved = localStorage.getItem("otpToken");
//       if (saved) {
//         setOtpToken(saved);
//       } else {
//         navigate("/login");
//       }
//     }
//   }, [otpToken, navigate]);

//   useEffect(() => {
//     const expiry = localStorage.getItem("otp_expiry");
//     if (expiry) {
//       const remaining = Math.floor((+expiry - Date.now()) / 1000);
//       setTimeleft(remaining > 0 ? remaining : 0);
//     }
//   }, []);

//   useEffect(() => {
//     if (timeleft <= 0) return;
//     const timer = setInterval(() => {
//       setTimeleft((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [timeleft]);

// //current woroking 
// //   async function handleVerify(e: React.FormEvent) {
// //     e.preventDefault();

// //     if (!otpToken) {
// //       showToast("OTP token missing", "error");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //     const res = await VerifyOtp(otpToken, otp);
// //      localStorage.setItem("authToken", res.authToken);
// //     localStorage.setItem("role", res.role.toLowerCase());


// //      dispatch(setCredentials({
// //     accessToken: res.authToken,
// //     refreshToken: "",
// //     user: { 
// //         id: decoded.id,   
// //         role: decoded.role,
// //         email: decoded.email,
// //     },
// // }));

// // showToast("Login successful!", "success");

// // switch(res.role.toLowerCase()) {
// //   case "super_admin":
// //   case "sub_admin":
// //     navigate("/dashboard");
// //     break;
// //   case "teacher":
// //     navigate("/teacher/dashboard");
// //     break;
// //   default:
// //     navigate("/");
// // }
// //     } catch (err) {
// //   if (axios.isAxiosError(err)) {
    
// //     const serverError = err as AxiosError<{ message: string }>;
// //     const errorMessage = serverError.response?.data?.message || "Invalid OTP";
// //     showToast(errorMessage, "error");
// //   } else {
  
// //     showToast("Unexpected error occurred", "error");
// //   }
// // } finally {
// //       setLoading(false);
// //     }
// //   }


//  async function handleVerify(e: React.FormEvent) {
//   e.preventDefault();

//   if (!otpToken) {
//     showToast("OTP token missing", "error");
//     return;
//   }

//   try {
//     setLoading(true);

//     const res = await VerifyOtp(otpToken, otp);

//     // Save auth token and role in localStorage
//     localStorage.setItem("authToken", res.authToken);
//     localStorage.setItem("role", res.role.toLowerCase());

//     // Decode JWT to get user id
//    const decoded: DecodedToken = jwtDecode<DecodedToken>(res.authToken);

//     if (!decoded?.id) {
//       showToast("Invalid token received from server", "error");
//       return navigate("/login");
//     }

//     // Update Redux with decoded info
//     dispatch(setCredentials({
//       accessToken: res.authToken,
//       refreshToken: "",
//       user: { id: decoded.id, role: decoded.role },
//     }));

//     showToast("Login successful!", "success");

//     // Redirect based on role
//     switch(res.role.toLowerCase()) {
//       case "super_admin":
//       case "sub_admin":
//         navigate("/dashboard");
//         break;
//       case "teacher":
//         navigate("/teacher/dashboard");
//         break;
//       default:
//         navigate("/");
//     }

//   } catch (err) {
//     if (axios.isAxiosError(err)) {
//       const serverError = err as AxiosError<{ message: string }>;
//       const errorMessage = serverError.response?.data?.message || "Invalid OTP";
//       showToast(errorMessage, "error");
//     } else {
//       showToast("Unexpected error occurred", "error");
//     }
//   } finally {
//     setLoading(false);
//   }
// }


//   function Timemove(secondes: number) {
//     const m = Math.floor(secondes / 60);
//     const s = secondes % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   }

//   // ---------- Resend OTP ----------
// //   async function handleResend() {
// //     if (!otpToken) {
// //       showToast("OTP token missing", "error");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const res = await ResendOtp(otpToken);

// //       setOtpToken(res.otpToken);
// //       localStorage.setItem("otpToken", res.otpToken);

// //       const newExpiry = Date.now() + 2 * 60 * 1000;
// //       localStorage.setItem("otp_expiry", newExpiry.toString());

// //       setTimeleft(120);
// //       showToast("New OTP sent to your email!", "success");
// //     } catch (err: unknown) {
// //       if (axios.isAxiosError(err)) {
// //         const serverError = err as AxiosError<{ message: string }>;
// //          const errorMessage = serverError.response?.data?.message || "Failed to resend OTP";
// //          showToast(errorMessage, "error");
// //       } else {
// //     showToast("Failed to resend OTP", "error");
// //   }
// // } finally {
// //       setLoading(false);
// //     }
// //   }

// async function handleResend() {
//   if (!otpToken) {
//     showToast("OTP token missing", "error");
//     return;
//   }

//   try {
//     setLoading(true);
//     const res = await ResendOtp(otpToken);

//     setOtpToken(res.otpToken);
//     localStorage.setItem("otpToken", res.otpToken);
//     setTimeleft(120);

//     showToast("New OTP sent!", "success");
//   } catch (err: unknown) {
//     showToast("Failed to resend OTP", "error");
//   } finally {
//     setLoading(false);
//   }
// }


//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-4 font-inter">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
//       >
//         <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
//       </div>

//       <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-2xl border border-white/20">
//         <h2 className="text-3xl font-bold text-white mb-4 text-center">
//           Verify OTP
//         </h2>
//         <p className="text-gray-300 mb-6 text-center">
//           Enter the OTP sent to your email
//         </p>

//         <form onSubmit={handleVerify} className="space-y-5">
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
//             placeholder="Enter OTP"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>

//         <div className="flex justify-between items-center mt-4">
//           {timeleft > 0 ? (
//             <p className="text-gray-400 text-sm">
//               Resend available in{" "}
//               <span className="text-white">{Timemove(timeleft)}</span>
//             </p>
//           ) : (
//             <button
//               onClick={handleResend}
//               disabled={loading}
//               className="text-blue-400 hover:underline text-sm"
//             >
//               Resend OTP
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






//  import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { VerifyOtp, ResendOtp } from "../../services/Auth/Auth";
// import { setCredentials } from "../../store/slice/authslice";
// import { showToast } from "../../utils/toast";
// import axios, { AxiosError } from "axios";

// interface VerifyOtpResponse {
// authToken: string;
// role: "super_admin" | "sub_admin" | "Teacher";
// id: string;
// email: string;
// }

// export default function VerifyOtpPage() {
// const location = useLocation();
// const navigate = useNavigate();
// const dispatch = useDispatch();

// const otpTokenFromState = location.state?.otpToken || null;
// const [otpToken, setOtpToken] = useState<string | null>(otpTokenFromState);
// const [otp, setOtp] = useState("");
// const [loading, setLoading] = useState(false);
// const [timeleft, setTimeleft] = useState<number>(0);

// useEffect(() => {
// if (!otpToken) {
// const saved = localStorage.getItem("otpToken");
// if (saved) {
// setOtpToken(saved);
// } else {
// navigate("/login");
// }
// }
// }, [otpToken, navigate]);

// useEffect(() => {
// const expiry = localStorage.getItem("otp_expiry");
// if (expiry) {
// const remaining = Math.floor((+expiry - Date.now()) / 1000);
// setTimeleft(remaining > 0 ? remaining : 0);
// }
// }, []);

// useEffect(() => {
// if (timeleft <= 0) return;
// const timer = setInterval(() => setTimeleft((prev) => prev - 1), 1000);
// return () => clearInterval(timer);
// }, [timeleft]);

// async function handleVerify(e: React.FormEvent) {
// e.preventDefault();
// if (!otpToken) {
// showToast("OTP token missing", "error");
// return;
// }


// try {
//   setLoading(true);
//   const res = (await VerifyOtp(otpToken, otp)) as VerifyOtpResponse;

//   localStorage.setItem("accessToken", res.authToken);
//   localStorage.setItem("role", res.role.toLowerCase());

//   if (!res?.id) {
//     showToast("Invalid response: missing user id", "error");
//     return navigate("/login");
//   }

//   dispatch(
//     setCredentials({
//       accessToken: res.authToken,
//       refreshToken: "",
//       user: { id: res.id, role: res.role, email: res.email },
//     })
//   );

//   showToast("Login successful!", "success");

//   switch (res.role.toLowerCase()) {
//     case "super_admin":
//     case "sub_admin":
//       navigate("/dashboard");
//       break;
//     case "teacher":
//       navigate("/teacher/dashboard");
//       break;
//     default:
//       navigate("/");
//   }
// } catch (err) {
//   if (axios.isAxiosError(err)) {
//     const serverError = err as AxiosError<{ message: string }>;
//     const errorMessage =
//       serverError.response?.data?.message || "Invalid OTP";
//     showToast(errorMessage, "error");
//   } else {
//     showToast("Unexpected error occurred", "error");
//   }
// } finally {
//   setLoading(false);
// }


// }

// async function handleResend() {
// if (!otpToken) {
// showToast("OTP token missing", "error");
// return;
// }


// try {
//   setLoading(true);
//   const res = await ResendOtp(otpToken);
//   setOtpToken(res.otpToken);
//   localStorage.setItem("otpToken", res.otpToken);
//   setTimeleft(120);
//   showToast("New OTP sent!", "success");
// } catch {
//   showToast("Failed to resend OTP", "error");
// } finally {
//   setLoading(false);
// }


// }

// function Timemove(seconds: number) {
// const m = Math.floor(seconds / 60);
// const s = seconds % 60;
// return `${m}:${s < 10 ? "0" : ""}${s}`;
// }

// return ( <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 font-inter">
// {/* Background */}
// <div
// className="absolute inset-0 bg-cover bg-center"
// style={{ backgroundImage: "url('/SuperadminLogin.jpg')" }}
// > <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div> </div>

// ```
//   {/* Card */}
//   <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-lg border border-white/10">
//     <h2 className="text-3xl font-bold text-center mb-2">Verify OTP</h2>
//     <p className="text-gray-400 text-center mb-6">
//       Enter the OTP sent to your email
//     </p>

//     <form onSubmit={handleVerify} className="space-y-5">
//       <input
//         type="text"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
//         placeholder="Enter OTP"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>
//     </form>

//     <div className="flex justify-center mt-5">
//       {timeleft > 0 ? (
//         <p className="text-gray-400 text-sm">
//           Resend available in{" "}
//           <span className="text-white font-medium">
//             {Timemove(timeleft)}
//           </span>
//         </p>
//       ) : (
//         <button
//           onClick={handleResend}
//           disabled={loading}
//           className="text-blue-400 hover:underline text-sm"
//         >
//           Resend OTP
//         </button>
//       )}
//     </div>
//   </div>
// </div>

// );
// }











import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyOtp, ResendOtp } from "../../services/Auth/Auth";
import { setCredentials } from "../../store/slice/authslice";
import { showToast } from "../../utils/toast";
import axios, { AxiosError } from "axios";

interface VerifyOtpResponse {
  authToken: string;
  role: "super_admin" | "sub_admin" | "Teacher";
  id: string;
  email: string;
}

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const otpTokenFromState = location.state?.otpToken || null;
  const [otpToken, setOtpToken] = useState<string | null>(otpTokenFromState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeleft, setTimeleft] = useState<number>(120); // default 2 min

  // --- Load OTP token from localStorage if page refreshed ---
  useEffect(() => {
    if (!otpToken) {
      const saved = localStorage.getItem("otpToken");
      if (saved) {
        setOtpToken(saved);
      } else {
        navigate("/login", { replace: true }); // redirect to login if no token
      }
    }
  }, [otpToken, navigate]);

  // --- Timer countdown for resend ---
  useEffect(() => {
    if (timeleft <= 0) return;
    const timer = setInterval(() => setTimeleft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeleft]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!otpToken) return;

    try {
      setLoading(true);
      const res = (await VerifyOtp(otpToken, otp)) as VerifyOtpResponse;

      // Save access token and user info
      localStorage.setItem("accessToken", res.authToken);
      localStorage.setItem("role", res.role.toLowerCase());
      localStorage.removeItem("otpToken"); // clear temp token

      dispatch(
        setCredentials({
          accessToken: res.authToken,
          refreshToken: "",
          user: { id: res.id, role: res.role, email: res.email },
        })
      );

      showToast("Login successful!", "success");

      // Navigate directly to dashboard
      switch (res.role.toLowerCase()) {
        case "super_admin":
        case "sub_admin":
          navigate("/dashboard", { replace: true });
          break;
        case "teacher":
          navigate("/teacher/dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ message: string }>;
        const errorMessage =
          serverError.response?.data?.message || "Invalid OTP";

        showToast(errorMessage, "error");

        // Clear token if invalid
        if (
          errorMessage.includes("OTP Error") ||
          errorMessage.includes("Invalid OTP")
        ) {
          localStorage.removeItem("otpToken");
          showToast("Authentication failed. Please log in again.", "warning");
          navigate("/login", { replace: true });
        }
      } else {
        showToast("Unexpected error occurred", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!otpToken) return;

    try {
      setLoading(true);
      const res = await ResendOtp(otpToken);
      setOtpToken(res.otpToken);
      localStorage.setItem("otpToken", res.otpToken);
      setTimeleft(120);
      showToast("New OTP sent!", "success");
    } catch {
      showToast("Failed to resend OTP", "error");
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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

      {/* OTP Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/95 p-8 rounded-2xl shadow-lg border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-2">Verify OTP</h2>
        <p className="text-gray-400 text-center mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Enter OTP"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="flex justify-center mt-5">
          {timeleft > 0 ? (
            <p className="text-gray-400 text-sm">
              Resend available in{" "}
              <span className="text-white font-medium">{formatTime(timeleft)}</span>
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


