import mongoose, { Schema } from "mongoose";

const productSchema= mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
       type:String,
       required:true
    },
    price:{
        type:Number,
        required:true
    },
    inStock:{
        type:Boolean,
        default:true,
        
    },
    numberofItem:{
        type:Number,
        required:true,
    },
    
})
 const Product=mongoose.model("Product",productSchema)

export default Product