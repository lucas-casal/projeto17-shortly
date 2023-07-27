import { Router } from "express";
import { addCustomerSchema } from "../schemas/customerSchemas.js";
import { addCustomer, getAllCustomers, getCustomer, putCustomer } from "../controllers/customersControllers.js";
import { validateSchemas } from "../middlewares/validateSchema.js";

/*
import { myCart, login, signUp, userInfo, newSelectedProducts, purchaseConfirmed, removeOneItem } from "../controllers/userControllers.js";
import { loginSchema, selectedProductsSchema, signUpSchema } from "../schemas/userSchemas.js";
import { validateAuth } from "../middlewares/validateAuth.js";
*/

const customersRouter = Router()

customersRouter.post('/customers', validateSchemas(addCustomerSchema), addCustomer)
customersRouter.get('/customers/:id', getCustomer)
customersRouter.put('/customers/:id', validateSchemas(addCustomerSchema), putCustomer)
customersRouter.get('/customers', getAllCustomers)


/*
userRouter.post('/', validateSchemas(loginSchema), login)
userRouter.get('/meu-carrinho', validateAuth, myCart)
userRouter.post('/meu-carrinho', validateAuth, newSelectedProducts)
userRouter.patch('/meu-carrinho', validateAuth, removeOneItem)
userRouter.post('/comprador', validateAuth, purchaseConfirmed)
*/

export default customersRouter