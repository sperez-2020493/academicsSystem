/**
 * Este middleware usa `express-rate-limit` para restringir la cantidad de solicitudes que un usuario 
 * puede hacer a la API en un periodo de tiempo determinado. En este caso, se permite un máximo de 50 
 * solicitudes por cada 15 minutos (15 * 60 * 1000 ms).
 */
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
})

export default apiLimiter