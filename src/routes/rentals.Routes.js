import { Router } from "express";
import {validateSchemas} from "../middlewares/validateSchema.js"
import { addRental } from "../controllers/rentalsControllers.js";
import { addRentalSchema } from "../schemas/rentalSchemas.js";


const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchemas(addRentalSchema), addRental);

export default rentalsRouter;
