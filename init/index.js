// const mongoose = require("mongoose");
// const sampleListings = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://localhost:27017/airbnbdts";

// async function main() {
//    try {
//     await mongoose.connect(MONGO_URL);
//     console.log("Connected to MongoDB");

//     const result = await Listing.insertMany(sampleListings);

//     console.log("Initial data inserted");

//     console.log(
//         sampleListings.filter((listing) => ! 
//         listing.title)
//     );

//     const count = await Listing.countDocuments();
//     console.log("Total listings:", count);

// } catch (err) {
//     console.error("Error:", err);
// }
// }

// main();


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/airbnbdts";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        const sampleListings = initData.data;

        // Check for listings without title
        const invalidListings = sampleListings.filter(
            (listing) => !listing.title
        );

        console.log("Listings without title:", invalidListings);

        await Listing.insertMany(sampleListings);

        console.log("Initial data inserted");

        const count = await Listing.countDocuments();
        console.log("Total listings:", count);

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
