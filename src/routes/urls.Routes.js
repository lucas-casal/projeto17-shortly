import {  Router } from "express";
import {  validateSchemas} from "../middlewares/validateSchema.js"
import { addURL, deleteURL, getURL, openURL, ranking, nickURL } from "../controllers/urlsControllers.js";
import { addLinkSchema } from "../schemas/urlSchemas.js";

const linksRouter = Router();

linksRouter.post('/urls/shorten', validateSchemas(addLinkSchema), addURL)
linksRouter.get('/urls/:id', getURL)
linksRouter.get('/urls/open/:shortUrl', openURL)
linksRouter.get('/ranking', ranking)
linksRouter.delete('/urls/:id', deleteURL)
linksRouter.patch('/urls/:id', nickURL)

export default linksRouter;
