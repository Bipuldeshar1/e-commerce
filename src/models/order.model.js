import mongoose, { Schema } from "mongoose";

const orderSchema= mongoose.Schema({
    orderedProduct: {
        type:Schema.Types.ObjectId,
        ref:"Product"
    },
    orderBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},
{timestamps:true}
)

const Order=mongoose.model("Order",orderSchema)
export default Order