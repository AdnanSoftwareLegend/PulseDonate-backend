const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `${process.env.CLIENT_ORIGIN || "http://localhost:3000"}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account does not provide an email"));
          }

          let user = await User.findOne({ email });
          if (!user) {
            const passwordHash = await bcrypt.hash(
              Math.random().toString(36),
              10,
            );
            const role =
              process.env.ADMIN_EMAIL &&
              email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
                ? "admin"
                : "user";

            user = new User({ email, passwordHash, role });
            user.uid = user._id.toString();
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};
