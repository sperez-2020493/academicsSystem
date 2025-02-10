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
