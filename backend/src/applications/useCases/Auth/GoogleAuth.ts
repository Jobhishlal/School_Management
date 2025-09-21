

import { AdminDoc, AdminModel } from "../../../infrastructure/database/models/AdminModel";
import { generateTokens } from "../../../infrastructure/security/jwt";
import { randomBytes } from "crypto";
import { AdminError } from "../../../domain/enums/Adminsinguperror";

export class AuthGoogle {
  async loginwithgoogle(profile: any) {
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
    }
  else if (user.provider !== "google") {
  return { error: AdminError.Useralreadyexisted };
}

    const tokens = generateTokens(user);

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
