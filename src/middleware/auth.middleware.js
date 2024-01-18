import  JWT  from "jsonwebtoken"
import ApiError from "../utils/APiError.js"
import User from "../models/user.model.js"

const verifyJwt= async(req, res, next) =>{
    try {
        const token= req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer", "").trim()
        
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
     if(error.name === "TokenExpiredError"){
        try {
            console.log('access token expired refreshing....');
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
              throw new ApiError(401, "No refresh token provided");
            }
            const decodedRefreshToken = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if (!decodedRefreshToken) {
                throw new ApiError(401, "Invalid refresh token");
              }
              const user = await User.findById(decodedRefreshToken?._id).select("-password -refreshToken");

              if (!user) {
                throw new ApiError(401, "Invalid refresh token user");
              }
               // Generate a new access token
        const newAccessToken = JWT.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, );

        // Set the new access token in the response header or cookie
        res.cookie("accessToken", newAccessToken, { httpOnly: true });

        // Update req.user with the refreshed user
        req.user = user;

        // Continue to the next middleware
        next();
      } catch (refreshError) {
        console.log(`Error refreshing token: ${refreshError}`);
        throw new ApiError(401, "Error refreshing token");
      }
              
        
         
     }
     else {
        console.log(`My error: ${error}`);
        throw new ApiError(401, error?.message);
      }
    }
}
export default verifyJwt