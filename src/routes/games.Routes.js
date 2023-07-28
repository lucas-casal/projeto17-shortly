import {  Router } from "express";
import {  validateSchemas} from "../middlewares/validateSchema.js"
import {  addGames, getGames } from "../controllers/gamesControllers.js";
import {  addGameSchema } from "../schemas/gameSchemas.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateSchemas(addGameSchema) ,addGames);
gamesRouter.get("/games", getGames);

export default gamesRouter;
