import {  Router } from "express";
import {  validateSchemas} from "../middlewares/validateSchema.js"
import { addURL, deleteURL, getURL, openURL, ranking, nickURL } from "../controllers/urlsControllers.js";
import { addLinkSchema } from "../schemas/urlSchemas.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const linksRouter = Router();

linksRouter.post('/urls/shorten',validateAuth, validateSchemas(addLinkSchema), addURL)
linksRouter.get('/urls/:id', getURL)
linksRouter.get('/urls/open/:shortUrl', openURL)
linksRouter.get('/ranking', ranking)
linksRouter.delete('/urls/:id', validateAuth, deleteURL)
linksRouter.patch('/urls/:id', validateAuth, nickURL)

export default linksRouter;
