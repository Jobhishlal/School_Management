

import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { AuthGoogle } from "../../applications/useCases/Auth/GoogleAuth";

const authUseCase = new AuthGoogle();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${"http://brainnots.ddns.net"}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile: Profile, done: VerifyCallback) => {
      try {
        const { user, accessToken, refreshToken } = await authUseCase.loginwithgoogle(profile);
        return done(null, { user, accessToken, refreshToken });
      } catch (err: any) {
        return done(null, { error: err.message });
      }
    }
  )
);

export default passport;
