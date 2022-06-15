import { cartModel } from "../models/index.js";

export class CartService {
  async getItems(idUser) {
    try {
      const cart = await cartModel.find({ _id: idUser });
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
    try {
      const cart = await cartModel.findByIdAndUpdate(
        idUser,
        {
          $push: {
            items: { amount },
          },
        },
        { new: true }
      );

      return { success: true, cart };
    } catch (error) {
      return { success: false, error };
    }
  }

  async updateAmount(idUser, amount) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        {
          _id: idUser,
          "items._id": "62aa44fddd937f9815cc6bcc",
        },
        {
          $set: {
            "items.$.amount": amount,
          },
        },
        { new: true }
      );
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
