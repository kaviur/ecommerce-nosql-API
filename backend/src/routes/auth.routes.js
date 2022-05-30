import { request, response, Router } from "express";
import {
  authResponse,
  errorResponse,
  logoutResponse,
} from "../helpers/responses.helper.js";
import { validateExtensionImages } from "../middlewares/validationsMiddleware.js";
import { AuthService } from "../services/auth.service.js";

export class AuhtRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new AuthService();
    this.#routes();
  }

  #routes() {
    this.#router.post("/login", async (req = request, res = response) => {
      const response = await this.#services.login(req.body);
      response.success
        ? authResponse(res, 200, true, "Successful login", response.user)
        : errorResponse(res, response.error, response.status);
    });

    this.#router.post(
      "/signup",
      validateExtensionImages,
      async (req = request, res = response) => {
        const { files } = req;
        const response = await this.#services.signup(req.body, files);
        response.success
          ? authResponse(
              res,
              201,
              true,
              "The user has been created",
              response.user
            )
          : errorResponse(res, response.error);
      }
    );

    this.#router.post("/logout", async (req = request, res = response) => {
      logoutResponse(res);
    });
  }

  get router() {
    return this.#router;
  }
}
