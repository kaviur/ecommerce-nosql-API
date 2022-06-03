import { subCategoryModel } from "../models/index.js";

export class SubCategoryservice {
  async getSubCategories(admin = false) {
    try {
      const data = !admin
        ? await subCategoryModel.find({ status: true })
        : await subCategoryModel.find();
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  async createSubCategory(name) {
    try {
      const subcategory = new subCategoryModel({ name });
      await subcategory.save();
      return { success: true, subcategory };
    } catch (error) {
      return { success: false, error };
    }
  }

  async updateSubCategory(name, id) {
    try {
      const subcategory = await subCategoryModel.findOne(
        {
          _id: id,
          status: true,
        },
        { new: true }
      );
      subcategory.name = name || subcategory.name;
      await subcategory.save();
      return { success: true, subcategory };
    } catch (error) {
      return { success: false, error };
    }
  }

  async changeStatus(id) {
    try {
      const subcategory = await subCategoryModel.findOne({
        _id: id,
      });
      subcategory.status = !subcategory.status;
      await subcategory.save();
      return { success: true, subcategory };
    } catch (error) {
      return { success: false, error };
    }
  }
}
