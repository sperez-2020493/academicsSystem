/**
 * Este middleware usa `express-validator` para revisar si hay errores de validación en los campos 
 * de la solicitud (por ejemplo, datos incorrectos o faltantes). Si hay errores, pasa esos errores 
 * al siguiente middleware para manejarlos; si no hay errores, permite que la solicitud continúe 
 * con el siguiente paso en el proceso.
 */

import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(errors)
    }
    next()
}