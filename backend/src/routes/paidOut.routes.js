import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { validateRol, verifyToken } from "../middlewares/auth.middleware.js";
import { PaidOutservice } from "../services/paidOut.service.js";

export class PaidOutRoute {
  #router;
  #service;
  constructor() {
    this.#router = Router();
    this.#service = new PaidOutservice();
    this.#routes();
  }

  #routes() {
    this.router.get("/", verifyToken, async (req = request, res = response) => {
      const response = await this.#service.getPaidOuts();
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "List Paid Outs",
            response.data
          )
        : errorResponse(res, response.error);
    });

    this.router.get(
      "/admin",
      [verifyToken, validateRol(3)],
      async (req = request, res = response) => {
        const response = await this.#service.getPaidOut(true);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "Hello Administrator, This is the Paids Out List",
              response.data
            )
          : errorResponse(res, response.error);
      }
    );

    this.#router.put(
      "/:id",
      [verifyToken, validateRol(3, 2)],
      async (req = request, res = response) => {
        const { name } = req.body;
        const { id } = req.params;
        const response = await this.#service.updatePaidOut(name, id);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "The Paid Out data has been updated",
              response.paidout
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
              "The Paid Out data has been updated",
              response.paidout
            )
          : errorResponse(res, response.error);
      }
    );

    this.router.post(
      "/",
      [verifyToken, validateRol(2, 3)],
      async (req = request, res = response) => {
        const { name } = req.body;
        const response = await this.#service.createPaidOut(name);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "The Paid Out has been created",
              response.paidout
            )
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
