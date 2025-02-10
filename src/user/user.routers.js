import { Router } from "express";
import { updateUser, deleteUser }  from "./user.controller.js"
import {  updateUserValidator, deleteUserByIdValidator } from "../middlewares/validators.js";

const router = Router()

router.put("/updateUser/:uid", updateUserValidator, updateUser)

router.delete("/deleteUser/:uid", deleteUserByIdValidator, deleteUser)


export default router