import { request, response, Router } from "express";
import passport from "passport";

import {
  authResponse,
  errorResponse,
  logoutResponse,
  successfulResponse,
} from "../helpers/responses.helper.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateExtensionImages } from "../middlewares/validations.middleware.js";
import { AuthService } from "../services/auth.service.js";

const services = new AuthService();

export class AuhtRoute {
  #router;
  constructor() {
    this.#router = Router();
    this.#routes();
  }

  #routes() {
    this.#router.get("/socialLogin", (req = request, res = response) => {
      return res.status(200).json({
        ok: true,
        message: "Successful login",
      });
    });

    this.#router.get(
      "/email_validation/:token",
      async (req = request, res = response) => {
        const { token } = req.params;
        const response = await services.validateEmail(token);
        response.success
          ? authResponse(res, 200, true, "User logged", response.user)
          : errorResponse(res, response.error);
      }
    );

    this.#router.post("/login", async (req = request, res = response) => {
      const response = await services.login(req.body);
      response.success
        ? authResponse(res, 200, true, "Successful login", response.user)
        : errorResponse(res, response.error, response.status);
    });

    this.#router.post(
      "/signup",
      validateExtensionImages,
      async (req = request, res = response) => {
        const { files } = req;
        const response = await services.signup(req.body, files);
        response.success
          ? successfulResponse(
              res,
              201,
              true,
              "The user has been created",
              response.user
            )
          : errorResponse(res, response.error);
      }
    );

    this.#router.get(
      "/session",
      verifyToken,
      (req = request, res = response) => {
        const { iat, exp, ...payload } = req.payload;

        return res.status(200).json({
          ok: true,
          message: "Successful session recovery",
          ...payload,
        });
      }
    );

    this.#router.post("/logout", async (req = request, res = response) => {
      logoutResponse(res);
    });

    this.#router.get(
      "/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    this.#router.get(
      "/google/login",
      passport.authenticate("google", { session: false }),
      this.#socialresponse
    );

    this.#router.get(
      "/facebook",
      passport.authenticate("facebook", { scope: ["email"] })
    );

    this.#router.get(
      "/facebook/login",
      passport.authenticate("facebook", { session: false }),
      this.#socialresponse
    );

    this.#router.get("/twitter", passport.authenticate("twitter"));

    this.#router.get(
      "/twitter/login",
      passport.authenticate("twitter", { scope: ["user:email"] }),
      this.#socialresponse
    );

    this.#router.get("/github", passport.authenticate("github"));

    this.#router.get(
      "/github/login",
      passport.authenticate("github", { scope: ["user:email"] }),
      this.#socialresponse
    );

    this.#router.get(
      "/instagram",
      passport.authenticate("instagram", { scope: ["email"] })
    );

    this.#router.get(
      "/instagram/login",
      passport.authenticate("instagram", { session: false }),
      this.#socialresponse
    );
  }

  async #socialresponse(req = request, res = response) {
    const { profile } = req.user;
    const service = new AuthService();
    const response = await service.socialLogin(profile);
    response.success
      ? authResponse(res, 200, true, "Successful login", response.user, true)
      : errorResponse(res, response.error);
  }

  get router() {
    return this.#router;
  }
}
