import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { validateRol, verifyToken } from "../middlewares/auth.middleware.js";
import { CreditCardservice }  from "../services/creditCard.service.js";

export class CreditCardRoute {
  #router;
  #service; 
  constructor() {
    this.#router = Router();
    this.#service = new  CreditCardyservice();
    this.#routes();
  }

  #routes() {
    this.router.get("/", verifyToken, async (req = request, res = response) => {
      const response = await this.#service.getCreditCards();
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "List Credit Cards",
            response.data
          )
        : errorResponse(res, response.error);
    });

    this.router.get(
      "/admin",
      [verifyToken, validateRol(3)],
      async (req = request, res = response) => {
        const response = await this.#service.getCreditCards(true);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "Hello Administrator, This is the Credit Cards List",
              response.data
            )
          : errorResponse(res, response.error);
      }
    );

    this.#router.put(
      "/:id",
      [verifyToken, validateRol(3, 2)],
      async (req = request, res = response) => {
        const { numberCard } = req.body;
        const { id } = req.params;
        const response = await this.#service.updateCreditCard(numberCard, id);
        response.succesC
          ? successfulResponse(
              res,
              200,
              true,
              "The Credit Card data has been updated",
              response.creditcard
            )
          : errorResponse(res, response.error);
      }
    );

    this.#router.put(
      "/admin/:id",
      [verifyToken, validateRol(3)],
      async (req = request, res = response) => {
        const { id } = req.params;
        const response = await this.#service.changeStatus(id);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "The Credit Card data has been updated",
              response.creditcard
            )
          : errorResponse(res, response.error);
      }
    );

    this.router.post(
      "/",
      [verifyToken, validateRol(2, 3)],
      async (req = request, res = response) => {
        const { numbercard } = req.body;
        const response = await this.#service.createCreditCard(numbercard);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "The Credit Card data has been created",
              response.creditcard
            )
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
