/**
 * Rutas para la actualización y eliminación de usuarios.
 * 
 * Define las rutas que permiten actualizar y eliminar usuarios mediante el uso de los métodos HTTP `PUT` y `DELETE`,
 * respectivamente. Estas rutas se protegen mediante validadores que aseguran que los datos enviados sean correctos antes de 
 * proceder con la ejecución de la lógica de actualización o eliminación.
 */

import { Router } from "express";
import { updateUser, deleteUser }  from "./user.controller.js"
import {  updateUserValidator, deleteUserByIdValidator } from "../middlewares/validators.js";

const router = Router()

router.put("/updateUser/:uid", updateUserValidator, updateUser)

router.delete("/deleteUser/:uid", deleteUserByIdValidator, deleteUser)


export default router