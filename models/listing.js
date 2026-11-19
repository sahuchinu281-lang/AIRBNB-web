// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },

//     description: String,

//     image: {
//         type: String,
//         default:
//             "https://images.unsplash.com/photo-1625505826533-5c80aca7d157",
//         set: (v) =>
//             v === ""
//                 ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157"
//                 : v,
//     },

//     price: Number,

//     location: String,

//     country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;




// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },

//     description: {
//         type: String,
//         required: true
//     },

//     image: {
//         url: {
//             type: String,
//             default: ""
//         }
//     },

//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },

//     location: {
//         type: String,
//         required: true
//     },

//     country: {
//         type: String,
//         required: true
//     },

//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: "Review"
//         }
//     ]
// });




// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },

//     description: {
//         type: String,
//         required: true
//     },

//     image: {
//         url: {
//             type: String,
//             default: ""
//         }
//     },

//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },

//     location: {
//         type: String,
//         required: true
//     },

//     country: {
//         type: String,
//         required: true
//     },

//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },

//     reviews: [{
//         type: Schema.Types.ObjectId,
//         ref: "Review"
//     }]
// });

// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;




// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const listingSchema = new Schema({
//     title: { type: String, required: true, trim: true },
//     description: { type: String, required: true },
//     image: {
//         filename: { type: String, default: "listingimage" },
//         url: {
//             type: String,
//             default: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
//         }
//     },
//     price: { type: Number, required: true, min: 0 },
//     location: { type: String, required: true },
//     country: { type: String, required: true },
//     owner: { type: Schema.Types.ObjectId, ref: "User" },
//     reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
// }, { timestamps: true });

// module.exports = mongoose.model("Listing", listingSchema);





//2//


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },

//     description: {
//         type: String,
//         required: true
//     },

//     image: {
//         url: {
//             type: String,
//             default: ""
//         }
//     },

//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },

//     location: {
//         type: String,
//         required: true
//     },

//     country: {
//         type: String,
//         required: true
//     },

//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },

//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: "Review"
//         }
//     ]
// });

// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;







const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        image: {
            filename: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: "https://placehold.co/1000x600?text=No+Image"
            }
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            required: true,
            trim: true
        },

        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ],

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Listing ||
    mongoose.model("Listing", listingSchema);
