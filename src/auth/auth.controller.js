import { hash, verify } from "argon2";
import User from "../user/user.model.js"
import { generateJWT } from "../helpers/generate-jwt.js";


/**
 *El register se encarga del registro de los usuarios, recibe los datos de la solicitud,
 *si se proporciona ina imagen este la gurado usando el nombre del archivo,
 *incripta lacontraseña del usuario al guradar, crea el usuario con los datos datos y respode
 * ante el registro echo o ante algun problema en el registro.
 */

export const register = async (req, res) =>{
    try{
        const data = req.body
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password)
        data.password = encryptedPassword
        data.profilePicture = profilePicture
        const user = await User.create(data);
        
        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email
    })

    }catch(err){
        return res.status(500).json({
            message: "User refistration failed",
            error: err.message
            
        })
    }
}

/**
 *El login se encarga del manejo del inicio se sesion y su autenticacion,
 * este recibe las credenciales de email, username y password, este busca el usuario 
 * dad y comprueba la informacion. Si todo es correcto deja iniciar sesion, en caso que no lo sea
 * este responde un mensaje que corresponda al dato o datos no correspondientes con el user.
 */
export const login = async (req, res) => {
    const { email, username, password } = req.body
    try{
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })
        if(!user){
            return res.status(400).json({
                message: "Credenciales invalidas",
                error: "No exite el usuario o correo ingresado"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return  res.status(400).json({
                message: "Credenciales invalidas",
                error: "Contrasenia incorrecta"
            })
        }

        const token = await generateJWT(user.id)
        
        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                profilePicture: user.profilePicture
            }
        })

    }catch(err){
        return res.status(500).json({
            message: "Login failed, server error",
            error: err.message
        })
    }
}

