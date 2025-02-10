import { hash } from "argon2";
import User from "./user.model.js"

/**
 * Esta función maneja la solicitud para eliminar un usuario a partir de su ID (`uid`) que se pasa en la URL.
 * El proceso se realiza cambiando el estado del usuario a `false` (inactivo) en lugar de eliminarlo físicamente de la base de datos.
 * Además, solo los usuarios con el rol de "ALUMNO_ROLE" pueden ser eliminados. Si el usuario tiene un rol "PROFESOR_ROLE", no se permitirá la eliminación.
 */
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

/**
 * la función maneja la actualizacion de los datos de un usuario basado en su ID (`uid`), el cual se pasa en la URL.
 * Solo los usuarios con el rol de "ALUMNO_ROLE" pueden ser actualizados. Si el usuario tiene un rol diferente, no se permitirá la modificación.
 * En caso de error muestra un mensaje estatus 500.
 */
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