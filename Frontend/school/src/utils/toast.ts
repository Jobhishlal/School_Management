import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = "success"|"error"|"info"|"warning";


export const showToast = (message: string, type: ToastType = "info", autoClose: number = 3000) => {
  switch (type) {
    case "success":
      toast.success(message, { position: "top-right", autoClose, pauseOnHover: true });
      break;
    case "error":
      toast.error(message, { position: "top-right", autoClose: 5000, pauseOnHover: true });
      break;
    case "info":
      toast.info(message, { position: "top-right", autoClose, pauseOnHover: true });
      break;
    case "warning":
      toast.warning(message, { position: "top-right", autoClose, pauseOnHover: true });
      break;
  }
};