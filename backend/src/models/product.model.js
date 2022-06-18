import mongoose from "mongoose";
import mongoseePaginate from 'mongoose-paginate-v2'
import { callbackUrl } from "../config/config.js";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "The description is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "The price is required"],
        trim: true
    },
    discount: {
        type: Number,
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "The category is required"]
    },
    subCategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "The sub-category is required"]
    },
    stock: {
        type: Number,
        required: [true, "The stock is required"],
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    popular: {
        type: Boolean,
        default: false
    },
    sizes: [{
        type: String,
        trim: true,
        uppercase: true
    }],
    colors: [{
        type: String,
        trim: true
    }],
    brand: {
        type: String,
        trim: true,
        default: "N/A"
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    slug: {
        type: String,
        trim: true,
        unique: true
    },
    sku: {
        type: String,
        trim: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The seller is required"]
    }
},
{ timestamps: true }
);

productSchema.plugin(mongoseePaginate)

productSchema.methods.saveImages = function (filesName) {
    filesName.forEach(name => {
        this.images.push(`${callbackUrl}/public/product/${name}`)
    });
}

export default mongoose.model("Product", productSchema);
