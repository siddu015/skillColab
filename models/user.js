const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    skills: {
        type: [String],
        validate: [skillsLimit, 'You can specify up to 25 skills only.'],
        required: true,
    },
    role: {
        type: [String],
        validate: [roleLimit, 'You can specify up to 5 roles only.'],
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    }
});

function skillsLimit(val) {
    return val.length <= 25;
}

function roleLimit(val) {
    return val.length <= 5;
}

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
