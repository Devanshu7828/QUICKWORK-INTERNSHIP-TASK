const GoogleStatergy = require("passport-google-oauth2").Strategy;
const User = require("../models/userModel");
const email = require("./sendEmail");
function init(passport) {
  passport.use(
    new GoogleStatergy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/auth/callback",
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        // CHECK IF EMAIL EXIST IN DATABASE
        const { email, password } = profile;
        const user = await User.findOne({ email });
        if (user) {
          const updateTOken = await User.findOneAndUpdate({
            tokens: accessToken,
          });
          return done(null, user);
        }

        const newUser = await User.create({
          email,
          name: profile.name.givenName + " " + profile.name.familyName,
          pic: profile.picture,
          tokens: accessToken,
        });

        return done(null, newUser);
      }
    )
  );
  // This method store user id in session after sucessfully logged in
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    // when we do req.user we get login user the user
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
module.exports = init;
