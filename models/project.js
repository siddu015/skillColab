const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to User model
    }],
    skillsRequired: {
        type: [String],  // Array of strings for skills like "JavaScript", "Node.js"
        validate: [skillsLimit, 'You can specify up to 25 skills only.'],
        required: true,
    },
    rolesRequired: {
        type: [String],  // Array of strings for roles like "Frontend Developer", "Fullstack Developer"
        validate: [rolesLimit, 'You can specify up to 5 roles only.'],
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'completed'],
        default: 'open',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

// Custom validators for skillsRequired and rolesRequired
function skillsLimit(val) {
    return val.length <= 25;
}

function rolesLimit(val) {
    return val.length <= 5;
}

module.exports = mongoose.model("Project", projectSchema);
