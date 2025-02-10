/**
 * cursesRoutes tiene las rutas de autenticación para crear cursos, eliminarlos, actualizarlos, ver los cursos del profesor,
 * asignar un alumno a un curso y ver los cursos de un alumno. 
 */

import { Router } from "express";
import { crearCurso, eliminarCurso, actualizarCursos, ProfesorCursos, unirseCurso, estudiantesCursos}  from "./course.controller.js"
import {   createCourseValidator,  } from "../middlewares/validators.js";

const router = Router()

router.post("/createCourse", createCourseValidator, crearCurso)
router.post("/deleteCourse", eliminarCurso)
router.put("/update", actualizarCursos)
router.get("/profesor/:uid/cursos", ProfesorCursos)
router.post("/alumnoJoin", unirseCurso)
router.get("/alumnos/:uid/courses", estudiantesCursos)


export default router