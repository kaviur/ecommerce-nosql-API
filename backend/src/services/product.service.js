import {
  categoryModel,
  productModel,
  subCategoryModel,
} from "../models/index.js";
import { deleteImages, uploadImage } from "../helpers/images.helper.js";
export default class ProductService {
  async createProduct(data, files) {
    let imagesName = [];
    try {
      data.slug = this.createSlug(data);
      const product = new productModel({ ...data });
      imagesName = await uploadImage(files, "products");
      product.saveImages(imagesName);
      await product.save();
      return { success: true, product };
    } catch (error) {
      imagesName.length > 0 && (await deleteImages(imagesName, "products"));
      return { success: false, error };
    }
  }

  async getAllProducts(limit, page) {
    try {
      const { docs: products, ...information } = await productModel.paginate(
        { status: true },
        {
          limit,
          page,
          populate: [
            { path: "categoryID", select: "name" },
            { path: "subCategoryID", select: "name" },
          ],
        }
      );

      const data = { products, information };
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getProductBySlug(slug) {
    try {
      const product = await productModel.findOne({ slug: slug });

      if (!product) {
        return { success: false, error: "Product not found" };
      }
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getProductsBySeller(sellerId, page, limit) {
    try {
      const { docs: products, ...productsproducts } =
        await productModel.paginate(
          { sellerId: sellerId },
          {
            page,
            limit,
            populate: [
              { path: "categoryID", select: "name" },
              { path: "subCategoryID", select: "name" },
            ],
          }
        );
      const data = { products, productsproducts };
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
  0;

  //TODO: que se pueda editar todo menos el id del vendedor, ni el estado
  async updateProduct(id, data) {
    try {
      const productToUpdate = await productModel.findById(id);

      if (data.name && productToUpdate.name != data.name) {
        data.slug = this.createSlug(data);
      }

      const product = await productModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true }
      );
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  }

  async deleteProduct(id) {
    try {
      await productModel.findByIdAndDelete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async changeStatus(id) {
    try {
      const productData = await productModel.findById(id);
      const product = await productModel.findOneAndUpdate(
        { _id: id },
        { status: !productData.status },
        { new: true }
      );
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  }

  //filtrar por cualquier opción
  async getProductsByPriceRangeAndOtherFilters(
    name,
    priceHigherThan,
    priceLessThan,
    category,
    subcategory,
    popular,
    size,
    color,
    brand,
    limit,
    page
  ) {
    try {
      // si no selecciona ningún filtro muestra por defecto todos los productos
      if (
        !name &&
        !priceHigherThan &&
        !priceLessThan &&
        !category &&
        !subcategory &&
        !popular &&
        !size &&
        !color &&
        !brand
      ) {
        return await this.getAllProducts();
      }

      const filters = {
        $and: [],
      };
      if (priceHigherThan && priceLessThan) {
        filters.$and.push({
          price: {
            $gte: priceHigherThan,
            $lte: priceLessThan,
          },
        });
      } else if (priceLessThan && !priceHigherThan) {
        filters.$and.push({ price: { $lte: priceLessThan } });
      } else if (priceHigherThan && !priceLessThan) {
        filters.$and.push({ price: { $gte: priceHigherThan } });
      }

      if (name) filters.$and.push({ name: { $regex: name, $options: "i" } });
      if (category) filters.$and.push({ categoryID: category });
      if (subcategory) filters.$and.push({ subCategoryID: subcategory });
      if (popular) filters.$and.push({ popular: popular });
      if (color)
        filters.$and.push({ colors: { $elemMatch: { $regex: color } } });
      if (size) filters.$and.push({ sizes: { $elemMatch: { $regex: size } } });
      if (brand) filters.$and.push({ brand: brand });

      filters.$and.push({ status: true });

      const { docs: products, ...information } = await productModel.paginate(
        filters,
        {
          page,
          limit,
          populate: [
            { path: "categoryID", select: "name" },
            { path: "subCategoryID", select: "name" },
          ],
        }
      );
      const data = { products, information };
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  //filtro del buscador
  async getCoincidencesOfSearch(search, page, limit) {
    try {
      const regularExpression = RegExp(search, "i");

      const [categories, subCategories] = await Promise.all([
        categoryModel.find({ name: regularExpression }),
        subCategoryModel.find({ name: regularExpression }),
      ]);
      const { docs: products, ...information } = await productModel.paginate(
        {
          $or: [
            ...subCategories.map((subCategory) => ({
              subCategoryID: subCategory._id,
            })),
            ...categories.map((category) => ({ categoryID: category._id })),
            { name: regularExpression },
            { description: regularExpression },
            { brand: regularExpression },
            { colors: regularExpression },
            { sku: regularExpression },
          ],
          $and: [{ status: true }],
        },
        {
          page,
          limit,
          populate: [
            { path: "categoryID", select: "name" },
            { path: "subCategoryID", select: "name" },
          ],
        }
      );
      const data = { products, information };
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  async verifyStock(id, quantity) {
    const product = await productModel.findById(id);
    if (product.stock < quantity) {
      return {
        success: false,
        error: {
          message: `The product ${product.name} has only ${product.stock} units`,
        },
      };
    }
    return { success: true };
  }

  async addImage(idProduct, idUser, role, files) {
    let nameImages = [];
    try {
      const product = await productModel.findOne({
        _id: idProduct,
        status: true,
      });
      if (!product)
        return {
          success: false,
          error: { message: `Product not found` },
          status: 404,
        };

      if (role !== 3 && product.sellerId.toString() !== idUser)
        return { success: false, error: "insufficient permissions" };
      nameImages = await uploadImage(files, "products");
      product.saveImages(nameImages);
      await product.save();
      return { success: true, product };
    } catch (error) {
      nameImages.length > 0 && (await deleteImages(nameImages, "products"));
      return { success: false, error };
    }
  }

  async removeImage(userId, productId, image, role) {
    try {
      let product = await productModel.findOne({
        _id: productId,
        status: true,
      });
      if (!product)
        return {
          success: false,
          error: `Product not found`,
        };
      if (role !== 3 && product.sellerId.toString() !== userId)
        return { success: false, error: "insufficient permissions" };
      product = await productModel.findOneAndUpdate(
        { _id: productId },
        { $pull: { images: image } },
        { new: true }
      );
      await deleteImages(image);

      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  }

  createSlug(data) {
    let str = data.name.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();

    var from = "ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";

    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");

    let random = Math.floor(Math.random() * (99999 - 10000)) + 10000;

    return str + random;
  }
}
