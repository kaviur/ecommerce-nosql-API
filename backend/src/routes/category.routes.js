import { request, response, Router } from "express";
import { errorResponse, successfulResponse } from "../helpers/responses.helper.js";
import CategoryService from "../services/category.service.js";


export class CategoryRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new CategoryService();
    this.#routes();
  }

    #routes() {
        this.#router.get("/", async (req, res) => {
            const response = await this.#services.getAllCategories();
            response.success?successfulResponse(res, 200, true, "Categories were successfully retrieved", response.categories):errorResponse(res, response.error);
        });

        this.#router.get("/:id", async (req, res) => {
            const response = await this.#services.getCategoryById(req.params.id);
            response.success?successfulResponse(res, 200, true, "Category was successfully retrieved", response.category):errorResponse(res, response.error);
        });

        this.#router.post("/", async (req, res) => {
            const response = await this.#services.createCategory(req.body);
            response.success?successfulResponse(res, 201, true, "Category was successfully created", response.category):errorResponse(res, response.error);
        });

        this.#router.put("/:id", async (req, res) => {
            const response = await this.#services.updateCategory(req.params.id, req.body);
            response.success?successfulResponse(res, 200, true, "Category was successfully updated", response.category):errorResponse(res, response.error);
        });

        this.#router.put("/:id/remove_subcategory/:subcategoryId", async (req, res) => {
            const response = await this.#services.removeSubcategory(req.params.id, req.params.subcategoryId);
            response.success?successfulResponse(res, 200, true, "Subcategory was successfully removed", response.category):errorResponse(res, response.error);
        });

        //cambiar estado de la categoría
        this.#router.put("/change_status/:id", async (req, res) => {
            const response = await this.#services.changeStatus(req.params.id);
            response.success?successfulResponse(res, 200, true, "Category status was successfully changed", response.categoryChanged):errorResponse(res, response.error);
        })
    }

    get router() {
        return this.#router;
    }
}
