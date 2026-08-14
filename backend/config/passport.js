const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password"
        },

        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, {
                        message: "User not found"
                    });
                }

                const isMatch = await user.comparePassword(password);

                if (!isMatch) {
                    return done(null, false, {
                        message: "Incorrect password"
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Store user ID in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Retrieve user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;