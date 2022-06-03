import express from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import swaggerUi  from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path';
// importaciones locales
import { endPoints } from "../config/endPoints.js";
import { port } from "../config/config.js";
import { authRoute, userRoute, categoryRoute, subCategoryRoute } from "../routes/index.js";
import session from "express-session";
import passport from "passport";
const __dirname = path.resolve();
//const swaggerDocument = YAML.load(`${__dirname}\\swagger.yaml`)

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
    this.#app.use(cookieParser())
    this.#app.use(passport.initialize());
    this.#app.use(session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    }));
    this.#app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp/",
        createParentPath: true,
      })
    );
    this.#app.use(`/public/user`,express.static(`src/storage/users/`))
  }

  #routes() {
    //Aca van todas las rutas
    this.#app.use(this.#paths.user, userRoute);
    this.#app.use(this.#paths.auth, authRoute);
    this.#app.use(this.#paths.category, categoryRoute);
    this.#app.use(this.#paths.subCategory, subCategoryRoute)
    //this.#app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
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
