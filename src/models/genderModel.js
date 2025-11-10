const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema(
    {
    title: { 
        uz: {type: String, required: true, trim: true},
        ru: {type: String, required: false, trim: true},
        oz: {type: String, required: false, trim: true},
    },
    description: {
        uz: { type: String, required: false, trim: true},
        ru: { type: String, required: false, trim: true},
        oz: { type: String, required: false, trim: true}
    },
    file: {type: String, required: false},
}, {timestamps: true});

module.exports = mongoose.model("NefteGazGender", genderSchema)