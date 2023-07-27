import { Router } from "express";
import {validateSchemas} from "../middlewares/validateSchema.js"
import { addRental, getRentals, returnRental, deleteRental } from "../controllers/rentalsControllers.js";
import { addRentalSchema } from "../schemas/rentalSchemas.js";


const rentalsRouter = Router();


rentalsRouter.post("/rentals", validateSchemas(addRentalSchema), addRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
