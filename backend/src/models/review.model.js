import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "The product is required"]
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The user is required"]
    },
    stars: {
        type: Number,
        required: [true, "The rating is required"],
        trim: true
    },
    title: {
        type: String,
        required: [true, "The title is required"],
        trim: true
    },
    comment: {
        type: String,
        required: [true, "The comment is required"],
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);