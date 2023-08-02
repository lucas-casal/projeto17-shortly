import { Router } from "express";
import { validateSchemas } from "../middlewares/validateSchema.js";
import { addUser, login } from "../controllers/usersControllers.js";
import { LoginSchema, addUserSchema } from "../schemas/userSchemas.js";

const usersRouter = Router()
usersRouter.post('/signup', validateSchemas(addUserSchema), addUser)
usersRouter.post('/signin', validateSchemas(LoginSchema), login)

export default usersRouter