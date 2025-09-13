import jwt from "jsonwebtoken";
import { AdminDoc } from "../../infrastructure/database/models/AdminModel";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export function generateTokens(user: AdminDoc) {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.username,
    provider: user.provider,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
     expiresIn: ACCESS_TOKEN_EXPIRES_IN 
    });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, 
    { 
    expiresIn: REFRESH_TOKEN_EXPIRES_IN 
});

  return { accessToken, refreshToken };
}
