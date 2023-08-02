import {  Router } from "express";
import {  validateSchemas} from "../middlewares/validateSchema.js"
/*import {  addproducts, getproducts } from "../controllers/productsControllers.js";
import {  addproductschema } from "../schemas/productschemas.js";
*/
const productsRouter = Router();
/*
productsRouter.post("/products", validateSchemas(addproductschema) ,addproducts);
productsRouter.get("/products", getproducts);
*/
export default productsRouter;
