import Joi from "joi";

export const addLinkSchema = Joi.object({
    url: Joi.string().uri().required()
})
