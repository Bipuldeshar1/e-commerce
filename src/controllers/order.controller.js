import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/APiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const Orders=async(req, res) =>{
const productId= req.params.id;

if(!productId){
    throw new ApiError(400,"id required")
}
const product= await Product.findById(productId);


if(!product){
    throw new ApiError(400,"product not found")
}
const order= await Order.create({
   orderedProduct:product,orderBy:req.user._id
 })

 if(!order){
    throw new ApiError('order failed')
 }

 return res.status(200).json(
    new ApiResponse(200,{order},'successs placed order')
 )
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
        {
            $lookup: {
              from: 'products', // Assuming the name of the Product collection is 'products'
              localField: 'orderedProduct',
              foreignField: '_id',
              as: 'orderdProductDetails'
            }
          },
          {
            $unwind: {
              path: '$orderdProductDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: { 'orderdProductDetails.userId': req.user._id }
          }
    ]);

    return res.status(200).json(
      new ApiResponse(200, { orders }, 'Success')
    );
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return res.status(error.statusCode || 500).json(
      new ApiResponse(error.statusCode || 500, null, error.message || 'Internal Server Error')
    );
  }
};



  

export {Orders,getOrders}