const User = require("../models/User");
const passport = require("passport");

// Register
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login
const loginUser = (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.status(401).json({
                message: info?.message || "Login failed"
            });
        }

        req.logIn(user, (error) => {
            if (error) {
                return next(error);
            }

            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    })(req, res, next);
};

// Logout
const logoutUser = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        res.status(200).json({
            message: "Logout successful"
        });
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};