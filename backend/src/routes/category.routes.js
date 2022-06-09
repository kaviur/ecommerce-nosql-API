import { request, response, Router } from "express";
import { errorResponse, successfulResponse } from "../helpers/responses.helper.js";
import CategoryService from "../services/category.service.js";
import { verifyToken, validateRol } from "../middlewares/auth.middleware.js";


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
            response.success
            ?
            successfulResponse(res, 200, true, "Categories were successfully retrieved", response.categories)
            :
            errorResponse(res, response.error);
        });

        this.#router.get("/:id", async (req, res) => {
            const response = await this.#services.getCategoryById(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Category was successfully retrieved", response.category)
            :
            errorResponse(res, response.error);
        });

        this.#router.post("/", [verifyToken, validateRol(2,3)], async (req, res) => {
            const response = await this.#services.createCategory(req.body);
            response.success
            ?
            successfulResponse(res, 201, true, "Category was successfully created", response.category)
            :
            errorResponse(res, response.error);
        });

        this.#router.put("/:id", [verifyToken, validateRol(2,3)], async (req, res) => {
            const { name } = req.body;
            const response = await this.#services.updateCategory(req.params.id, name);
            response.success
            ?
            successfulResponse(res, 200, true, "Category was successfully updated", response.category)
            :
            errorResponse(res, response.error);
        });

        this.#router.patch("/:idCategory/add_subcategory", [verifyToken, validateRol(2,3)], async (req, res) => {
            const subcategoryId = req.body.subcategoryId;
            const subcategoryExists = await this.#services.checkSubcategory(req.params.idCategory, subcategoryId);

            if (subcategoryExists.success) {
                const response = await this.#services.addSubcategory(req.params.idCategory, subcategoryId);
                response.success
                ?
                successfulResponse(res, 200, true, "Subcategory was successfully added", response.category)
                :
                errorResponse(res, response.error);
            } else {
                return errorResponse(res, subcategoryExists.error);
            }
        });

        // Eliminar subcategoría de una categoría
        this.#router.patch("/:id/:subcategoryId", [verifyToken, validateRol(2,3)], async (req, res) => {

            const subcategoryExists = await this.#services.checkSubcategory(req.params.id, req.params.subcategoryId);

            if (subcategoryExists.success) {
                return errorResponse(res, subcategoryExists.message);
            }
            const response = await this.#services.removeSubcategory(req.params.id, req.params.subcategoryId);
            response.success
            ?
            successfulResponse(res, 200, true, "Subcategory was successfully removed", response.category)
            :
            errorResponse(res, response.error);
        });

        // Cambiar estado de la categoría
        this.#router.put("/change_status/:id", [verifyToken, validateRol(2,3)], async (req, res) => {
            const response = await this.#services.changeStatus(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Category status was successfully changed", response.categoryChanged)
            :
            errorResponse(res, response.error);
        })
    }

    get router() {
        return this.#router;
    }
}
