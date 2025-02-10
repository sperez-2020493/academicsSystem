/**
 * Este middleware se encarga de eliminar un archivo cargado si ocurre un error durante el procesamiento 
 * de la solicitud, para evitar que los archivos innecesarios queden almacenados en el servidor.
 * Si un archivo fue cargado y se encuentra en el sistema de archivos, se intenta eliminar utilizando
 * `fs.promises.unlink`. Si la eliminación falla, se muestra un mensaje de error en la consola.
 * 
 * Si el error tiene un código de estado 400 o contiene un objeto `errors`, se responde con un error 
 * con estado 400 y los detalles del error. Si no es así, se responde con un error 500 y el mensaje 
 * correspondiente.
 */

import fs from "fs/promises";
import { join } from "path"

export const deleteFileOnError = async (err, req, res, next) => {
    if(req.file && req.filePath){
        const filePath = join(req.filePath, req.file.filaname)
        try{
            await fs.unlink(filePath)
        }catch(unlinkErr){
            console.log(`Error deletingt file: ${unlinkErr}`)
        }
    }
    if(err.status === 400 || err.errors){
        return res.status(400).json({
            success: false,
            errors: err.errors
        })
    }
    return res.status(500).json({
        success: false,
        message: err.message
    })
}
