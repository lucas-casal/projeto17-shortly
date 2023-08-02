import { Router } from "express";
import usersRouter from "./users.Routes.js";
import productsRouter from "./products.Routes.js";
import rentalsRouter from "./rentals.Routes.js";

const router = Router();

router.use(rentalsRouter)
router.use(usersRouter);
router.use(productsRouter);

export default router;
