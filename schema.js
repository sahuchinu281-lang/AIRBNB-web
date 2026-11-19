
// const Joi = require("joi");

// // Listing validation schema
// const listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string()
//             .trim()
//             .min(3)
//             .max(100)
//             .required()
//             .messages({
//                 "string.empty": "Listing title is required.",
//                 "string.min": "Title must contain at least 3 characters.",
//                 "string.max": "Title cannot exceed 100 characters.",
//                 "any.required": "Listing title is required."
//             }),

//         description: Joi.string()
//             .trim()
//             .min(10)
//             .max(1000)
//             .required()
//             .messages({
//                 "string.empty": "Description is required.",
//                 "string.min": "Description must contain at least 10 characters.",
//                 "string.max": "Description cannot exceed 1000 characters.",
//                 "any.required": "Description is required."
//             }),

//         image: Joi.object({
//             url: Joi.string()
//                 .allow("", null)
//                 .optional()
//         }).optional(),

//         price: Joi.number()
//             .integer()
//             .min(1)
//             .max(10000000)
//             .required()
//             .messages({
//                 "number.base": "Price must be a number.",
//                 "number.integer": "Price must be a whole number.",
//                 "number.min": "Price must be at least ₹1.",
//                 "number.max": "Price cannot exceed ₹1 crore.",
//                 "any.required": "Price is required."
//             }),

//         country: Joi.string()
//             .trim()
//             .min(2)
//             .max(60)
//             .required()
//             .messages({
//                 "string.empty": "Country is required.",
//                 "string.min": "Country must contain at least 2 characters.",
//                 "string.max": "Country cannot exceed 60 characters.",
//                 "any.required": "Country is required."
//             }),

//         location: Joi.string()
//             .trim()
//             .min(2)
//             .max(100)
//             .required()
//             .messages({
//                 "string.empty": "Location is required.",
//                 "string.min": "Location must contain at least 2 characters.",
//                 "string.max": "Location cannot exceed 100 characters.",
//                 "any.required": "Location is required."
//             })
//     }).required()
// });

// // Review validation schema
// const reviewSchema = Joi.object({
//     review: Joi.object({
//         comment: Joi.string()
//             .trim()
//             .min(1)
//             .max(1000)
//             .required()
//             .messages({
//                 "string.empty": "Review comment is required.",
//                 "string.min": "Review comment cannot be empty.",
//                 "string.max": "Review cannot exceed 1000 characters.",
//                 "any.required": "Review comment is required."
//             }),

//         rating: Joi.number()
//             .integer()
//             .min(1)
//             .max(5)
//             .required()
//             .messages({
//                 "number.base": "Rating must be a number.",
//                 "number.integer": "Rating must be a whole number.",
//                 "number.min": "Rating must be between 1 and 5.",
//                 "number.max": "Rating must be between 1 and 5.",
//                 "any.required": "Rating is required."
//             })
//     }).required()
// });

// module.exports = {
//     listingSchema,
//     reviewSchema
// };





// const Listing = require("./models/listing.js");
// const ExpressError = require("./utils/ExpressError.js");

// // Check whether the user is logged in
// const isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl;
//         req.flash("error", "You must be logged in first!");
//         return res.redirect("/login");
//     }

//     next();
// };

// // Check whether the logged-in user owns the listing
// const isListingOwner = async (req, res, next) => {
//     try {
//         const listing = await Listing.findById(req.params.id);

//         if (!listing) {
//             return next(
//                 new ExpressError(404, "Listing not found!")
//             );
//         }

//         if (
//             !listing.owner ||
//             !listing.owner.equals(req.user._id)
//         ) {
//             req.flash(
//                 "error",
//                 "You do not have permission to modify this listing!"
//             );

//             return res.redirect(`/listings/${listing._id}`);
//         }

//         req.listing = listing;
//         next();
//     } catch (err) {
//         next(err);
//     }
// };

// module.exports = {
//     isLoggedIn,
//     isListingOwner
// };




const Joi = require("joi");

// LISTING VALIDATION
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .trim()
            .min(3)
            .max(100)
            .required(),

        description: Joi.string()
            .allow("")
            .max(5000)
            .default(""),

        price: Joi.number()
            .min(0)
            .required(),

        location: Joi.string()
            .trim()
            .required(),

        country: Joi.string()
            .trim()
            .required(),

        image: Joi.object({
            filename: Joi.string().allow(""),
            url: Joi.string().allow("", null)
        }).optional()
    })
        .required()
        .unknown(false)
});

// REVIEW VALIDATION
const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string()
            .trim()
            .min(1)
            .max(1000)
            .required(),

        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .required()
    })
        .required()
        .unknown(false)
});

module.exports = {
    listingSchema,
    reviewSchema
};

