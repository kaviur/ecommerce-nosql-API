import express from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";

import { endPoints } from "../config/endPoints.js";
import  { port } from "../config/config.js";
import { userRoute } from "../routes/index.js";


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

  }

  #routes() {
    //Aca van todas las rutas
    this.#app.use(this.#paths.user,userRoute)
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
