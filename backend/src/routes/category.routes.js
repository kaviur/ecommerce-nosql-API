import { request, response, Router } from "express";
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
            res.status(200).json(response);
        });

        this.#router.get("/id/:id", async (req, res) => {
            const response = await this.#services.getCategoryById(req.params.id);
            res.status(200).json(response);
        });

        this.#router.post("/", async (req, res) => {
            const response = await this.#services.createCategory(req.body);
            res.status(200).json(response);
        });

        this.#router.put("/:id", async (req, res) => {
            const response = await this.#services.updateCategory(req.params.id, req.body);
            res.status(200).json(response);
        });

        this.#router.put("/:id/add_subcategory", async (req, res) => {
            const response = await this.#services.addSubcategory(req.params.id, req.body.subcategoryId);
            res.status(200).json(response);
        });

        this.#router.put("/inactivate/:id", async (req, res) => {
            const response = await this.#services.inactivateCategory(req.params.id);
            res.status(200).json(response);
        });

        this.#router.put("/:id/remove_subcategory/:subcategoryId", async (req, res) => {
            const response = await this.#services.removeSubcategory(req.params.id, req.params.subcategoryId);
            res.status(200).json(response);
        });

        //activar categoría
        this.#router.put("/activate/:id", async (req, res) => {
            const response = await this.#services.activateCategory(req.params.id);
            res.status(200).json(response);
        });

        //cambiar estado de la categoría
        this.#router.put("/change_status/:id", async (req, res) => {
            const response = await this.#services.changeStatus(req.params.id);
            res.status(200).json(response);
        })
    }

    get router() {
        return this.#router;
    }
}
