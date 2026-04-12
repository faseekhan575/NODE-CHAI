import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.models.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // ✅ Always ensure username is lowercase on every login
          if (user.username !== user.username.toLowerCase()) {
            user.username = user.username.toLowerCase();
            await user.save();
          }
          return done(null, user);
        }

        // Check if email already registered normally
        let existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          // Link google to existing account + fix username to lowercase
          existingUser.googleId = profile.id;
          existingUser.isGoogleUser = true;
          existingUser.username = existingUser.username.toLowerCase(); // ✅ fix case
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create brand new user — always lowercase username
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullname: profile.displayName,
          username: profile.displayName.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now(), // ✅ lowercase
          avatar: profile.photos[0].value,
          isGoogleUser: true,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;