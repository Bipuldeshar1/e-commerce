import express from "express"
import verifyJwt from "../middleware/auth.middleware.js";
import { addProduct, deleteProduct, getAllProduct, getByID, getUSerProduct, updateProduct } from "../controllers/product.controller.js";

const routerProduct=express.Router();

routerProduct.use(verifyJwt);

routerProduct.route("/add").post(addProduct)

routerProduct.route("/get").get(getAllProduct)

routerProduct.route("/getUserProduct").get(getUSerProduct)

routerProduct.route("/getByID/:id").get(getByID)
routerProduct.route("/update/:id").patch(updateProduct)
routerProduct.route("/delete/:id").delete(deleteProduct)

export{routerProduct}