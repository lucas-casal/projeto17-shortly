import Joi from "joi";

export const addUserSchema = Joi.object({
    name:Joi.string().required(),
    email: Joi.string().email().required(),
    password:Joi.string().required(),
    confirmPassword: Joi.string().required()
})

export const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})