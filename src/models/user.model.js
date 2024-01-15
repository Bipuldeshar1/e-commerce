import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    userName:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    contact:{
        type: Number,
        required:true
    },
    profilepic:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    }
},
{timestamps:true}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10);
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
    return JWT.sign({
        _id:this._id,
  
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken =function(){
    return JWT.sign({
        _id:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
const User=mongoose.model("User",userSchema)
export default User

