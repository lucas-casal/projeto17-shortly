import { Router } from "express";
import customersRouter from "./customers.Routes.js";
import gamesRouter from "./games.Routes.js";

const router = Router();

router.use(customersRouter);
router.use(gamesRouter);

export default router;
