import ApiError from "../utils/APiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js"
import  uploadOnCloudinary  from "../utils/cloudinary.js";
import bcrypt from "bcrypt"

const generateAccessAndRefreshToken= async(userId) =>{
    try {
        const user= await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(400,'sth went wrong while generating refresh and access token')
    }
}

const registerUser=async(req,res)=> {
    const{
        userName,email,password,contact
    }=req.body;

    if(!userName ||!email ||!password ||!contact){
        throw new ApiError(400,"all field required")
    }
    
    const existedUser= await User.findOne({email})
    if(existedUser){
        throw new ApiError(400,"user already exist")
    }

    const profilepicLocalPath= req.files?.profilepic[0]?.path

    if(!profilepicLocalPath){
        throw new ApiError(400,"profile pic needed")
    }

    const profilepic=await uploadOnCloudinary(profilepicLocalPath);

    if(!profilepic){
        throw new ApiError(400,"profile file needed")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user=await User.create({
        userName,email,password:hashedPassword,contact,profilepic:profilepic.url,
    })

    const createdUser= await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"sth went wrong while user reg")
    }

    return res.status(200).json(
        new ApiResponse(200,createdUser,"user created successfully")
      
    )

}

const loginUser= async(req, res) => {

    const {email, password}= req.body;
    if(!email || !password){
        throw new ApiError(400,"all field mandatory email psw")
    }
    const user= await User.findOne({email})
    if(!user){
        throw new ApiError(400,"user doesnot exist")
    }

    const isPasswordValid= user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(400,"password invalid")
    }

    const{accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id)
    
    const loggedInUSer= await User.findById(user._id).select("-password -refreshToken")
    const options ={
        httpOnly: true,
        secure:true,
     }

     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{
        user:loggedInUSer,accessToken,refreshToken
     },
     "user logged in success"
     ))


    
}

const logoutUser= async(req, res) =>{
  const user=  await User.findByIdAndUpdate(req.user._id,
        {
            $unset:{
                refreshToken:1
            },

        },
        {
            new:true
        }
        )
        const options ={
            httpOnly: true,
            secure:true,
         }
         return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{user},"user loggout success"))
}

const getCurrentUser= async(req,res) =>{
  
    const user= await User.findById(req.user._id)
    if(!user){
        throw new ApiError(400,"unable to fetch user")
    }
    return res.status(200).json(
        new ApiResponse(200,{user},"fetchec user success")
    )
}


export{registerUser,loginUser,logoutUser,getCurrentUser}