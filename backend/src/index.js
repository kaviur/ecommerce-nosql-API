import { callbackUrl, environment } from "./config/config.js";
import "colors";
import { Server } from "./bootstrap/server.bootstrap.js";
import { DataBase } from "./bootstrap/dataBase.bootstrap.js";


const server = new Server();
const dataBase = new DataBase();

(async function initApp() {
  try {
    await server.initServer();
    const { connections } = await dataBase.initialize();
    console.log(`Connected to dataBase ${connections[0].name} \n`.bgBlue);
    console.log(
      `Application running in ${environment} environment`.bgMagenta
    );
  } catch (error) {
    await dataBase.closedatabase();
    console.log(`${error}`.bgRed);
  }
})();


console.log(callbackUrl);



