/**
 * authRoutes tiene las rutas de autenticación para registro e inicio de sesión de usuarios.
 * Este archivo define las rutas relacionadas con la autenticación de usuarios.
 */

import { Router } from "express"
import { register, login} from "./auth.controller.js"
import { registerValidator, loginValidator,} from "../middlewares/validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()

router.post(
    "/register",
    uploadProfilePicture.single("profilePicture"), 
    registerValidator, 
    deleteFileOnError,
    register
)

router.post(
    "/login",
    loginValidator,
    deleteFileOnError,
    login
)

export default router