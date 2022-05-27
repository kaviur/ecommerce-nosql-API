import { Router } from "express";
import { authResponse, errorResponse } from "../helpers/responses.js";
import UserService from "../services/user.service.js";

export class UserRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#routes();
    this.#services = new UserService();
  }
  #routes() {
    this.#router.post("/", async (req, res) => {
      const response = await this.#services.postUser(req.body);
      response.success
        ? authResponse(res, 201, true, "The user has been created", response.data)
        : errorResponse(res, response.error);
    });
  }

  get router() {
    return this.#router;
  }
}
