import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
      trim: true,
      uppercase: true,
    },
    subcategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory"        }
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Category", categorySchema);