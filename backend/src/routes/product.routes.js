import { Router } from "express";
import { errorResponse, successfulResponse } from "../helpers/responses.helper.js";
import ProductService from "../services/product.service.js";
import { verifyToken, validateRol } from "../middlewares/auth.middleware.js";


export class ProductRoute {
    #router;
    #services;
    constructor() {
        this.#router = Router();
        this.#services = new ProductService();
        this.#routes();
    }

    #routes() {
        this.#router.get("/", async (req, res) => {
            const response = await this.#services.getAllProducts();
            response.success
            ?
            successfulResponse(res, 200, true, "Products were successfully retrieved", response.products)
            :
            errorResponse(res, response.error);
        });

        this.#router.get("/:id", async (req, res) => {
            const response = await this.#services.getProductById(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Product was successfully retrieved", response.product)
            :
            errorResponse(res, response.error);
        });

        // se manda el id como parámetro a pesar de tenerlo en la request por si el admin quiere ver los productos de un vendedor
        this.#router.get("/by_seller/:sellerId", async (req, res) => {
            const response = await this.#services.getProductsBySeller(req.params.sellerId);
            response.success
            ?
            successfulResponse(res, 200, true, "Products were successfully retrieved", response.products)
            :
            errorResponse(res, response.error);
        });

        this.#router.post("/", [verifyToken, validateRol(2,3)], async (req, res) => {
            const response = await this.#services.createProduct(req.body);
            response.success
            ?
            successfulResponse(res, 201, true, "Product was successfully created", response.product)
            :
            errorResponse(res, response.error);
        });

        this.#router.post("/filters", async (req, res) => {
            const { name } = req.body;
            const response = await this.#services.getProductsByPriceRangeAndOtherFilters(name);
            response.success
            ?
            successfulResponse(res, 200, true, "Products were successfully retrieved", response.products)
            :
            errorResponse(res, response.error);
        });

        this.#router.post("/search", async (req, res) => {
            const response = await this.#services.getCoincidencesOfSearch(req.body);
            response.success
            ?
            successfulResponse(res, 200, true, "Products were successfully retrieved", response.products)
            :
            errorResponse(res, response.error);
        });

        //TODO: IMAGENES DE PRODUCTOS

        this.#router.put("/:id", async (req, res) => {//todo:excluir 
            const response = await this.#services.updateProduct(req.params.id,req.body);
            response.success
            ?
            successfulResponse(res, 200, true, "Product was successfully updated", response.product)
            :
            errorResponse(res, response.error);
        });
    
        this.#router.put("change_status/:id", [verifyToken, validateRol(2,3)], async (req, res) => {
            const response = await this.#services.changeStatus(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Product was successfully updated", response.product)
            :
            errorResponse(res, response.error);
        });

        this.#router.delete("/:id", [verifyToken, validateRol(2,3)], async (req, res) => {
            const response = await this.#services.deleteProduct(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Product was successfully deleted")
            :
            errorResponse(res, response.error);
        });
    }

    get router() {
        return this.#router;
    }
}





