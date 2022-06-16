import { productModel } from '../models/index.js';

export default class ProductService {
    
        async createProduct(data) {
            try {
                let str = data.name.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();
            
                // remove accents, swap ñ for n, etc
                var from = "ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;";
                var to   = "aaaaaeeeeeiiiiooooouuuunc------";

                for (var i=0, l=from.length ; i<l ; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }
        
                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -

                let random = Math.floor(Math.random() * (99999 - 10000)) + 10000;

                data.slug = str+random;

                const product = await productModel.create({ ...data });
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        async getAllProducts() {
            try {
                const products = await productModel.find({status: true});
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
                const productToUpdate= await productModel.findById(id);

                if(data.name && productToUpdate.name != data.name) {      
                    let str = data.name.replace(/^\s+|\s+$/g, ''); // trim
                    str = str.toLowerCase();
                
                    // remove accents, swap ñ for n, etc
                    var from = "ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;";
                    var to   = "aaaaaeeeeeiiiiooooouuuunc------";

                    for (var i=0, l=from.length ; i<l ; i++) {
                        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                    }
            
                    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                    .replace(/\s+/g, '-') // collapse whitespace and replace by -

                    let random = Math.floor(Math.random() * (99999 - 10000)) + 10000;
                    data.slug = str+random;
                }

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

        async changeStatus(id) {
            try {
                const productData = await productModel.findById(id);
                const product = await productModel.findOneAndUpdate({ _id: id }, { status: !productData.status }, { new: true });
                return { success: true, product };
            } catch (error) {
                return { success: false, error };
            }
        }

        //filtrar por cualquier opción
        async getProductsByPriceRangeAndOtherFilters(name, priceRange, priceLessThan, category, subcategory, popular, size, color, brand) {
            try {
                // si no selecciona ningún filtro muestra por defecto todos los productos
                if(!name && !priceRange && !priceLessThan && !category && !subcategory && !popular && !size && !color && !brand) {
                    return await this.getAllProducts();
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
                filters.$and.push({ status: true });

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
                        { sku: { $regex: search, $options: "i" } },
                        //{ category: { $regex: search, $options: "i" } }, // todo: hacer que la coincidencia incluya el nombre de la categoria y la subcategoria
                        //{ subcategory: { $regex: search, $options: "i" } }
                    ] 
                }).populate('subCategoryID', 'name');
                return { success: true, products };
            } catch (error) {
                return { success: false, error };
            }
        }
        
        async verifyStock(id, quantity) {
            const product = await productModel.findById(id);
            if(product.stock < quantity) {
                return { success: false, message: 'No hay suficiente stock' };
            }
            return { success: true };
        }

    }