import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: String,
    DOB: String,
});

export default mongoose.model('Author', Schema);