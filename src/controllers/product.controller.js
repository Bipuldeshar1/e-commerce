import Product from "../models/product.model.js";
import ApiError from "../utils/APiError.js";
import ApiResponse from "../utils/ApiResponse.js";


const addProduct= async(req, res) =>{
    const{title,description,price,numberofItem}=req.body;
    
    if(!title || !description || !price || !numberofItem){
        throw new ApiError(400,"all field needed")
    }

  const product=  await Product.create({title,description,price,numberofItem,userId:req.user._id});
  
  const addedProduct= await Product.findById(product._id)
  
  if(!addedProduct){
    throw new ApiError('sth went wrong while adding product')
  }
  return res.status(200).json(
    new ApiResponse(200,{addedProduct},"added succesfully")
  )


    await Product.create()
}

const getAllProduct= async(req, res)=>{
  const products=  await Product.find();
   
  if(!products){
    throw new ApiError('operation failed')
  }

  return res.status(200).json(
    new ApiResponse(200,{products},"successfully fetched")
  )
}

const getUSerProduct=async(req, res) =>{
   

    const product= await Product.find({userId:req.user._id})

    return res.status(200).json(
        new ApiResponse(200,{product},"success")
    )


}

const getByID= async(req, res) =>{
    const product= await Product.findById(req.params.id)
    if(!product){
        new ApiError(400,"could not find")
    }

    return res.status(200).json(
        new ApiResponse(200,{product},'success')
    )
}

const updateProduct= async(req, res)=>{
    const{title, description, price,numberofItem}=req.body;
    if(!title||!description||!price||!numberofItem){
        throw new ApiError(400,"all fiedlds mandatory")
    }
    const product= await Product.findById(req.params.id);
    if(!product){
       throw new ApiError(400,"product not found")
    }
    
    if(req.user._id.toString() != product.userId.toString()){
       throw new ApiError(400,"user donot have operation privelage")
    }
    const productUpdated= await Product.findByIdAndUpdate(product._id,{title, description,price, numberofItem},{new:true})

    return res.status(200).json(new ApiResponse(200,{productUpdated},"success"))

}

const deleteProduct= async(req, res)=>{
    
 const product= await Product.findById(req.params.id);
 if(!product){
    throw new ApiError(400,"product not found")
 }
 
 if(req.user._id.toString() != product.userId.toString()){
    throw new ApiError(400,"donot have operation privelage")
 }
 const removedproduct= await Product.findByIdAndDelete(product._id)

 return res.status(200).json( new ApiResponse(200,{removedproduct},"success"))
}


export{ addProduct, getAllProduct,getUSerProduct,getByID, updateProduct, deleteProduct}