import {  Router } from "express";
import {  validateSchemas} from "../middlewares/validateSchema.js"
import { addURL } from "../controllers/urlsControllers.js";
import { addLinkSchema } from "../schemas/urlSchemas.js";

const linksRouter = Router();

linksRouter.post('/urls/shorten', validateSchemas(addLinkSchema), addURL)

export default linksRouter;
