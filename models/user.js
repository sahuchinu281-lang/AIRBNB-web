// 2//

// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true
//     }
// });

// userSchema.plugin(passportLocalMongoose, {
//     usernameLowerCase: true
// });

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");
const passportLocalMongoosePackage = require("passport-local-mongoose");

const passportLocalMongoose =
    typeof passportLocalMongoosePackage === "function"
        ? passportLocalMongoosePackage
        : passportLocalMongoosePackage.default;

if (typeof passportLocalMongoose !== "function") {
    throw new Error(
        "Invalid passport-local-mongoose export. Reinstall the package."
    );
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        }
    },
    { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
    usernameField: "username"
});

module.exports =
    mongoose.models.User ||
    mongoose.model("User", userSchema);


