import { Router } from "express";
import { addCustomerSchema } from "../schemas/customerSchemas.js";
import { addCustomer, getAllCustomers, getCustomer, putCustomer } from "../controllers/customersControllers.js";
import { validateSchemas } from "../middlewares/validateSchema.js";

const customersRouter = Router()

customersRouter.post('/customers', validateSchemas(addCustomerSchema), addCustomer)
customersRouter.get('/customers/:id', getCustomer)
customersRouter.put('/customers/:id', validateSchemas(addCustomerSchema), putCustomer)
customersRouter.get('/customers', getAllCustomers)


export default customersRouter