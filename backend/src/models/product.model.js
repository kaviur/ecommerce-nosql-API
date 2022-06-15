import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "The name is required"],
        trim: true
    },
    description: {
        type: String,
        require: [true, "The description is required"],
        trim: true
    },
    price: {
        type: Number,
        require: [true, "The price is required"],
        trim: true
    },
    discount: {
        type: Number,
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        require: [true, "The category is required"]
    },
    subCategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        require: [true, "The sub-category is required"]
    },
    stock: [
        {
            quantity: {
                type: Number,
                require: [true, "The quantity is required"],
                trim: true
            },
            size: {
                type: String,
                require: [true, "The size is required"],
                trim: true
            },
            color: {
                type: String,
                require: [true, "The color is required"],
                trim: true
            }
        }
    ],
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
        uppercase: true,
        enum: ["S", "M", "L", "XL", "XXL"]
    }],
    colors: [{
        type: String,
        trim: true,
        enum: ["Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Pink", "Purple", "Brown", "Grey"]
    }],
    brand: {
        type: String,
        trim: true,
        default: "N/A",
        enum: ["N/A", "Adidas", "Nike", "Puma", "Reebok", "Asics", "New Balance", "Under Armour", "Vans", "Onitsuka", "Under Armour", "Puma", "Reebok", "Asics", "New Balance", "Vans", "Onitsuka"]
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
        require: [true, "The seller is required"]
    }
},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);
