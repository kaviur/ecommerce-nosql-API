import express from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import passport from "passport";
import session from "express-session";

// importaciones locales
import { endPoints } from "../config/endPoints.js";
import {
  isProductionEnvironment,
  port,
  sessionSecret,
} from "../config/config.js";
import { authRoute, cartRoute, subCategoryRoute, userRoute } from "../routes/index.js";
import {
  facebookStrategy,
  githubStrategy,
  googleStrategy,
  instagramStrategy,
  twitterStrategy,
} from "../middlewares/authProvider.middleware.js";
const __dirname = path.resolve();
const swaggerDocument = YAML.load(`${__dirname}\\swagger.yaml`);

export class Server {
  #port;
  #app;
  #paths;

  constructor() {
    this.#app = express();
    this.#port = port;
    this.#paths = endPoints;
    this.#middleware();
    this.#routes();
  }

  #middleware() {
    this.#app.use(
      cors({ origin: ["http://localhost:8081"], credentials: true })
    );
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(morgan("dev"));
    this.#app.use(cookieParser());
    this.#app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp/",
        createParentPath: true,
      })
    );
    this.#app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: isProductionEnvironment },
      })
    );
    this.#app.use(`/public/user`, express.static(`src/storage/users/`));
    this.#app.use(passport.initialize());
    this.#passportMiddleware();
  }

  #passportMiddleware() {
    passport.use(googleStrategy());
    passport.use(facebookStrategy());
    passport.use(twitterStrategy());
    passport.use(githubStrategy());
    passport.use(instagramStrategy());

    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  #routes() {
    //Aca van todas las rutas
    this.#app.use(this.#paths.user, userRoute);
    this.#app.use(this.#paths.auth, authRoute);
    this.#app.use(this.#paths.subCategory, subCategoryRoute);
    this.#app.use(this.#paths.cart, cartRoute);
    this.#app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  initServer() {
    return new Promise((resolve, reject) => {
      this.#app
        .listen(this.#port)
        .on("listening", () => {
          resolve(true);
          console.log(`Server init on PORT ${this.#port} \n`.bgGreen);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}
