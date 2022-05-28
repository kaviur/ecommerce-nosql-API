import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { validateRol, verifyToken } from "../middlewares/auth.middleware.js";

import UserService from "../services/user.service.js";

export class UserRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new UserService();
    this.#routes();
  }
  #routes() {
    this.#router.get(
      "/",
      [verifyToken, validateRol(1)],
      async (req = request, res = response) => {
        const { limit = 10, page = 1 } = req.query;
        const response = await this.#services.getUsers(limit, page);
        response.success
          ? successfulResponse(res, 200, true, "List users", response.data)
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
