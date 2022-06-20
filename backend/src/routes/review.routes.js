import { Router } from "express";
import { errorResponse, successfulResponse } from "../helpers/responses.helper.js";
import ReviewService from "../services/review.service.js";
import { verifyToken, validateRol } from "../middlewares/auth.middleware.js";


export class ReviewRoute {
    #router;
    #services;
    constructor() {
        this.#router = Router();
        this.#services = new ReviewService();
        this.#routes();
    }

    #routes() {
        this.#router.get("/reviewsOfProduct/:productId", [verifyToken],async (req, res) => {
            const { productId } = req.params;
            const response = await this.#services.getReviewsByProductId(productId);
            response.success
            ?
            response.reviews.length > 0 ? successfulResponse(res, 200, true, "Reviews of product", response.reviews) : successfulResponse(res, 200, false, "This product has no reviews", response.reviews)
            :
            errorResponse(res, response.error);
        });

        this.#router.get("/reviewsOfUser/:userId", [verifyToken, validateRol(1, 3)], async (req, res) => {
            const { userId } = req.params;
            const response = await this.#services.getReviewsByUserId(userId);
            response.success
            ?
            response.reviews.length > 0 ? successfulResponse(res, 200, true, "Reviews of user", response.reviews) : successfulResponse(res, 200, true, "You don´t have any comments yet", response.reviews)
            :
            errorResponse(res, response.error);
        });

        this.#router.get("/:id",[verifyToken], async (req, res) => {
            const response = await this.#services.getReviewById(req.params.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Review was successfully retrieved", response.review)
            :
            errorResponse(res, response.error);
        });


        this.#router.post("/", [verifyToken, validateRol(1, 3)], async (req, res) => {
            req.body.userID = req.payload.id;
            const response = await this.#services.createReview(req.body);
            response.success
            ?
            successfulResponse(res, 201, true, "Review was successfully created", response.review)
            :
            errorResponse(res, response.error);
        });

        this.#router.put("/:id", [verifyToken, validateRol(1, 3)], async (req, res) => {
            const { stars, title, comment } = req.body;
            const response = await this.#services.updateReview(req.params.id, stars, title, comment, req.payload.id);
            response.success
            ?
            successfulResponse(res, 200, true, "Review was successfully updated", response.review)
            :
            errorResponse(res, response.error);
        });

        this.#router.delete("/delete_review/:id", [verifyToken, validateRol(1, 3)], async (req, res) => {
            const response = await this.#services.deleteReview(req.params.id,req.payload.id, req.payload.role);
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