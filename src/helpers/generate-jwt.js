/**
 * Función para generar un token JWT (JSON Web Token) para autenticación.
 * Esta función crea un token JWT utilizando el ID de usuario (uid) proporcionado como payload.
 * El token es firmado con una clave secreta almacenada en el entorno (process.env.SECRETORPRIVATEKEY)
 * y tiene un tiempo de expiración de 1 hora. El token generado se utiliza para autenticar al usuario en 
 * solicitudes futuras.
 * La función retorna una promesa que resuelve con el token generado si la operación es exitosa,
 * o rechaza con un mensaje de error si algo falla durante la firma del token.
 */

import jwt from "jsonwebtoken"

export const generateJWT = (uid = " ") =>{
    return new Promise ((resolve, reject) => { 
        const payload = { uid}

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: "1h"
            },
            (err, token)=>{
                if(err){
                    reject({
                        success: false,
                        message: err
                    })

                }else{
                    resolve(token)
                }
            }
        )
    })

}