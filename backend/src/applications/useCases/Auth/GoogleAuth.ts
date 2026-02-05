

import { AdminDoc, AdminModel } from "../../../infrastructure/database/models/AdminModel";
import { generateTokens } from "../../../infrastructure/security/jwt";
import { randomBytes } from "crypto";
import { AdminError } from "../../../domain/enums/Adminsinguperror";

export class AuthGoogle {
  async loginwithgoogle(profile: any) {
   
    const { ParentSignupModel } = await import("../../../infrastructure/database/models/ParentSignupModel");
    const parentUser = await ParentSignupModel.findOne({ email: profile.emails?.[0].value }).populate("student");

    if (parentUser) {
      const role = "parent";
     
      const tokenUser: any = {
        _id: parentUser._id,
        email: parentUser.email,
        username: "Parent", 
        provider: "google"
      };

      
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
      role: "admin", 
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
