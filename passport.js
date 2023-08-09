const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/UserSchema");
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const checkUser = await User.findOne({ email: profile.emails[0].value });
      if (!checkUser) {
        const user = new User({
          id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          source: "google",
        });
        await user.save();
        done(null, user)
      } else {
        done(null, checkUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});
