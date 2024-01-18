import  express  from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/db/connect.js";
import userRoute from "./src/routes/user.routes.js"
import cookieParser  from "cookie-parser";
import cors from "cors";
import { routerProduct } from "./src/routes/product.routes.js";
import OrderRouter from "./src/routes/order.routes.js";
const app=express();
dotenv.config({
    path: './.env'
});

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded());
app.use(express.static("public"))
app.use(cookieParser())


const PORT= process.env.PORT || 8000

connectDB().then(app.listen(PORT, () =>{
    console.log(`server runnning in port ${PORT}`);
}))
.catch((err) =>{
    console.log(`mongo db conn fail`,err);
})

app.use("/api/v1/user",userRoute)

app.use("/api/v1/product",routerProduct)

app.use('/api/v1/order',OrderRouter)
