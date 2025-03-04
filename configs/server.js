/**
 * Inicializa y configura el servidor Express con las rutas, middlewares y la conexión a la base de datos.
 * Esta función configura el servidor Express utilizando varios middlewares, maneja las rutas de la API, 
 * y establece la conexión con la base de datos MongoDB. En caso de fallar la conexión a la base de datos o 
 * la inicialización del servidor, se muestra un error en consola y el proceso se detiene.
 */

"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routers.js"
import courserRouter from "../src/courses/curses.routers.js"
import apiLimiter from "../src/middlewares/validar-cant-peticiones.js"

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) =>{
    app.use("/studentsSystem/v1/auth", authRoutes)
    app.use("/studentsSystem/v1/user", userRoutes)
    app.use("/studentsSystem/v1/course", courserRouter)
}

const conectarDB = async () =>{
    try{
        await dbConnection()
    }catch(err){
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initiServer = () => {
    const app = express()
    try{
        middlewares(app)
        conectarDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    }catch(err){
        console.log(`Server init failed: ${err}`)
    }
}

