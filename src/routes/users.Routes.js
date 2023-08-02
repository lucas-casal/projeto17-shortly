import { Router } from "express";
import { validateSchemas } from "../middlewares/validateSchema.js";
import { addUser, getUsers, login } from "../controllers/usersControllers.js";
import { LoginSchema, addUserSchema } from "../schemas/userSchemas.js";

/*import { addCustomerSchema } from "../schemas/customerSchemas.js";

*/const usersRouter = Router()
usersRouter.post('/signup', validateSchemas(addUserSchema), addUser)
usersRouter.get('/users', getUsers)
usersRouter.post('/', validateSchemas(LoginSchema), login)

/*
usersRouter.get('/users/:id', getuser)
usersRouter.put('/users/:id', validateSchemas(adduserSchema), putuser)
usersRouter.get('/users', getAllusers)

*/
export default usersRouter