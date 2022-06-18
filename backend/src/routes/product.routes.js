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
        priceRange,
        priceLessThan,
        category,
        subcategory,
        popular,
        size,
        color,
        brand,
      } = req.query;
      console.log(category);
      const response =
        await this.#services.getProductsByPriceRangeAndOtherFilters(
          name,
          priceRange,
          priceLessThan,
          category,
          subcategory,
          popular,
          size,
          color,
          brand
        );
      response.success
        ? response.products.length > 0
          ? successfulResponse(
              res,
              200,
              true,
              "Products were successfully retrieved",
              response.products
            )
          : successfulResponse(
              res,
              200,
              false,
              "No products were found with that requirement",
              response.products
            )
        : errorResponse(res, response.error);
    });

    this.#router.get("/", async (req, res) => {
      const response = await this.#services.getAllProducts();
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Products were successfully retrieved",
            response.products
          )
        : errorResponse(res, response.error);
    });

    this.#router.get("/search", async (req, res) => {
      const { termOfSearch } = req.query;
      console.log(termOfSearch);
      const response = await this.#services.getCoincidencesOfSearch(
        termOfSearch
      );
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Products were successfully retrieved",
            response.products
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
      const response = await this.#services.getProductsBySeller(
        req.params.sellerId
      );
      response.success
        ? successfulResponse(
            res,
            200,
            true,
            "Products were successfully retrieved",
            response.products
          )
        : errorResponse(res, response.error);
    });

    this.#router.post(
      "/",
      [verifyToken, validateRol(2, 3),validateImages],
      async (req, res) => {
        const response = await this.#services.createProduct(req.body);
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
