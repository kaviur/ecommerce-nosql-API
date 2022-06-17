import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: [true, "The product is required"]
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: [true, "The user is required"]
    },
    stars: {
        type: Number,
        require: [true, "The rating is required"],
        trim: true
    },
    title: {
        type: String,
        require: [true, "The title is required"],
        trim: true
    },
    comment: {
        type: String,
        require: [true, "The comment is required"],
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);