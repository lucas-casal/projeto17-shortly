import Joi from "joi";

export const addCustomerSchema = Joi.object({
    name:Joi.string().required(),
    phone: Joi.number().integer().min(1000000000).max(99999999999).required(),
    cpf:Joi.number().integer().min(10000000000).max(99999999999).required(),
    birthday:Joi.date().required()
})
