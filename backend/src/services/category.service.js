import { categoryModel } from "../models/index.js";

export default class CategoryService {

    async createCategory(data) {
        try {
            const category = new categoryModel({ ...data });
            await category.save();
            return { success: true, category };
        } catch (error) {
            return { success: false, error };
        }
    }

    async getAllCategories() {
        try {
            const categories = await categoryModel.find();
            return { success: true, categories };
        } catch (error) {
            return { success: false, error };
        }
    }

    async getCategoryById(id) {
        try {
        const category = await categoryModel.findById(id);
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async updateCategory(id, data) {
        try {
        const category = await categoryModel.findByIdAndUpdate(id, data, { new: true });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async addSubcategory(id, subcategoryId) {
        try {
        const category = await categoryModel.findByIdAndUpdate(id, { $push: { subcategories: subcategoryId } }, { new: true });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async inactivateCategory(id) {
        try {
        const category = await categoryModel.findByIdAndUpdate(id, { status: false }, { new: true });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async activateCategory(id) {
        try {
        const category = await categoryModel.findByIdAndUpdate(id, { status: true }, { new: true });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async changeStatus(id) {
        try {
        const category = await categoryModel.findByIdAndUpdate(id, { status: !category.status }, { new: true });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async removeSubcategory(id, subcategoryId) {
        try {
        const category = await categoryModel.findByIdAndUpdate(id, { $pull: { subcategories: subcategoryId } });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }
    
}
