import { request, response, Router } from "express";

export class StripeRoute {
  #router;

  constructor() {
    this.#router = Router();
    this.#routes();
  }

  #routes() {
    this.#router.post("/", (req = request, res = response) => {
      const sig = request.headers["stripe-signature"];

      return res.status(200).json({
        ok: true,
        message: "success",
      });
    });

    
  }

  get router() {
    return this.#router;
  }
}
