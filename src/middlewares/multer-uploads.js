/**
 * Configuración para manejar la carga de archivos usando Multer.
 * 
 * El archivo configura Multer para que los usuarios puedan subir archivos, como imágenes, al servidor. 
 * 
 * La función `createMulterConfig` toma la carpeta donde se guardarán los archivos como parámetro y devuelve una configuración de Multer. 
 * En este caso, se usa para guardar las fotos de perfil de los usuarios en la carpeta `profile-pictures`.
 */

import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url"

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const MIMETYPES = ["image/png", "image/jpg", "image/jpeg"]
const MAX_SIZE = 100000000

const createMulterConfig = (destinationFolder) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const fullPath = join(CURRENT_DIR, destinationFolder)
                req.filePath = fullPath
                cb(null, fullPath)
            },
            filename: (req, file, cb) => {
                const fileExtension = extname(file.originalname)
                const fileName = file.originalname.split(fileExtension)[0]
                cb(null, `${fileName}-${Date.now()}${fileExtension}`)
            }   
        }),
        fileFilter:(req, file, cb) => {
            if(MIMETYPES.includes(file.mimetype)) cb(null,true)
            else cb(new Error(`Solamente se aceptan archivos de los siguients tipos: ${MIMETYPES.join(" ")}`))
        },
        limits:{
            fileSize: MAX_SIZE
        }
    })
}

export const uploadProfilePicture = createMulterConfig("../../public/uploads/profile-pictures")