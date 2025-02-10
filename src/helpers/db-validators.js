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