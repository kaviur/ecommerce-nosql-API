import { cartModel } from "../models/index.js";
import ProductService from "./product.service.js";

export class CartService {
  #servicesProduct;
  constructor() {
    this.#servicesProduct = new ProductService();
  }
  async getCart(idUser) {
    try {
      const cart = await cartModel
        .findOne({ _id: idUser })
        .populate({ path: "items._id", select: ["name", "price", "sku"] });
      return { success: true, cart };
    } catch (error) {
      return { success: false, error };
    }
  }

  async clearCart(idUser) {
    try {
      await cartModel.findByIdAndUpdate(idUser, { items: [] });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async addItem(idUser, amount, product) {
    let cart;
    try {
      const responseStock = await this.#servicesProduct.verifyStock(product, amount);

      if (!responseStock.success) return responseStock
        
      cart = await cartModel
        .findOneAndUpdate(
          { _id: idUser, "items._id": product },
          {
            $set: {
              "items.$.amount": amount,
            },
          },
          { new: true }
        )
        .populate({ path: "items._id", select: ["name", "price", "sku"] });

      if (!cart) {
        cart = await cartModel
          .findOneAndUpdate(
            { _id: idUser },
            {
              $push: {
                items: { amount, _id: product },
              },
            },
            { new: true }
          )
          .populate({ path: "items._id", select: ["name", "price", "sku"] });
      }

      return { success: true, cart };
    } catch (error) {
      return { success: false, error };
    }
  }

  async removeItem(idUser, productId) {
    try {
      const cart = await cartModel.findByIdAndUpdate(
        idUser,
        {
          $pull: {
            items: {
              _id: productId,
            },
          },
        },
        { new: true }
      );
      return { success: true, cart };
    } catch (error) {
      return { success: false, error };
    }
  }
}
