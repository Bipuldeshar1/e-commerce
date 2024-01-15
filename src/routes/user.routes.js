import express from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import verifyJwt from "../middleware/auth.middleware.js";

const router=express.Router();

    router.route("/register").post(
    upload.fields([
        {
            name:"profilepic",
            maxCount:1
        }
    ]), registerUser)

    router.route("/login").post(loginUser)

    router.route("/logout").post(verifyJwt,logoutUser)
    router.route("/current-user").get(verifyJwt,getCurrentUser)

export default router