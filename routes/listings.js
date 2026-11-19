
// const express = require("express");
// const router = express.Router();

// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");

// // Validate listing data
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         const message = error.details
//             .map((detail) => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, message));
//     }

//     next();
// };

// // INDEX - Show all listings
// router.get(
//     "/",
//     wrapAsync(async (req, res) => {
//         const allListings = await Listing.find({});
//         res.render("listings/index.ejs", { allListings });
//     })
// );

// // NEW - Render form to create a listing
// router.get("/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// // CREATE - Save a new listing
// router.post(
//     "/",
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const newListing = new Listing(req.body.listing);

//         await newListing.save();

//         if (req.flash) {
//             req.flash("success", "New listing created successfully!");
//         }

//         res.redirect("/listings");
//     })
// );

// // EDIT - Render form to edit a listing
// router.get(
//     "/:id/edit",
//     wrapAsync(async (req, res) => {
//         const listing = await Listing.findById(req.params.id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         res.render("listings/edit.ejs", { listing });
//     })
// );

// // UPDATE - Update an existing listing
// router.put(
//     "/:id",
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const listing = await Listing.findByIdAndUpdate(
//             req.params.id,
//             { ...req.body.listing },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         if (req.flash) {
//             req.flash("success", "Listing updated successfully!");
//         }

//         res.redirect(`/listings/${listing._id}`);
//     })
// );

// // DELETE - Delete a listing and its associated reviews
// router.delete(
//     "/:id",
//     wrapAsync(async (req, res) => {
//         const listing = await Listing.findById(req.params.id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         // Delete associated review documents
//         await Review.deleteMany({
//             _id: { $in: listing.reviews }
//         });

//         // Delete the listing
//         await Listing.findByIdAndDelete(req.params.id);

//         if (req.flash) {
//             req.flash("success", "Listing deleted successfully!");
//         }

//         res.redirect("/listings");
//     })
// );

// // SHOW - Show one listing with its reviews
// router.get(
//     "/:id",
//     wrapAsync(async (req, res) => {
//         const listing = await Listing.findById(req.params.id)
//             .populate("reviews");

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         res.render("listings/show.ejs", { listing });
//     })
// );

// module.exports = router;






// const express = require("express");
// const router = express.Router();

// const express = require("express");
// const router = express.Router();

// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
// const {
//     isLoggedIn,
//     isListingOwner
// } = require("../middleware.js");

// // Validate listing data
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         const message = error.details
//             .map((detail) => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, message));
//     }

//     next();
// };

// // INDEX - Show all listings
// router.get(
//     "/",
//     wrapAsync(async (req, res) => {
//         const allListings = await Listing.find({});
//         res.render("listings/index.ejs", { allListings });
//     })
// );

// // NEW - Render form (login required)
// router.get("/new", isLoggedIn, (req, res) => {
//     res.render("listings/new.ejs");
// });

// // CREATE - Save a new listing
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const newListing = new Listing(req.body.listing);

//         // Assign the logged-in user as owner
//         newListing.owner = req.user._id;

//         await newListing.save();

//         req.flash("success", "New listing created successfully!");
//         res.redirect("/listings");
//     })
// );

// // EDIT - Render edit form (owner only)
// router.get(
//     "/:id/edit",
//     isLoggedIn,
//     isListingOwner,
//     (req, res) => {
//         res.render("listings/edit.ejs", {
//             listing: req.listing
//         });
//     }
// );

// // UPDATE - Update listing (owner only)
// router.put(
//     "/:id",
//     isLoggedIn,
//     isListingOwner,
//     validateListing,
//     wrapAsync(async (req, res) => {
//         // Reuse the listing loaded by isListingOwner
//         Object.assign(req.listing, req.body.listing);

//         await req.listing.save();

//         req.flash("success", "Listing updated successfully!");
//         res.redirect(`/listings/${req.listing._id}`);
//     })
// );

// // DELETE - Delete listing and its associated reviews (owner only)
// router.delete(
//     "/:id",
//     isLoggedIn,
//     isListingOwner,
//     wrapAsync(async (req, res) => {
//         const listing = req.listing;

//         // Delete associated reviews
//         await Review.deleteMany({
//             _id: { $in: listing.reviews }
//         });

//         // Delete the listing
//         await listing.deleteOne();

//         req.flash("success", "Listing deleted successfully!");
//         res.redirect("/listings");
//     })
// );

// // SHOW - Show one listing with its reviews
// router.get(
//     "/:id",
//     wrapAsync(async (req, res) => {
//         const listing = await Listing.findById(req.params.id)
//             .populate("reviews");

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found!");
//         }

//         res.render("listings/show.ejs", { listing });
//     })
// );

// module.exports = router;




// const express = require("express");
// const router = express.Router();

// // Import controller functions
// const listingController = require("../controllers/listing.js");

// // Import validation and error handling
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");

// // Import authentication and ownership middleware
// const {
//     isLoggedIn,
//     isListingOwner
// } = require("../middleware.js");

// // Validate listing data before saving
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         const message = error.details
//             .map(detail => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, message));
//     }

//     next();
// };

// // INDEX: Show all listings
// router.get(
//     "/",
//     wrapAsync(listingController.index)
// );

// // NEW: Show the create-listing form
// router.get(
//     "/new",
//     isLoggedIn,
//     listingController.renderNewForm
// );

// // CREATE: Save a new listing
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );

// // EDIT: Show the edit form (owner only)
// router.get(
//     "/:id/edit",
//     isLoggedIn,
//     isListingOwner,
//     listingController.renderEditForm
// );

// // UPDATE: Save listing changes (owner only)
// router.put(
//     "/:id",
//     isLoggedIn,
//     isListingOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// );

// // DELETE: Delete a listing (owner only)
// router.delete(
//     "/:id",
//     isLoggedIn,
//     isListingOwner,
//     wrapAsync(listingController.deleteListing)
// );

// // SHOW: Display one listing and its reviews
// router.get(
//     "/:id",
//     wrapAsync(listingController.showListing)
// );

// // Export the router for app.js
// module.exports = router;


// //ROUTER.ROUTE
// const geocodeLocation = require("../utils/geocode");
// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const streamifier = require("streamifier");

// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
// const cloudinary = require("../cloudconfig.js");
// const ExpressError = require("../utils/ExpressError.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");

// const storage = multer.memoryStorage();

// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         const allowed = [
//             "image/jpeg",
//             "image/png",
//             "image/webp"
//         ];

//         if (allowed.includes(file.mimetype)) {
//             return cb(null, true);
//         }

//         cb(new Error("Only JPG, PNG, and WebP images are allowed."));
//     }
// });

// const uploadToCloudinary = (buffer) =>
//     new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             {
//                 folder: "airbnb_listings",
//                 resource_type: "image"
//             },
//             (error, result) => {
//                 if (error) return reject(error);
//                 resolve(result);
//             }
//         );

//         streamifier.createReadStream(buffer).pipe(stream);
//     });

// const deleteCloudinaryImage = async (publicId) => {
//     if (!publicId) return;

//     try {
//         await cloudinary.uploader.destroy(publicId);
//     } catch (error) {
//         console.error("Cloudinary cleanup failed:", error.message);
//     }
// };

// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         const message = error.details
//             .map((detail) => detail.message)
//             .join(", ");

//         return next(new ExpressError(400, message));
//     }

//     next();
// };

// const handleUpload = (req, res, next) => {
//     upload.single("listingImage")(req, res, (error) => {
//         if (error) return next(new ExpressError(400, error.message));
//         next();
//     });
// };

// // LIST ALL
// router.get("/", wrapAsync(async (req, res) => {
//     const listings = await Listing.find({}).sort({ createdAt: -1 });

//     res.render("listings/index.ejs", {
//         listings,
//         title: "All Listings"
//     });
// }));

// // SHOW CREATE FORM
// router.get("/new", (req, res) => {
//     res.render("listings/new.ejs", {
//         title: "Create Listing"
//     });
// });

// // CREATE LISTING
// router.post(
//     "/",
//     handleUpload,
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const listingData = { ...req.body.listing };

//         if (req.file) {
//             const result = await uploadToCloudinary(req.file.buffer);

//             listingData.image = {
//                 filename: result.public_id,
//                 url: result.secure_url
//             };
//         } else {
//             listingData.image = {
//                 filename: "",
//                 url: "https://placehold.co/1000x600?text=No+Image"
//             };
//         }

//         // If Passport login is configured, associate the listing with its owner.
//         if (req.user) {
//             listingData.owner = req.user._id;
//         }

//         const listing = new Listing(listingData);
//         await listing.save();

//         req.flash("success", "Listing created successfully!");
//         res.redirect(`/listings/${listing._id}`);
//     })
// );

// // SHOW ONE LISTING
// router.get("/:id", wrapAsync(async (req, res) => {
//     const listing = await Listing.findById(req.params.id)
//         .populate("reviews");

//     if (!listing) {
//         throw new ExpressError(404, "Listing not found.");
//     }

//     res.render("listings/show.ejs", {
//         listing,
//         title: listing.title
//     });
// }));

// // EDIT FORM
// router.get("/:id/edit", wrapAsync(async (req, res) => {
//     const listing = await Listing.findById(req.params.id);

//     if (!listing) {
//         throw new ExpressError(404, "Listing not found.");
//     }

//     res.render("listings/edit.ejs", {
//         listing,
//         title: "Edit Listing"
//     });
// }));

// // UPDATE LISTING
// router.put(
//     "/:id",
//     handleUpload,
//     validateListing,
//     wrapAsync(async (req, res) => {
//         const listing = await Listing.findById(req.params.id);

//         if (!listing) {
//             throw new ExpressError(404, "Listing not found.");
//         }

//         const listingData = { ...req.body.listing };

//         if (req.file) {
//             const result = await uploadToCloudinary(req.file.buffer);

//             const oldPublicId = listing.image?.filename;

//             listingData.image = {
//                 filename: result.public_id,
//                 url: result.secure_url
//             };

//             // Remove old image only after the replacement uploads.
//             if (oldPublicId) {
//                 await deleteCloudinaryImage(oldPublicId);
//             }
//         } else {
//             // Preserve the existing image if no new file was selected.
//             listingData.image = listing.image;
//         }

//         Object.assign(listing, listingData);
//         await listing.save();

//         req.flash("success", "Listing updated successfully!");
//         res.redirect(`/listings/${listing._id}`);
//     })
// );

// // DELETE LISTING
// router.delete("/:id", wrapAsync(async (req, res) => {
//     const listing = await Listing.findByIdAndDelete(req.params.id);

//     if (!listing) {
//         throw new ExpressError(404, "Listing not found.");
//     }

//     await Review.deleteMany({ _id: { $in: listing.reviews } });

//     if (listing.image?.filename) {
//         await deleteCloudinaryImage(listing.image.filename);
//     }

//     req.flash("success", "Listing deleted successfully!");
//     res.redirect("/listings");
// }));

// module.exports = router;





const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const cloudinary = require("../cloudconfig.js");

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const geocodeLocation = require("../utils/geocode.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

// ==========================================
// MULTER CONFIGURATION
// ==========================================

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            return cb(null, true);
        }

        cb(
            new Error(
                "Only JPG, PNG, and WebP images are allowed."
            )
        );
    }
});

const handleUpload = (req, res, next) => {
    upload.single("listingImage")(req, res, (err) => {
        if (err) {
            return next(new ExpressError(400, err.message));
        }

        next();
    });
};

// ==========================================
// CLOUDINARY HELPERS
// ==========================================

const uploadToCloudinary = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "airbnb_listings",
                resource_type: "image"
            },
            (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve(result);
            }
        );

        streamifier
            .createReadStream(buffer)
            .pipe(stream);
    });

const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error(
            "Cloudinary cleanup failed:",
            err.message
        );
    }
};

// ==========================================
// JOI VALIDATION
// ==========================================

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const message = error.details
            .map((detail) => detail.message)
            .join(", ");

        return next(new ExpressError(400, message));
    }

    next();
};

// ==========================================
// GEOCODING HELPER
// ==========================================

const getGeometry = async (location) => {
    try {
        if (
            !location ||
            typeof geocodeLocation !== "function"
        ) {
            return null;
        }

        return await geocodeLocation(location);
    } catch (err) {
        console.error("Geocoding failed:", err.message);
        return null;
    }
};

// ==========================================
// LIST ALL LISTINGS
// ==========================================

router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({})
            .sort({ createdAt: -1 });

        // Important: index.ejs expects allListings.
        res.render("listings/index.ejs", {
            allListings,
            title: "All Listings"
        });
    })
);

// ==========================================
// NEW LISTING FORM
// ==========================================

router.get(
    "/new",
    isLoggedIn,
    (req, res) => {
        res.render("listings/new.ejs", {
            title: "Create Listing"
        });
    }
);

// ==========================================
// CREATE LISTING
// ==========================================

router.post(
    "/",
    isLoggedIn,
    handleUpload,
    validateListing,
    wrapAsync(async (req, res) => {
        const listingData = {
            ...req.body.listing
        };

        // Protect fields controlled by the server.
        delete listingData.owner;
        delete listingData.reviews;
        delete listingData.geometry;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer
            );

            listingData.image = {
                filename: result.public_id,
                url: result.secure_url
            };
        } else {
            listingData.image = {
                filename: "",
                url: "https://placehold.co/1000x600?text=No+Image"
            };
        }

        const geometry = await getGeometry(
            listingData.location
        );

        if (geometry) {
            listingData.geometry = geometry;
        }

        listingData.owner = req.user._id;
        listingData.reviews = [];

        const listing = new Listing(listingData);

        await listing.save();

        req.flash(
            "success",
            "Listing created successfully!"
        );

        res.redirect(`/listings/${listing._id}`);
    })
);


// ==========================================
// SHOW ONE LISTING
// ==========================================

router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id)
            .populate("reviews")
            .populate("owner");

        if (!listing) {
            throw new ExpressError(404, "Listing not found.");
        }

        res.render("listings/show.ejs", {
            listing,
            title: listing.title,
            mapToken: process.env.MAP_TOKEN || ""
        });
    })
);


// ==========================================
// EDIT LISTING FORM
// ==========================================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(
            req.params.id
        );

        if (!listing) {
            throw new ExpressError(
                404,
                "Listing not found."
            );
        }

        res.render("listings/edit.ejs", {
            listing,
            title: "Edit Listing"
        });
    })
);

// ==========================================
// UPDATE LISTING
// ==========================================

router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    handleUpload,
    validateListing,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(
            req.params.id
        );

        if (!listing) {
            throw new ExpressError(
                404,
                "Listing not found."
            );
        }

        const listingData = {
            ...req.body.listing
        };

        // Prevent changes to protected fields.
        delete listingData.owner;
        delete listingData.reviews;
        delete listingData.geometry;
        delete listingData.image;

        const oldPublicId = listing.image?.filename;
        let newPublicId = null;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer
            );

            newPublicId = result.public_id;

            listingData.image = {
                filename: result.public_id,
                url: result.secure_url
            };
        }

        const geometry = await getGeometry(
            listingData.location
        );

        if (geometry) {
            listingData.geometry = geometry;
        }

        Object.assign(listing, listingData);

        try {
            await listing.save();
        } catch (err) {
            if (newPublicId) {
                await deleteCloudinaryImage(newPublicId);
            }

            throw err;
        }

        // Remove the old image after a successful save.
        if (newPublicId && oldPublicId) {
            await deleteCloudinaryImage(oldPublicId);
        }

        req.flash(
            "success",
            "Listing updated successfully!"
        );

        res.redirect(`/listings/${listing._id}`);
    })
);

// ==========================================
// DELETE LISTING
// ==========================================

router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(
            req.params.id
        );

        if (!listing) {
            throw new ExpressError(
                404,
                "Listing not found."
            );
        }

        // Delete associated reviews.
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });

        await Listing.findByIdAndDelete(
            req.params.id
        );

        // Delete the Cloudinary image.
        if (listing.image?.filename) {
            await deleteCloudinaryImage(
                listing.image.filename
            );
        }

        req.flash(
            "success",
            "Listing deleted successfully!"
        );

        res.redirect("/listings");
    })
);

module.exports = router;
