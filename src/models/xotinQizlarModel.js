const mongoose = require("mongoose");

const xotinQizlarSchema = new mongoose.Schema(
    {
        title: {
          uz: { type: String, required: true },
          ru: { type: String },
          oz: { type: String },
        },
    
        decree: {
          uz: { type: String, required: true },
          ru: { type: String },
          oz: { type: String },
        },
    
        description: {
          uz: { type: String, required: true },
          ru: { type: String },
          oz: { type: String },
        },
    
        file: { type: String, required: true },
    
        fileType: { type: String },
    
        createdAt: { type: Date, default: Date.now },
      },
      { versionKey: false }
)
module.exports = mongoose.model("NefteGazXotinQizlar", xotinQizlarSchema);
