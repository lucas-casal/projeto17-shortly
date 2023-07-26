import { Router } from "express";
import userRouter from "./users.Routes.js";
import gamesRouter from "./games.Routes.js";

const router = Router();

router.use(userRouter);
router.use(gamesRouter);

export default router;
