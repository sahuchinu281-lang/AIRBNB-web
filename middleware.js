
const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");

// ==========================================
// CHECK WHETHER THE USER IS LOGGED IN
// ==========================================

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl;
        }

        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }

    next();
};

// ==========================================
// CHECK WHETHER THE USER OWNS THE LISTING
// ==========================================

const isListingOwner = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(
                new ExpressError(404, "Listing not found!")
            );
        }

        if (
            !req.user ||
            !listing.owner ||
            !listing.owner.equals(req.user._id)
        ) {
            req.flash(
                "error",
                "You do not have permission to modify this listing!"
            );

            return res.redirect(`/listings/${listing._id}`);
        }

        req.listing = listing;
        next();
    } catch (err) {
        next(err);
    }
};

// ==========================================
// EXPORT MIDDLEWARE
// ==========================================

module.exports = {
    isLoggedIn,
    isOwner: isListingOwner,
    isListingOwner
};

