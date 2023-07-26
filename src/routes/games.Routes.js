import { Router } from "express";
import {validateSchemas} from "../middlewares/validateSchema.js"

import {
  addGames/*,
  getGames,
  filterGames*/
} from "../controllers/gamesControllers.js";
import { addGameSchema } from "../schemas/gameSchemas.js";


const gamesRouter = Router();

gamesRouter.post("/games", validateSchemas(addGameSchema) ,addGames);
/*
gamesRouter.get("/games", getGames);
gamesRouter.get("/games/:type", filterGames)
*/

export default gamesRouter;
