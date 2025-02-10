/**
 * Se encarga de manejar los eventos de conexión y desconexión, 
 * informando sobre el estado de la conexión a través de mensajes en consola.
 * Además, gestiona los posibles errores durante el proceso de conexión.
 */

'use strict'

import mongoose from "mongoose"

export const dbConnection = async () => {
    try{
        mongoose.connection.on("error", () => {
            console.log("MongoDB / could not be connect to MongoDB")
            mongoose.disconnect()
        })
        mongoose.connection.on("connecting", () =>{
            console.log("MongoDB / try connecting")
        })
        mongoose.connection.on("connected", () =>{
            console.log("MongoDB / connected to MongoDB")
        })
        mongoose.connection.on("open", () =>{
            console.log("MongoDB / Connected to DataBae")
        })
        mongoose.connection.on("reconnected", () =>{
            console.log("MongoDB / disconnected to MongoDB")
        })
        mongoose.connection.on("disconnected", () =>{
            console.log("MongoDB / disconnected to MongoDB")
        }) 

        await mongoose.connect(process.env.URI_MONGO,{
            serverSelectionTimeoutMS:5000,
            maxPoolSize: 50
        })
        
    }catch(err){
        console.log('Database connection failled: ${err}')
    }
}