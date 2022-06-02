import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "The name is required"],
    unique: [true, "The sub-category is already registered "],
    trim: true,
    uppercase: true,
  },
  status:{
    type: Boolean,
    default: true
  }
});

subCategorySchema.methods.toJSON = function () {
  const { __v,createdAt, updatedAt,...subCategory } = this.toObject();
  return subCategory;
};

export default mongoose.model("SubCategory", subCategorySchema)
