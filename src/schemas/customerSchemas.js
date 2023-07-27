import Joi from "joi";

export const addCustomerSchema = Joi.object({
    name:Joi.string().required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf:Joi.string().min(11).max(11).required(),
    birthday:Joi.date().required()
})


export const selectedProductsSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0.01).required(),
    image: Joi.string().required()
})