import { Router } from "express";
import usersRouter from "./users.Routes.js";
import linksRouter from "./urls.Routes.js";

const router = Router();

router.use(usersRouter);
router.use(linksRouter);

export default router;
