/**
 * Este archivo contiene varias funciones que verifican la existencia de un correo electrónico, 
 * nombre de usuario, ID de usuario o ID de curso en la base de datos. Si algún dato ya está registrado 
 * o no se encuentra en la base de datos, la función lanza un error con un mensaje correspondiente.
 * Estas funciones utilizan los modelos de Mongoose para interactuar con la base de datos y asegurar 
 * que los datos sean únicos o válidos antes de realizar ciertas acciones.
 */

import User from "../user/user.model.js"
import Course from "../courses/courses.model.js"


export const emmailExist = async(email = "") =>{
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}
 
export const usernameExist = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The user ${username} is already registered`)
    }
}

export const userExists = async (uid =" ") =>{
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el ID del usario proporcionado")
    }
}

export const courseExists = async (uid =" ") =>{
    const existe = await Course.findById(uid)
    if(!existe){
        throw new Error("No existe el ID del curso proporcionado")
    }
}