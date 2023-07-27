import { Router } from "express";
import customersRouter from "./customers.Routes.js";
import gamesRouter from "./games.Routes.js";
import rentalsRouter from "./rentals.Routes.js";

const router = Router();

router.use(rentalsRouter)
router.use(customersRouter);
router.use(gamesRouter);

export default router;
