
const User = require("../models/user.js");

// SHOW SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// REGISTER NEW USER
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (
            !username?.trim() ||
            !email?.trim() ||
            !password
        ) {
            req.flash(
                "error",
                "Username, email, and password are required."
            );
            return res.redirect("/signup");
        }

        const newUser = new User({
            username: username.trim(),
            email: email.trim().toLowerCase()
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Airbnb!");
            return res.redirect("/listings");
        });
    } catch (err) {
        if (err.name === "UserExistsError" || err.code === 11000) {
            req.flash(
                "error",
                "That username or email is already registered."
            );
            return res.redirect("/signup");
        }

        if (err.name === "ValidationError") {
            req.flash("error", err.message);
            return res.redirect("/signup");
        }

        return next(err);
    }
};

// SHOW LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// HANDLE SUCCESSFUL LOGIN
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");

    const redirectUrl =
        res.locals.redirectUrl ||
        req.session.returnTo ||
        "/listings";

    delete req.session.returnTo;

    res.redirect(redirectUrl);
};

// LOG OUT USER
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};

