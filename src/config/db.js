const mongoose = require("mongoose");

const MONGO_URI = 'mongodb+srv://Sardor:A4004950s@cluster0.z3mqc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully")
    } catch(e) {
        console.log(e)
        process.exit(1);
    }
}

module.exports = connectDB;