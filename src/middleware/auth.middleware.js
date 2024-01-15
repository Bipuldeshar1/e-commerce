import  JWT  from "jsonwebtoken"
import ApiError from "../utils/APiError.js"
import User from "../models/user.model.js"

const verifyJwt= async(req, res, next) =>{
    try {
        const token= req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer", "").trim()
        console.log(token);
if(!token){
    throw new ApiError(401, "unauthorized requests")
}

const decodedToken= JWT.verify(token,process.env.ACCESS_TOKEN_SECRET)

const user= await User.findById(decodedToken?._id).select("-password -refreshToken")

if(!user){
    throw new ApiError(401,"Invalid acceess token user")
}
req.user=user
next()
    } catch (error) {
        console.log(`my err ${error}`);
        // throw new ApiError(400,error?.message)
    }
}
export default verifyJwt