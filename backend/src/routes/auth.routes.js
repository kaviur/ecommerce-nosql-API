import { request, response, Router } from "express";
import {
  authResponse,
  errorResponse,
  logoutResponse,
  socialErrorResponse,
} from "../helpers/responses.helper.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateExtensionImages } from "../middlewares/validations.middleware.js";
import { AuthService } from "../services/auth.service.js";
import passport from "passport";
import { useGoogleStrategy, useFacebookStrategy, useGitHubStrategy, useTwitterStrategy } from "../middlewares/authProvider.middleware.js";
import { validateRol, verifyToken } from "../middlewares/auth.middleware.js";

export class AuhtRoute {
  #router;
  #services;
  constructor() {
    this.#router = Router();
    this.#services = new AuthService();
    this.#routes();
    passport.use(useGoogleStrategy());
    passport.use(useFacebookStrategy());
    passport.use(useGitHubStrategy());
    passport.use(useTwitterStrategy());
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
  

  #routes() {

    this.#router.get('/google', passport.authenticate("google", {
      scope: ["email", "profile"],
    }));

    this.#router.get("/google/callback", passport.authenticate("google", {
      session: false,
    }), async (req, res) => {
      const user = req.user.profile;
      console.log(user)
      const response = await this.#services.socialLogin(user);
      response.success
      ?authResponse(res,200,true,"Successful login with google",response.user)
      :socialErrorResponse(res,response.error);
    });

    this.#router.get("/facebook", passport.authenticate("facebook"));

    this.#router.get("/facebook/callback", passport.authenticate("facebook", {
      session: false,
    }), async (req, res) => {
      const user = req.user.profile;
      console.log(user)
      const response = await this.#services.socialLogin(user);
      response.success
      ?authResponse(res,200,true,"Successful login with facebook",response.user)
      :socialErrorResponse(res,response.error);
    });

    this.#router.get("/github", passport.authenticate("github"));

    this.#router.get("/github/callback", passport.authenticate("github", {
      session: false,
    }), async (req, res) => {
      const user = req.user.profile;
      console.log(user)
      const response = await this.#services.socialLogin(user);
      response.success
      ?authResponse(res,200,true,"Successful login with github",response.user)
      :socialErrorResponse(res,response.error);
    });

    this.#router.get("/twitter", passport.authenticate("twitter"));

    this.#router.get("/twitter/callback", passport.authenticate("twitter", {
      //session: false,
      // failureRedirect: "/",
      // failureMessage: "Failed to authenticate",
    }), async (req, res) => {
      const user = req.user.profile;
      console.log(user)
      const response = await this.#services.socialLogin(user);
      response.success
      ?authResponse(res,200,true,"Successful login with twitter",response.user)
      :socialErrorResponse(res,response.error);
    });

    this.#router.get("/validate",verifyToken,(req,res)=>{
      return res.json({
          success:true,
          payload:req.payload
      })
    })
  
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

    this.#router.get(
      "/session",
      verifyToken,
      (req = request, res = response) => {
        const {iat,exp, ...payload } = req.payload;

        return res
          .status(200)
          .json({
            ok: true,
            message: "Successful session recovery",
            ...payload,
          });
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
