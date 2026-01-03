import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;       
  role: string;
  email: string;
  exp: number;
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};