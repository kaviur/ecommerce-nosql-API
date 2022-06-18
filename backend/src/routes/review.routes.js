import { Router } from "express";
import { errorResponse, successfulResponse } from "../helpers/responses.helper.js";
import ReviewService from "../services/review.service.js";


export class ReviewRoute {
    #router;
    #services;
    constructor() {
        this.#router = Router();
        this.#services = new ReviewService();
        this.#routes();
    }

    #routes() {
        this.#router.get("/:id", async (req, res) => {
            const response = await this.#services.getReviewById(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Review was successfully retrieved", response.review)
            :
            errorResponse(res, response.error);
        });


        this.#router.post("/", async (req, res) => {
            const response = await this.#services.createReview(req.body);
            response.success
            ?
            successfulResponse(res, 201, true, "Review was successfully created", response.review)
            :
            errorResponse(res, response.error);
        });

        this.#router.put("/:id", async (req, res) => {
            const { stars, title, comment } = req.body;
            const response = await this.#services.updateReview(req.params.id, stars, title, comment);
            response.success
            ?
            successfulResponse(res, 200, true, "Review was successfully updated", response.review)
            :
            errorResponse(res, response.error);
        });

        this.#router.delete("/:id", async (req, res) => {
            const response = await this.#services.deleteReview(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Review was successfully deleted")
            :
            errorResponse(res, response.error);
        });
    }

    get router() {
        return this.#router;
    }
}