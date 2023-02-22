import express, { Express } from "express";
import cors from "cors";
import { router } from "./router";

// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../swagger.json";

const app: Express = express();
const port = process.env.PORT || 3000;

async function main() {
  app.use(cors());

  app.options("*", cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api", await router());

  app.listen(port, (err?: Error) => {
    if (err) {
      throw new Error("Erreur lors de la création du serveur");
    }
    console.log("API OK");
  });
}
main();
