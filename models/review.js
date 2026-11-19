
// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const reviewSchema = new Schema({
//     comment: { type: String, required: true, trim: true },
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     author: { type: Schema.Types.ObjectId, ref: "User", required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("Review", reviewSchema);




// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// // Review Schema
// const reviewSchema = new Schema(
//     {
//         username: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 2,
//             maxlength: 50
//         },

//         comment: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 1,
//             maxlength: 1000
//         },

//         rating: {
//             type: Number,
//             required: true,
//             min: 1,
//             max: 5
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Reuse the model if it has already been registered
// const Review =
//     mongoose.models.Review ||
//     mongoose.model("Review", reviewSchema);

// module.exports = Review;



//controller changes


// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// // Review Schema
// const reviewSchema = new Schema(
//     {
//         // Username of the review author
//         username: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 2,
//             maxlength: 50
//         },

//         // MongoDB ID of the user who created the review
//         author: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         // Review comment
//         comment: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 1,
//             maxlength: 1000
//         },

//         // Rating from 1 to 5
//         rating: {
//             type: Number,
//             required: true,
//             min: 1,
//             max: 5
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Reuse the model if it has already been registered
// const Review =
//     mongoose.models.Review ||
//     mongoose.model("Review", reviewSchema);

// module.exports = Review;


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const reviewSchema = new Schema(
//     {
//         username: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 2,
//             maxlength: 50
//         },
//         comment: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 1,
//             maxlength: 1000
//         },
//         rating: {
//             type: Number,
//             required: true,
//             min: 1,
//             max: 5
//         }
//     },
//     { timestamps: true }
// );

// module.exports =
//     mongoose.models.Review ||
//     mongoose.model("Review", reviewSchema);





const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Review ||
    mongoose.model("Review", reviewSchema);

