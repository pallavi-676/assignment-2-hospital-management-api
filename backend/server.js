const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./config/passport");

const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Body parser
app.use(express.json());

// Request logger
app.use(logger);

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Home
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hospital Management API is running"
    });
});

// Routes
app.use("/", authRoutes);
app.use("/hospitals", hospitalRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});