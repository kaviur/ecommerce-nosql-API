import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { validateRol, verifyToken } from "../middlewares/auth.middleware.js";
import { SubCategoryservice } from "../services/subCategory.service.js";

export class SubCategoryRoute {
  #router;
  #service;
  constructor() {
    this.#router = Router();
    this.#service = new SubCategoryservice();
    this.#routes();
  }

  #routes() {
    this.router.get("/", verifyToken, async (req = request, res = response) => {
      const response = await this.#service.getSubCategories();
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "List subcategories",
            response.data
          )
        : errorResponse(res, response.error);
    });

    this.router.get(
      "/admin",
      [verifyToken, validateRol(3)],
      async (req = request, res = response) => {
        const response = await this.#service.getSubCategories(true);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "List subcategories",
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
        const response = await this.#service.updateSubCategory(name, id);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "The subcategory has been updated",
              response.subcategory
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
              "The subcategory has been updated",
              response.subcategory
            )
          : errorResponse(res, response.error);
      }
    );

    this.router.post(
      "/",
      [verifyToken, validateRol(2, 3)],
      async (req = request, res = response) => {
        const { name } = req.body;
        const response = await this.#service.createSubCategory(name);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "The subcategory has been created",
              response.subcategory
            )
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
