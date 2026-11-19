
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

// CREATE REVIEW
module.exports.createReview = async (req, res) => {
    const { id } = req.params;

    if (!req.user) {
        throw new ExpressError(401, "Please log in to write a review.");
    }

    const { comment, rating } = req.body.review || {};

    if (!comment || rating === undefined || rating === "") {
        throw new ExpressError(
            400,
            "Please provide both a rating and a comment."
        );
    }

    const username = req.user.username;

    if (!username || username.trim().length < 2) {
        throw new ExpressError(
            400,
            "Your account needs a valid username to post a review."
        );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    const review = new Review({
        username: username.trim(),
        comment: comment.trim(),
        rating: Number(rating),
        author: req.user._id
    });

    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}`);
};

// EDIT REVIEW FORM
module.exports.renderEditForm = async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    const belongsToListing = listing.reviews.some(
        (savedId) => savedId.toString() === reviewId
    );

    if (!belongsToListing) {
        throw new ExpressError(
            404,
            "Review does not belong to this listing!"
        );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ExpressError(404, "Review not found!");
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        throw new ExpressError(403, "You cannot edit this review!");
    }

    res.render("listings/editReview.ejs", {
        listing,
        review,
        title: "Edit Review"
    });
};

// UPDATE REVIEW
module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const { comment, rating } = req.body.review || {};

    if (!comment || rating === undefined || rating === "") {
        throw new ExpressError(
            400,
            "Please provide both a rating and a comment."
        );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    const belongsToListing = listing.reviews.some(
        (savedId) => savedId.toString() === reviewId
    );

    if (!belongsToListing) {
        throw new ExpressError(
            404,
            "Review does not belong to this listing!"
        );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ExpressError(404, "Review not found!");
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        throw new ExpressError(403, "You cannot edit this review!");
    }

    review.comment = comment.trim();
    review.rating = Number(rating);

    await review.save();

    req.flash("success", "Review updated successfully!");
    res.redirect(`/listings/${id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    const belongsToListing = listing.reviews.some(
        (savedId) => savedId.toString() === reviewId
    );

    if (!belongsToListing) {
        throw new ExpressError(
            404,
            "Review does not belong to this listing!"
        );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ExpressError(404, "Review not found!");
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        throw new ExpressError(403, "You cannot delete this review!");
    }

    listing.reviews.pull(review._id);

    await listing.save();
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};


