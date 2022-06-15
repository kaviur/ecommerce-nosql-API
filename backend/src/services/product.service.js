import { productModel } from '../models/index.js';

export default class ProductService {
    
        async createProduct(data) {
            try {
                const product = await productModel.create({ ...data });
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        async getAllProducts() {
            try {
                const products = await productModel.find({});
                return { success: true, products };
            } catch (error) {
                return { success: false, error };
            }
        }

        async getProductById(id) {
            try {
                const product = await productModel.findById(id).populate('reviews');
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        async getProductsBySeller(sellerId) {
            try {
                const products = await productModel.find({ sellerId:sellerId });
                return { success: true, products };
            } catch (error) {
                return { success: false, error };
            }
        }

        //TODO: que se pueda editar todo menos el id del vendedor, ni el estado
        async updateProduct(id, data) {
            try {
                const product = await productModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true });
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        async deleteProduct(id) {
            try {
                const product = await productModel.findOneAndUpdate({ _id: id }, { status: false });
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        async changeStatusProduct(id) {
            try {
                const productData = await productModel.findById(id);
                const product = await productModel.findOneAndUpdate({ _id: id }, { status: !productData.status }, { new: true });
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        //filters
        // async getProductsByCategory(categoryId) {
        //     try {
        //         const products = await productModel.find({ category: categoryId });
        //         return { success: true, products };
        //     } catch (error) {
        //         return { success: false, error };
        //     }
        // }

        // async getByCategoryAndSubcategory(categoryId, subcategoryId) {
        //     try {
        //         const products = await productModel.find({ category: categoryId, subcategory: subcategoryId });
        //         return { success: true, products };
        //     } catch (error) {
        //         return { success: false, error };
        //     }
        // }

        // async getProductsByName(name) {
        //     try {
        //         const products = await productModel.find({ name: { $regex: name, $options: "i" } });
        //         return { success: true, products };
        //     } catch (error) {
        //         return { success: false, error };
        //     }
        // }

        //filtrar por cualquier opción
        async getProductsByPriceRangeAndOtherFilters(priceRange, priceLessThan, category, subcategory, name, popular, size, color, brand) {
            try {
                // si no selecciona ningún filtro muestra por defecto todos los productos
                if(!priceRange, !priceLessThan, !category, !subcategory, !name, !popular, !size, !color, !brand) {
                    return await productModel.find({});
                }

                const filters = {
                    $and: []
                }
                if (priceRange) {
                    filters.$and.push({ price: { $gte: priceRange[0], $lte: priceRange[1] } });
                }else if (priceLessThan) {
                    filters.$and.push({ price: { $lte: priceLessThan } });
                }

                if (category) {
                    filters.$and.push({ category: category });
                }
                if (subcategory) {
                    filters.$and.push({ subcategory: subcategory });
                }
                if (name) {
                    filters.$and.push({ name: { $regex: name, $options: "i" } });
                }
                if (popular) {
                    filters.$and.push({ popular: popular });
                }
                if (size) {
                    filters.$and.push({ size: size });
                }
                if (color) {
                    filters.$and.push({ color: color });
                }
                if (brand) {
                    filters.$and.push({ brand: brand });
                }
                const products = await productModel.find(filters);
                return { success: true, products };
            } catch (error) {
                return { success: false, error };
            }
        } 
        
        //filtro del buscador
        async getCoincidencesOfSearch(search) {
            try {
                const products = await productModel.find({ 
                    $or: [
                        { name: { $regex: search, $options: "i" } }, 
                        { description: { $regex: search, $options: "i" } },
                        { brand: { $regex: search, $options: "i" } },
                        { color: { $regex: search, $options: "i" } },
                        { size: { $regex: search, $options: "i" } },
                        { sku: { $regex: search, $options: "i" } }
                        //{ category: { $regex: search, $options: "i" } }, // todo: hacer que la coincidencia incluya el nombre de la categoria y la subcategoria
                        //{ subcategory: { $regex: search, $options: "i" } }
                    ] 
                });
                return { success: true, products };
            } catch (error) {
                return { success: false, error };
            }
        }

        // async getProductsByPriceRangeAndCategoryAndSubcategoryAndName(priceRange, categoryId, subcategoryId, name) {
        //     try {
        //         const products = await productModel.find({ price: { $gte: priceRange[0], $lte: priceRange[1] }, category: categoryId, subcategory: subcategoryId, name: { $regex: name, $options: "i" } });
        //         return { success: true, products };
        //     } catch (error) {
        //         return { success: false, error };
        //     }
        // }

    }