
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const geocodeLocation = require("../utils/geocode.js");

// DISPLAY ALL LISTINGS
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
        .sort({ createdAt: -1 });

    res.render("listings/index.ejs", {
        allListings,
        listings: allListings,
        title: "All Listings"
    });
};

// DISPLAY NEW LISTING FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", {
        title: "Create Listing"
    });
};

// CREATE NEW LISTING
module.exports.createListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Listing information is required.");
    }

    const listingData = { ...req.body.listing };

    // Prevent users from assigning themselves another owner
    delete listingData.owner;
    delete listingData.reviews;
    delete listingData.geometry;

    const listing = new Listing(listingData);
    listing.owner = req.user._id;
    listing.reviews = [];

    // Geocode the listing location for Mapbox
    try {
        if (typeof geocodeLocation === "function") {
            const geometry = await geocodeLocation(listing.location);
            if (geometry) listing.geometry = geometry;
        }
    } catch (err) {
        console.error("Geocoding failed:", err.message);
    }

    await listing.save();

    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${listing._id}`);
};

// DISPLAY EDIT FORM
module.exports.renderEditForm = (req, res) => {
    res.render("listings/edit.ejs", {
        listing: req.listing,
        title: "Edit Listing"
    });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Listing information is required.");
    }

    const listing = req.listing;
    const listingData = { ...req.body.listing };

    // Prevent changes to protected fields
    delete listingData.owner;
    delete listingData.reviews;
    delete listingData.geometry;
    delete listingData.image;

    Object.assign(listing, listingData);

    try {
        if (typeof geocodeLocation === "function") {
            const geometry = await geocodeLocation(listing.location);
            if (geometry) listing.geometry = geometry;
        }
    } catch (err) {
        console.error("Geocoding failed:", err.message);
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE LISTING AND ITS REVIEWS
module.exports.deleteListing = async (req, res) => {
    const listing = req.listing;

    await Review.deleteMany({
        _id: { $in: listing.reviews }
    });

    await listing.deleteOne();

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

// DISPLAY ONE LISTING
module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate("reviews")
        .populate("owner");

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/show.ejs", {
        listing,
        title: listing.title
    });
};
