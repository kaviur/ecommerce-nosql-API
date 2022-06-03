import express from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser  from 'cookie-parser';
// importaciones locales
import { endPoints } from "../config/endPoints.js";
import { port } from "../config/config.js";
import { authRoute, userRoute, categoryRoute } from "../routes/index.js";
import session from "express-session";
import passport from "passport";

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
    this.#app.use(cors({ origin: "*" }));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(morgan("dev"));
    this.#app.use(cookieParser ())
    this.#app.use(passport.initialize());
    this.#app.use(session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    }));
  }

  #routes() {
    //Aca van todas las rutas
    this.#app.use(this.#paths.user, userRoute);
    this.#app.use(this.#paths.auth, authRoute);
    this.#app.use(this.#paths.category, categoryRoute);
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
