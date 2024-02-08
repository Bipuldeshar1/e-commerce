import mongoose from "mongoose";

const connectDB= async() =>{
    const DBName="e-commerce";
   const MONGODB_URL="mongodb+srv://t"
    try {

        const connection= await mongoose.connect(`${MONGODB_URL}/${DBName}`);

        console.log(`mongodb connected to ${connection.connection.host}`);
    } catch (error) {
        console.log(`connection failed ${error}`);
        process.exit(1);
    }
}

export{connectDB}
