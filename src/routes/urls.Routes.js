import {  Router } from "express";
import {  validateSchemas} from "../middlewares/validateSchema.js"
import { addURL, getURL, openURL, ranking } from "../controllers/urlsControllers.js";
import { addLinkSchema } from "../schemas/urlSchemas.js";

const linksRouter = Router();

linksRouter.post('/urls/shorten', validateSchemas(addLinkSchema), addURL)
linksRouter.get('/urls/:id', getURL)
linksRouter.get('/urls/open/:shortUrl', openURL)
linksRouter.get('/ranking', ranking)
export default linksRouter;
