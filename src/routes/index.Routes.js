import { Router } from "express";
import usersRouter from "./users.Routes.js";
import linksRouter from "./urls.Routes.js";
import rentalsRouter from "./rentals.Routes.js";

const router = Router();

router.use(rentalsRouter)
router.use(usersRouter);
router.use(linksRouter);

export default router;
