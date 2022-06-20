import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { PaymentService } from "../services/payment.service.js";

export class PaymentRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new PaymentService();
    this.#routes();
  }

  #routes() {
    this.#router.get(
      "/pay",
      verifyToken,
      async (req = request, res = response) => {
        const { id: idUser ,stripeCustomerId} = req.payload;
        const response = await this.#services.payCart(idUser,stripeCustomerId);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "Secret client generated successfully",
              response.clientSecret
            )
          : errorResponse(res, response.error);
      }
    );

    this.#router.post("/webhooks", async (req = request, res = response) => {
      const sig = req.headers["stripe-signature"];
      const response = await this.#services.confirmPayment(req.body, sig);

      response.succes
        ? successfulResponse(res, 200, true, "Payment successful")
        : errorResponse(res, response.error);
    });
  }

  get router() {
    return this.#router;
  }
}
