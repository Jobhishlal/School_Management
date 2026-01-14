import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = "success" | "error" | "info" | "warning";


export const showToast = (message: string, type: ToastType = "info", autoClose: number = 3000, toastId?: string) => {
  const options = { position: "top-right" as const, autoClose, pauseOnHover: true, toastId };
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, { ...options, autoClose: 5000 });
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
  }
};