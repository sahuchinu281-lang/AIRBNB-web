// const express = require("express");
// const app = express();

// const mongoose = require("mongoose");
// const path = require("path");

// const Listing = require("./models/listing");

// const mongooseConnectionString =
//     "mongodb://localhost:27017/airbnbdts";

// async function main() {
//     await mongoose.connect(mongooseConnectionString);
// }

// main()
//     .then(() => {
//         console.log("Connected to MongoDB");
//     })
//     .catch((err) => {
//         console.error("Error connecting to MongoDB:", err);
//     });

// // Set EJS as the view engine
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));

// // Home route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// // All listings
// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// });

// //newroute
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });


// // show route
// app.get("/listings/:id", async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs", { listing });
// });



// // // Test listing route
// // app.get("/testListing", async (req, res) => {
// //     let sampleListing = new Listing({
// //         title: "My New Villa",
// //         description: "By the beach",
// //         price: 1200,
// //         location: "Calangute, Goa",
// //         country: "India",
// //     });

// //    await sampleListing.save();
// // console.log("sample was saved");

// // const count = await Listing.countDocuments();
// // console.log("Listings in database:", count);
// //     res.send("Successful testing");
// // });


// // Start server
// app.listen(8080, () => {
//     console.log("Server is listening to port 8080");
// });




// CHANGES TO THE ROUTES;




// const express = require("express");
// const app = express();

// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");

// // ================= MODELS =================

// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

// // ================= UTILITIES =================

// const wrapAsync = require("./utils/wrapAsync");
// const ExpressError = require("./utils/ExpressError");

// // ================= JOI SCHEMAS =================

// const {
//     listingSchema,
//     reviewSchema
// } = require("./schema");

// // ================= MONGODB CONNECTION =================

// const MONGO_URL = "mongodb://localhost:27017/airbnbdts";

// async function main() {
//     await mongoose.connect(MONGO_URL);
//     console.log("Connected to MongoDB");
// }

// main().catch((err) => {
//     console.error("MongoDB connection error:", err);
// });

// // ================= APP CONFIGURATION =================

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // ================= MIDDLEWARE =================

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(methodOverride("_method"));

// // ================= JOI VALIDATION =================

// // Validate listing data
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         const errMsg = error.details
//             .map((detail) => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, errMsg));
//     }

//     next();
// };

// // Validate review data
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);

//     if (error) {
//         const errMsg = error.details
//             .map((detail) => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, errMsg));
//     }

//     next();
// };

// // ================= HOME ROUTE =================

// app.get("/", (req, res) => {
//     res.redirect("/listings");
// });

// // ================= INDEX ROUTE =================

// app.get(
//     "/listings",
//     wrapAsync(async (req, res) => {
//         const allListings = await Listing.find({});

//         res.render("listings/index", {
//             allListings
//         });
//     })
// );

// // ================= NEW LISTING FORM =================

// app.get("/listings/new", (req, res) => {
//     res.render("listings/new");
// });

// // ================= CREATE LISTING ROUTE =================

// app.post(
//     "/listings",
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const newListing = new Listing(req.body.listing);

//         await newListing.save();

//         res.redirect("/listings");
//     })
// );

// // ================= EDIT LISTING FORM =================

// app.get(
//     "/listings/:id/edit",
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;

//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         res.render("listings/edit", {
//             listing
//         });
//     })
// );

// // ================= UPDATE LISTING ROUTE =================

// app.put(
//     "/listings/:id",
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;

//         const updatedListing = await Listing.findByIdAndUpdate(
//             id,
//             { ...req.body.listing },
//             {
//                 runValidators: true,
//                 new: true
//             }
//         );

//         if (!updatedListing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         res.redirect(`/listings/${id}`);
//     })
// );

// // ================= DELETE LISTING ROUTE =================

// app.delete(
//     "/listings/:id",
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;

//         const deletedListing = await Listing.findByIdAndDelete(id);

//         if (!deletedListing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         // Delete reviews belonging to this listing
//         await Review.deleteMany({
//             _id: { $in: deletedListing.reviews }
//         });

//         res.redirect("/listings");
//     })
// );

// // ================= SHOW LISTING ROUTE =================

// app.get(
//     "/listings/:id",
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;

//         const listing = await Listing.findById(id)
//             .populate("reviews");

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         res.render("listings/show", {
//             listing
//         });
//     })
// );

// // ================= CREATE REVIEW ROUTE =================

// app.post(
//     "/listings/:id/reviews",
//     validateReview,
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;

//         // Find the listing
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         // Create a new review
//         const newReview = new Review(req.body.review);

//         // Save the review
//         await newReview.save();

//         // Add review reference to the listing
//         listing.reviews.push(newReview._id);

//         // Save the listing
//         await listing.save();

//         res.redirect(`/listings/${id}`);
//     })
// );

// // ================= EDIT REVIEW FORM =================

// app.get(
//     "/listings/:id/reviews/:reviewId/edit",
//     wrapAsync(async (req, res) => {
//         const { id, reviewId } = req.params;

//         // Find the listing
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         // Check that the review belongs to this listing
//         const isAssociated = listing.reviews.some(
//             (review) => review.equals(reviewId)
//         );

//         if (!isAssociated) {
//             throw new ExpressError(
//                 404,
//                 "Review not found on this listing!"
//             );
//         }

//         // Find the review
//         const review = await Review.findById(reviewId);

//         if (!review) {
//             throw new ExpressError(404, "Review not found!");
//         }

//         // Render edit form
//         res.render("listings/editReview", {
//             listing,
//             review
//         });
//     })
// );

// // ================= UPDATE REVIEW ROUTE =================

// app.put(
//     "/listings/:id/reviews/:reviewId",
//     validateReview,
//     wrapAsync(async (req, res) => {
//         const { id, reviewId } = req.params;

//         // Find the listing
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         // Verify review belongs to this listing
//         const isAssociated = listing.reviews.some(
//             (review) => review.equals(reviewId)
//         );

//         if (!isAssociated) {
//             throw new ExpressError(
//                 404,
//                 "Review not found on this listing!"
//             );
//         }

//         // Update the review
//         const updatedReview = await Review.findByIdAndUpdate(
//             reviewId,
//             { ...req.body.review },
//             {
//                 runValidators: true,
//                 new: true
//             }
//         );

//         if (!updatedReview) {
//             throw new ExpressError(404, "Review not found!");
//         }

//         res.redirect(`/listings/${id}`);
//     })
// );

// // ================= DELETE REVIEW ROUTE =================

// app.delete(
//     "/listings/:id/reviews/:reviewId",
//     wrapAsync(async (req, res) => {
//         const { id, reviewId } = req.params;

//         // Find the listing
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         // Verify review belongs to this listing
//         const isAssociated = listing.reviews.some(
//             (review) => review.equals(reviewId)
//         );

//         if (!isAssociated) {
//             throw new ExpressError(
//                 404,
//                 "Review not found on this listing!"
//             );
//         }

//         // Remove the review reference from the listing
//         await Listing.findByIdAndUpdate(id, {
//             $pull: {
//                 reviews: reviewId
//             }
//         });

//         // Delete the review document
//         const deletedReview = await Review.findByIdAndDelete(reviewId);

//         if (!deletedReview) {
//             throw new ExpressError(404, "Review not found!");
//         }

//         res.redirect(`/listings/${id}`);
//     })
// );

// // ================= UNKNOWN ROUTES =================

// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page not found!"));
// });

// // ================= ERROR HANDLER =================

// app.use((err, req, res, next) => {
//     console.error("Application error:", err);

//     const statusCode = err.statusCode || 500;
//     const message = err.message || "Something went wrong!";

//     res.status(statusCode).render("error.ejs", {
//         statusCode,
//         message
//     });
// });

// // ================= START SERVER =================

// const PORT = 8080;

// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// });





// ==================== IMPORTS ====================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

require("dotenv").config();

// ==================== MODELS ====================
const User = require("./models/user.js");

// ==================== ROUTES ====================
const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ==================== UTILITIES ====================
const ExpressError = require("./utils/ExpressError.js");

const app = express();

const PORT = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL;

// ==================== DATABASE CONNECTION ====================
async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB Atlas");
}

// ==================== EJS CONFIGURATION ====================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==================== MIDDLEWARE ====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// ==================== MONGODB SESSION STORE ====================
const store = MongoStore.create({
    mongoUrl: dbUrl,

    crypto: {
        secret: process.env.SECRET,
    },

    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

// ==================== SESSION CONFIGURATION ====================
const sessionOptions = {
    store,

    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        maxAge: 7 * 24 * 60 * 60 * 1000,

        httpOnly: true,
    },
};

app.use(session(sessionOptions));

// ==================== FLASH ====================
app.use(flash());

// ==================== PASSPORT ====================
app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

// ==================== GLOBAL VARIABLES ====================
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.failure = req.flash("failure");

    res.locals.currentUser = req.user;
    res.locals.currentPath = req.path;

    next();
});

// ==================== HOME ROUTE ====================
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ==================== ROUTES ====================
app.use("/", userRouter);

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewRouter);

// ==================== 404 ERROR ====================
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("error.ejs", {
        message,
    });
});

// ==================== START SERVER ====================
main()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });

