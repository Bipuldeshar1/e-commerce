import express from "express"
import verifyJwt from "../middleware/auth.middleware.js"
import { Orders, getOrders } from "../controllers/order.controller.js"

const OrderRouter= express.Router()

OrderRouter.use(verifyJwt)

OrderRouter.route("/addorder/:id").post(Orders)
OrderRouter.route("/get-userOrder").get(getOrders)

export default OrderRouter