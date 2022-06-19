import { Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import ProductService from "../services/product.service.js";
import { verifyToken, validateRol } from "../middlewares/auth.middleware.js";
import { validateImages } from "../middlewares/validations.middleware.js";

export class ProductRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new ProductService();
    this.#routes();
  }

  #routes() {
    this.#router.get("/filters", async (req, res) => {
      const {
        name,
        priceHigherThan,
        priceLessThan,
        category,
        subcategory,
        popular,
        size,
        color,
        brand,
        limit = 10,
        page = 1,
      } = req.query;
      console.log(category);
      const response =
        await this.#services.getProductsByPriceRangeAndOtherFilters(
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
        );
      response.success
        ? response.data.products.length > 0
          ? successfulResponse(
              res,
              200,
              true,
              "Products were successfully retrieved",
              response.data
            )
          : successfulResponse(
              res,
              200,
              false,
              "No products were found with that requirement",
              response.data
            )
        : errorResponse(res, response.error);
    });

    this.#router.get("/", async (req, res) => {
      const { limit = 10, page = 1 } = req.query;
      const response = await this.#services.getAllProducts(limit, page);
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Products were successfully retrieved",
            response.data
          )
        : errorResponse(res, response.error);
    });

    this.#router.get("/search", async (req, res) => {
      const { termOfSearch, page = 1, limit = 10 } = req.query;

      const response = await this.#services.getCoincidencesOfSearch(
        termOfSearch,
        page,
        limit
      );
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Products were successfully retrieved",
            response.data
          )
        : errorResponse(res, response.error);
    });

    this.#router.get("/:slug", async (req, res) => {
      const response = await this.#services.getProductBySlug(req.params.slug);
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Product was successfully retrieved",
            response.product
          )
        : errorResponse(res, response.error);
    });

    this.#router.get("/by_seller/:sellerId", async (req, res) => {
      const { page = 1, limit = 10 } = req.query;
      const response = await this.#services.getProductsBySeller(
        req.params.sellerId,
        page,
        limit
      );
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Products were successfully retrieved",
            response.data
          )
        : errorResponse(res, response.error);
    });

    this.#router.post(
      "/",
      [verifyToken, validateRol(2, 3), validateImages],
      async (req, res) => {
        const { files } = req;
        req.body.sellerId = req.payload.id;
        const response = await this.#services.createProduct(req.body, files);
        response.success
          ? successfulResponse(
              res,
              201,
              true,
              "Product was successfully created",
              response.product
            )
          : errorResponse(res, response.error);
      }
    );

    //búsqueda excluyente

    this.#router.delete(
      "/:id",
      [verifyToken, validateRol(2, 3)],
      async (req, res) => {
        const response = await this.#services.deleteProduct(req.params.id);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "Product was successfully deleted"
            )
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
