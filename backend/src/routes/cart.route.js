import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { CartService } from "../services/cart.service.js";

export class CartRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new CartService();
    this.#routes();
  }

  #routes() {
    this.#router.get(
      "/",
      verifyToken,
      async (req = request, res = response) => {
        const { id } = req.payload;
        const response = await this.#services.getCart(id);
        response.success
          ? successfulResponse(res, 200, true, "Cart", response.cart)
          : errorResponse(res, response.error);
      }
    );

    this.#router.put(
      "/clear",
      verifyToken,
      async (req = request, res = response) => {
        const { id } = req.payload;
        const response = await this.#services.clearCart(id);
        response.success
          ? successfulResponse(res, 200, true, "Cart was clear")
          : errorResponse(res, response.error);
      }
    );

    this.#router.post(
      "/add-item",
      verifyToken,
      async (req = request, res = response) => {
        const { id } = req.payload;
        const { amount, product } = req.body;
        const response = await this.#services.addItem(id, amount,product);
        response.success
          ? successfulResponse(res, 200, true, "Product added", response.cart)
          : errorResponse(res, response.error);
      }
    );

    
    this.#router.delete(
      "/remove-item/:id",
      verifyToken,
      async (req = request, res = response) => {
        const { id } = req.payload;
        const { id:product } = req.params;
        const response = await this.#services.removeItem(id, product);
        response.success
          ? successfulResponse(res, 200, true, "Item removed", response.cart)
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
