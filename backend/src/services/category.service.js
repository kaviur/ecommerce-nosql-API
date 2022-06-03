import { categoryModel } from "../models/index.js";

export default class CategoryService {

    async createCategory(data) {
        try {
            //si existe la categoría
            const categoryExists = await categoryModel.findOne({ name: data.name });
            if(!categoryExists){
                const category = await categoryModel.create({ ...data });
                return { success: true, category };
            }else{
                return { success: false, error: "The category name is already in use" };
            }
        } catch (error) {
            return { success: false, error };
        }
    }

    async getAllCategories() {
        try {
            const categories = await categoryModel.find({ status: true }).populate("subcategories", "name");
            return { success: true, categories };
        } catch (error) {
            return { success: false, error };
        }
    }

    async getCategoryById(id) {
        try {
        const category = await categoryModel.findById(id).populate("subcategories", "name");//TODO: Obtener sólo las subcategorías que tengan el estado = true
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

    // async updateSubCategory(name, id) {
    //     try {
    //         const subcategory = await subCategoryModel.findOne(
    //         {
    //             _id: id,
    //             status: true,
    //         },
    //         { new: true }
    //         );
    //         subcategory.name = name || subcategory.name;
    //         await subcategory.save();
    //         return { success: true, subcategory };
    //     } catch (error) {
    //         return { success: false, error };
    //     }
    // }

    async changeStatus(id) {
        try {
            const category = await categoryModel.findById(id); 
            const categoryChanged = await categoryModel.findByIdAndUpdate(id, { status: !category.status }, { new: true });
            return { success: true, categoryChanged };
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
