/**
 * Validador de datos para solicitudes de registro, inicio de sesión, actualización y eliminación de usuarios,
 * y la creación de cursos. Utiliza `express-validator` para validar y verificar la integridad de los datos
 * antes de proceder con las operaciones en la base de datos.
 *
 * Además, cada validador se asegura de que los campos sean válidos antes de pasar al siguiente middleware.
 * Si los datos no son válidos, los errores se devuelven al cliente con mensajes.
 */

import { body, check, param } from "express-validator";
import { emmailExist, usernameExist, userExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validar-campos.js"
import { deleteFileOnError } from "./delete-file-on-error.js";

export const registerValidator = [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("username").not().isEmpty().withMessage("User is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Email is envalide"),
    body("password").not().isEmpty().withMessage("Password is envalide"),
    body("email").custom(emmailExist),
    body("username").custom(usernameExist),
   /*body("password").isStrongPassword({
        minLength: 8,

        })*/
        validarCampos
]

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("username").optional().isString().withMessage("Invalid username"),
    body("password").isLength({min: 8}).withMessage("El password debe contener al menos 8 caracteres"),
    validarCampos
]

export const getUserByIdValidator = [
    check("uid").isMongoId().withMessage("No es un ID valido"), 
    check("uid").custom(userExists),
    validarCampos,
    deleteFileOnError

]

export const updateUserValidator = [
    param("uid", "No es un ID válido").isMongoId(),
    param("uid").custom(userExists),
    validarCampos,
]

export const deleteUserByIdValidator = [
    check("uid").isMongoId().withMessage("No es un ID valido"), 
    check("uid").custom(userExists),
    validarCampos,
    deleteFileOnError
]



export const createCourseValidator = [
    body("nameCourse").not().isEmpty().withMessage("El nombre del curso es obligatorio"),
    body("description").optional().isLength({ max: 250 }).withMessage("La descripción no puede superar los 250 caracteres"),
    body("duration").not().isEmpty().withMessage("La duracion no puede pasar mas de 25 caracteres"),
    body("teacher").not().isEmpty().withMessage("El profesor es obligatorio"),
    validarCampos
]