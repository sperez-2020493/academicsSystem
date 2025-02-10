import { hash } from "argon2";
import User from "./user.model.js"


export const getUserById = async (req, res) =>{
    try{
        const {uid} = req.params;
        const user = await User.findById(uid)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener el Usuario",
            error: err.message
        })

    }
}

export const getUsers = async (req, res) => {
    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }
        
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(limite)
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })

    }catch(err){
     return res.status(500).json({
        success: false,
        message:"Error al ontener los ususarios",
        error: err.message
     })   
    }
}

export const deleteUser = async(req, res) =>{
    try {
        const { uid } = req.params;
        
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (user.role !== "ALUMNO_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar este usuario"
            });
        }
        user.status = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        });
    }
}


export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const usuario = await User.findById(uid);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (usuario.role !== "ALUMNO_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para editar este usuario"
            });
        }

        const { name, surname,  username, email, phone } = req.body;

        if (name) usuario.name = name;
        if (surname) usuario.surname = surname;
        if (email) usuario.email = email;
        if (username) usuario.username = username;
        if (phone) usuario.phone = phone;

        await usuario.save();
        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: err.message
        });
    }
};