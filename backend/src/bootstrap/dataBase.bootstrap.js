import mongoose from "mongoose";

import { dbHost, dbName, dbPassword, dbUser } from "../config/config.js";

export class DataBase {
  #dbName;
  #dbHost;
  #dbUser;
  #dbPassword;
  #dbClient;

  constructor() {
    this.#dbName = dbName;
    this.#dbHost = dbHost;
    this.#dbUser = dbUser;
    this.#dbPassword = dbPassword;
    this.#dbClient = mongoose.connection;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        `mongodb+srv://${this.#dbUser}:${this.#dbPassword}@${this.#dbHost}/${
          this.#dbName
        }?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );
      this.#dbClient.on("error", (error) => {
        return reject(error);
      });
      this.#dbClient.on("open", () => {
        resolve(mongoose);
      });
    });
  }

  async closedatabase() {
    try {
      await this.#dbClient.close(true);
    } catch (error) {
      console.log(`${error}`.bgRed);
    }
  }
}
