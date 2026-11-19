
// const express = require("express");
// const router = express.Router();

// const passport = require("passport");
// const User = require("../models/user.js");

// // GET: Show signup form
// router.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// });

// // POST: Register a new user
// router.post("/signup", async (req, res, next) => {
//     try {
//         const { username, email, password } = req.body;

//         const newUser = new User({ username, email });
//         const registeredUser = await User.register(newUser, password);

//         req.login(registeredUser, (err) => {
//             if (err) return next(err);

//             req.flash("success", "Welcome to Airbnb!");
//             res.redirect("/listings");
//         });
//     } catch (err) {
//         req.flash("error", err.message);
//         res.redirect("/signup");
//     }
// });

// // GET: Show login form
// router.get("/login", (req, res) => {
//     res.render("users/login.ejs");
// });

// // POST: Authenticate user
// router.post(
//     "/login",
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true
//     }),
//     (req, res) => {
//         req.flash("success", "Welcome back!");
//         res.redirect("/listings");
//     }
// );

// module.exports = router;






// const express = require("express");
// const router = express.Router();

// const passport = require("passport");
// const wrapAsync = require("../utils/wrapAsync.js");
// const userController = require("../controllers/user.js");

// // GET: Show signup form
// router.get(
//     "/signup",
//     userController.renderSignupForm
// );

// // POST: Register a new user
// router.post(
//     "/signup",
//     wrapAsync(userController.signup)
// );

// // GET: Show login form
// router.get(
//     "/login",
//     userController.renderLoginForm
// );

// // POST: Authenticate user
// router.post(
//     "/login",
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: "Invalid username or password."
//     }),
//     userController.login
// );

// // POST: Log out
// router.post(
//     "/logout",
//     userController.logout
// );

// module.exports = router;


//ROUTER.ROUTE

// const express = require("express");
// const router = express.Router();

// const passport = require("passport");
// const wrapAsync = require("../utils/wrapAsync.js");
// const userController = require("../controllers/user.js");

// // SIGNUP: /signup
// router.route("/signup")
//     .get(userController.renderSignupForm)
//     .post(wrapAsync(userController.signup));

// // LOGIN: /login
// router.route("/login")
//     .get(userController.renderLoginForm)
//     .post(
//         passport.authenticate("local", {
//             failureRedirect: "/login",
//             failureFlash: "Invalid username or password."
//         }),
//         userController.login
//     );

// // LOGOUT: /logout
// router.route("/logout")
//     .post(userController.logout);

// module.exports = router;




const express = require("express");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

// ==================== SIGNUP FORM ====================
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs", {
        title: "Sign Up"
    });
});

// ==================== REGISTER USER ====================
router.post(
    "/signup",
    wrapAsync(async (req, res, next) => {
        try {
            const { username, email, password } = req.body;

            // Create a new user
            const user = new User({
                username,
                email
            });

            // Register user and hash password
            const registeredUser = await User.register(user, password);

            // Automatically log in after signup
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }

                req.flash("success", "Welcome to AirbnbDTS!");
                return res.redirect("/listings");
            });
        } catch (err) {
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
    })
);

// ==================== LOGIN FORM ====================
router.get("/login", (req, res) => {
    res.render("users/login.ejs", {
        title: "Login"
    });
});

// ==================== LOGIN USER ====================
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
    }
);

// ==================== LOGOUT USER ====================
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have logged out.");
        res.redirect("/listings");
    });
});

module.exports = router;

