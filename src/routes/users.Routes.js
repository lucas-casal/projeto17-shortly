import { Router } from "express";
import { validateSchemas } from "../middlewares/validateSchema.js";
import { addUser, getUser, login } from "../controllers/usersControllers.js";
import { LoginSchema, addUserSchema } from "../schemas/userSchemas.js";

const usersRouter = Router()
usersRouter.post('/signup', validateSchemas(addUserSchema), addUser)
usersRouter.post('/signin', validateSchemas(LoginSchema), login)
usersRouter.get('/users/me', getUser)
export default usersRouter