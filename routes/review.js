
// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");

// // Validate review
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);

//     if (error) {
//         return next(
//             new ExpressError(
//                 400,
//                 error.details.map((detail) => detail.message).join(", ")
//             )
//         );
//     }

//     next();
// };

// // CREATE REVIEW
// router.post(
//     "/",
//     validateReview,
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         const review = new Review(req.body.review);
//         await review.save();

//         listing.reviews.push(review._id);
//         await listing.save();

//         res.redirect(`/listings/${id}`);
//     })
// );

// // EDIT REVIEW FORM
// router.get(
//     "/:reviewId/edit",
//     wrapAsync(async (req, res) => {
//         const { id, reviewId } = req.params;
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         const belongsToListing = listing.reviews.some(
//             (review) => review.toString() === reviewId
//         );

//         if (!belongsToListing) {
//             throw new ExpressError(404, "Review not found for this listing!");
//         }

//         const review = await Review.findById(reviewId);

//         if (!review) {
//             throw new ExpressError(404, "Review not found!");
//         }

//         res.render("listings/editReview.ejs", { listing, review });
//     })
// );

// // UPDATE REVIEW
// router.put(
//     "/:reviewId",
//     validateReview,
//     wrapAsync(async (req, res) => {
//         const { id, reviewId } = req.params;
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         const belongsToListing = listing.reviews.some(
//             (review) => review.toString() === reviewId
//         );

//         if (!belongsToListing) {
//             throw new ExpressError(404, "Review not found for this listing!");
//         }

//         const updatedReview = await Review.findByIdAndUpdate(
//             reviewId,
//             { ...req.body.review },
//             { new: true, runValidators: true }
//         );

//         if (!updatedReview) {
//             throw new ExpressError(404, "Review not found!");
//         }

//         res.redirect(`/listings/${id}`);
//     })
// );

// // DELETE REVIEW
// router.delete(
//     "/:reviewId",
//     wrapAsync(async (req, res) => {
//         const { id, reviewId } = req.params;
//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         const belongsToListing = listing.reviews.some(
//             (review) => review.toString() === reviewId
//         );

//         if (!belongsToListing) {
//             throw new ExpressError(404, "Review not found for this listing!");
//         }

//         // Remove review reference from listing
//         listing.reviews.pull(reviewId);
//         await listing.save();

//         // Delete review document
//         await Review.findByIdAndDelete(reviewId);

//         res.redirect(`/listings/${id}`);
//     })
// );

// module.exports = router;




// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
// const { isLoggedIn } = require("../middleware.js");

// // Validate review data
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);

//     if (error) {
//         const message = error.details
//             .map((detail) => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, message));
//     }

//     next();
// };

// // Check that the review belongs to the listing
// const verifyReviewBelongsToListing = async (req, res, next) => {
//     const { id, reviewId } = req.params;

//     const listing = await Listing.findById(id);

//     if (!listing) {
//         throw new ExpressError(404, "Listing not found!");
//     }

//     const belongsToListing = listing.reviews.some(
//         (review) => review.toString() === reviewId
//     );

//     if (!belongsToListing) {
//         throw new ExpressError(404, "Review not found for this listing!");
//     }

//     const review = await Review.findById(reviewId);

//     if (!review) {
//         throw new ExpressError(404, "Review not found!");
//     }

//     req.listing = listing;
//     req.review = review;

//     next();
// };

// // CREATE REVIEW
// router.post(
//     "/",
//     isLoggedIn,
//     validateReview,
//     wrapAsync(async (req, res) => {
//         const { id } = req.params;

//         const listing = await Listing.findById(id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         const review = new Review({
//             username: req.user.username,
//             comment: req.body.review.comment,
//             rating: req.body.review.rating
//         });

//         await review.save();

//         listing.reviews.push(review._id);
//         await listing.save();

//         req.flash("success", "Review added successfully!");
//         res.redirect(`/listings/${id}`);
//     })
// );

// // EDIT REVIEW FORM
// router.get(
//     "/:reviewId/edit",
//     isLoggedIn,
//     wrapAsync(verifyReviewBelongsToListing),
//     (req, res) => {
//         // With username-only reviews, this is the best available check.
//         // For reliable ownership, store a User ObjectId in an author field.
//         if (req.review.username !== req.user.username) {
//             throw new ExpressError(403, "You cannot edit this review!");
//         }

//         res.render("listings/editReview.ejs", {
//             listing: req.listing,
//             review: req.review
//         });
//     }
// );

// // UPDATE REVIEW
// router.put(
//     "/:reviewId",
//     isLoggedIn,
//     wrapAsync(verifyReviewBelongsToListing),
//     validateReview,
//     wrapAsync(async (req, res) => {
//         if (req.review.username !== req.user.username) {
//             throw new ExpressError(403, "You cannot edit this review!");
//         }

//         req.review.comment = req.body.review.comment;
//         req.review.rating = req.body.review.rating;

//         await req.review.save();

//         req.flash("success", "Review updated successfully!");
//         res.redirect(`/listings/${req.params.id}`);
//     })
// );

// // DELETE REVIEW
// router.delete(
//     "/:reviewId",
//     isLoggedIn,
//     wrapAsync(verifyReviewBelongsToListing),
//     wrapAsync(async (req, res) => {
//         if (req.review.username !== req.user.username) {
//             throw new ExpressError(403, "You cannot delete this review!");
//         }

//         req.listing.reviews.pull(req.review._id);
//         await req.listing.save();

//         await Review.findByIdAndDelete(req.review._id);

//         req.flash("success", "Review deleted successfully!");
//         res.redirect(`/listings/${req.params.id}`);
//     })
// );

// module.exports = router;



// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
// const { isLoggedIn } = require("../middleware.js");
// const reviewController = require("../controllers/review.js");

// // Validate review data
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);

//     if (error) {
//         const message = error.details
//             .map(detail => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, message));
//     }

//     next();
// };

// // CREATE REVIEW
// router.post(
//     "/",
//     isLoggedIn,
//     validateReview,
//     wrapAsync(reviewController.createReview)
// );

// // EDIT REVIEW FORM
// router.get(
//     "/:reviewId/edit",
//     isLoggedIn,
//     wrapAsync(reviewController.renderEditForm)
// );

// // UPDATE REVIEW
// router.put(
//     "/:reviewId",
//     isLoggedIn,
//     validateReview,
//     wrapAsync(reviewController.updateReview)
// );

// // DELETE REVIEW
// router.delete(
//     "/:reviewId",
//     isLoggedIn,
//     wrapAsync(reviewController.deleteReview)
// );

// module.exports = router;



const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewController = require("../controllers/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

// Validate review data
const validateReview = (req, res, next) => {
    if (!req.body || !req.body.review) {
        return next(
            new ExpressError(400, "Please provide a rating and comment.")
        );
    }

    const { error } = reviewSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const message = error.details
            .map((detail) => detail.message)
            .join(", ");

        return next(new ExpressError(400, message));
    }

    next();
};

// Create review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Render edit form
router.get(
    "/:reviewId/edit",
    isLoggedIn,
    wrapAsync(reviewController.renderEditForm)
);

// Update review
router.put(
    "/:reviewId",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.updateReview)
);

// Delete review
router.delete(
    "/:reviewId",
    isLoggedIn,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;





