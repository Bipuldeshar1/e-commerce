import {v2 as cloudinary} from "cloudinary";

import fs from "fs";
cloudinary.config({
    cloud_name: 'drhjtsk1z', 
    api_key: '499592431714536',  
    api_secret: "6w3WO8T7wEnthLfuPU1iACQY1NM", 
})

const uploadOnCloudinary = async(localFilePath) =>{
    try {
       
        if(!localFilePath) return null;
        //upload to cloudinary
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
         fs.unlinkSync(localFilePath)
       
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
         fs.unlinkSync(localFilePath) //remove locallly saved temporary file as upload op get failed  
        return null;    
    }
}
export default uploadOnCloudinary