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
            const allCategories = await categoryModel.find({status:true})
            .populate({
                path: "subcategories",
                match: { status: true },
            });

            const categories = allCategories.filter(category => category.subcategories)
            
            return { success: true, categories };
        } catch (error) {
            return { success: false, error };
        }
    }

    async getCategoryById(id) {
        try {
        const category = await categoryModel.findById(id).populate("subcategories", "name");
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    async updateCategory(id, name) {
        try {
            const category = await categoryModel.findOne({ _id: id, status: true }, { new: true });
            category.name = name || category.name;
            await category.save();
            return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }

    //verificar si ya existe esa subcategoría dentro de la categoría
    async checkSubcategory(id, subcategoryId) {
        try {
            const category = await categoryModel.findById(id);
            const subcategory = category.subcategories.find(subcategory => subcategory._id.toString() === subcategoryId.toString());
            if (subcategory) {
                return { success: false, error: "Subcategory already exists" };
            } else {
                return { success: true, message: "Subcategory does not exist" };
            }
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
        const category = await categoryModel.findByIdAndUpdate(id, { $pull: { subcategories: subcategoryId } }, { new: true });
        return { success: true, category };
        } catch (error) {
        return { success: false, error };
        }
    }
    
}
