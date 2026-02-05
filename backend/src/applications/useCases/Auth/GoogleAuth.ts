

import { AdminDoc, AdminModel } from "../../../infrastructure/database/models/AdminModel";
import { generateTokens } from "../../../infrastructure/security/jwt";
import { randomBytes } from "crypto";
import { AdminError } from "../../../domain/enums/Adminsinguperror";

export class AuthGoogle {
  async loginwithgoogle(profile: any) {
    // Check for Parent first
    const { ParentSignupModel } = await import("../../../infrastructure/database/models/ParentSignupModel");
    const parentUser = await ParentSignupModel.findOne({ email: profile.emails?.[0].value }).populate("student");

    if (parentUser) {
      const role = "parent";
      // Adapt to what frontend expects. Frontend expects 'role' in the response. A 'user' object is also expected.
      // We need to generate a token that allows access.
      // Since we can't easily reuse 'generateTokens' from jwt.ts if it forces AdminDoc, we might need to cast or verify it works.
      // However, let's look at jwt.ts again. It takes 'user' and reads 'user._id', 'user.email', 'user.username', 'user.provider'.
      // ParentSignupModel has _id, email. Missing username, provider.

      // Mock a user object for token generation
      const tokenUser: any = {
        _id: parentUser._id,
        email: parentUser.email,
        username: "Parent", // Default name
        provider: "google"
      };

      // We might want to use the same token service as UnifiedLogin, but that requires dependency injection which is hard here (class instantiation).
      // We stick to the existing 'generateTokens' but note it might lack 'role' in payload.
      // But Login.tsx uses the 'role' returned in the JSON body, NOT the token claim (initially).

      const tokens = generateTokens(tokenUser);

      return {
        user: parentUser,
        role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    }

    // Fallback to Admin
    let user = (await AdminModel.findOne({
      email: profile.emails?.[0].value,
    })) as AdminDoc | null;

    if (!user) {
      user = (await AdminModel.create({
        username: profile.displayName,
        email: profile.emails?.[0].value,
        provider: "google",
        password: randomBytes(16).toString("hex"),
        googleId: profile.id,
      })) as AdminDoc;
    } else if (user.provider !== "google") {
      return { error: AdminError.Useralreadyexisted };
    }

    const tokens = generateTokens(user);

    return {
      user,
      role: "admin", // or check user type
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
