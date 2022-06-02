import { request, response, Router } from "express";
import {
  errorResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { validateRol, verifyToken } from "../middlewares/auth.middleware.js";
import { validateExtensionImages } from "../middlewares/validations.middleware.js";

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
      [verifyToken, validateRol(3)],
      async (req = request, res = response) => {
        const { limit = 10, page = 1 } = req.query;
        const response = await this.#services.getUsers(limit, page);
        response.success
          ? successfulResponse(res, 200, true, "List users", response.data)
          : errorResponse(res, response.error);
      }
    );

    this.#router.put(
      "/:id",
      [verifyToken,validateExtensionImages],
      async (req = request, res = response) => {
        const { id } = req.params;
        const { files } = req;
        const response = await this.#services.updateUser(req.body, id, files);
        response.success
          ? successfulResponse(
              res,
              200,
              true,
              "User updated successfully",
              response.user
            )
          : errorResponse(res, response.error);
      }
    );
  }

  get router() {
    return this.#router;
  }
}
