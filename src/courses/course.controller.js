import Course from "../courses/courses.model.js";
import User from "../user/user.model.js"


/**
 * Se encarga de crear los cursos. Solo se permite que los usuarios con roles de profesor creen cursos.
 * El profesor debe existir para que este proceso se realice. El sistema recibe los datos y permite al profesor 
 * crear los cursos que desee.
 */
export const crearCurso = async (req, res) => {
    try {
        const { nameCourse, description, duration,teacher} = req.body;

        const teacherExists = await User.findById(teacher);
        if (!teacherExists) {
            return res.status(404).json({ message: "El profesor no existe" });
        }
        if (teacherExists.role !== "PROFESOR_ROLE") {
            return res.status(403).json({ message: "El usuario no es un profesor" });
        }

        const newCourse = new Course({
            nameCourse,
            description,
            duration,
            teacher,
        });

        await newCourse.save();

        return res.status(201).json({
            message: "El curso fue creado",
            course: newCourse
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error al crear el curso",
            error: err.message
        });
    }
};

/**
 * Elimina los cursos, o mejor dicho, los oculta al ponerlos en estado "removed" (eliminado).
 * Verifica que el curso pertenezca al profesor y cambia el estado del curso.
 * Al cambiar el estado a "removed", también elimina a los alumnos asignados.
 */
export const eliminarCurso = async(req, res) =>{
    try {
        const { professorId, courseId } = req.body;

        const professor = await User.findById(professorId);
        if (!professor) {
            return res.status(404).json({
                success: false,
                message: "Profesor no encontrado"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        if (course.teacher.toString() !== professorId) {
            return res.status(403).json({
                success: false,
                message: "Este curso no pertenece al profesor"
            });
        }

        course.status = 'REMOVED';
        course.students = [];
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Curso eliminado y alumnos designados",
            course
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: err.message
        });
    }
};

/**
 * Se encarga de actualizar la información de un curso de un profesor. Solo permite la modificación de cursos activos.
 * También verifica que el curso enviado pertenezca al profesor. Tras pasar estos filtros importantes, se reciben los datos nuevos 
 * y se modifican. Este proceso solo permite modificar ciertos datos, ya que al actualizar no es necesario cambiar las partes sensibles.
 */
export const actualizarCursos = async (req, res) => {
    try {
        const { professorId, courseId } = req.body; 
        const professor = await User.findById(professorId);
        
        
        if (!professor) {
            return res.status(404).json({
                success: false,
                message: "Profesor no encontrado"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }
        if (course.status === "REMOVED") {
            return res.status(400).json({
                success: false,
                message: "Este curso ha sido eliminado y no se puede modificar"
            });
        }
        if (course.teacher.toString() !== professorId) {
            return res.status(403).json({
                success: false,
                message: "Este curso no pertenece al profesor"
            });
        }

        const { nameCourse, description, duration } = req.body;

        if (nameCourse) course.nameCourse = nameCourse;
        if (description) course.description = description;
        if (duration) course.duration = duration;
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Curso actualizado correctamente",
            course
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: err.message
        });
    }
};

/**
 * Se encarga de mostrar la lista de cursos que crea un profesor, filtrando de manera que solo un profesor pueda acceder a ella.
 * Solo permite ver los cursos activos y no aquellos que estén eliminados. En caso de no tener cursos, muestra un mensaje al respecto.
 * Si todo se cumple, se muestra la lista de cursos del profesor.
 */
export const ProfesorCursos = async (req, res) => {
    try {
        const { uid } = req.params;

        const professor = await User.findOne({ _id: uid, role: "PROFESOR_ROLE" });
        if (!professor) {
            return res.status(404).json({
                success: false,
                message: "Profesor no encontrado o no tiene el rol adecuado"
            });
        }

        const courses = await Course.find({
            teacher: uid,
            status: { $in: ["EN_CURSO", "FINALIZED"] } 
        }).select("nameCourse description status students")
          .populate("students", "name surname");

        if (courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "El profesor no tiene cursos activos o finalizados"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cursos obtenidos correctamente",
            teacherId: uid,
            courses,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error: err.message
        });
    }
};

/**
 * Se encarga de asignar un curso a un alumno, filtrando el rol para permitir que solo los estudiantes se registren.
 * También evita que se unan a más de 3 cursos y que se inscriban en el mismo curso más de una vez.
 * Solo permite a los alumnos unirse a cursos activos o en curso, y no a aquellos que están eliminados.
 */
export const unirseCurso = async (req, res) => {
    try {
        const { uid, courseId } = req.body;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        if (user.role !== "ALUMNO_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Solo los alumnos pueden unirse a cursos"
            });
        }

        const studentCourses = await Course.find({ students: uid });
        
        if (studentCourses.length >= 3) {
            return res.status(400).json({
                success: false,
                message: "No puedes unirte a más de 3 cursos"
            });
        }
        
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }
        if (course.status !== "EN_CURSO") {
            return res.status(400).json({
                success: false,
                message: "No puedes unirte a un curso que no está en curso"
            });
        }
        if (course.students.includes(uid)) {
            return res.status(400).json({
                success: false,
                message: "Ya estás inscrito en este curso"
            });
        }

        course.students.push(uid);
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Te has unido al curso exitosamente",
            course
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al unirse al curso",
            error: err.message
        });
    }
};

/**
 * Se encarga de la función para los alumnos, para ver sus cursos.
 * Este filtra el ID que se le pasa, verificando que sea un alumno y no un profesor.
 * Luego, busca a qué cursos está asignado y proporciona la información de estos.
 */
export const estudiantesCursos = async (req, res) => {
    try {
        const { uid } = req.params;
         const student = await User.findOne({ _id: uid, role: "ALUMNO_ROLE" });
        
         if (!student) {
            return res.status(404).json({
                success: false,
                message: "Alumno no encontrado o no tiene el rol adecuado"
            });
        }

        const courses = await Course.find({
            students: uid,
            status: "EN_CURSO"
        }).select("nameCourse description status teacher")
          .populate("teacher", "name surname");

        if (courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "El alumno no está inscrito en ningún curso activo"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Cursos obtenidos correctamente",
            studentId: uid,
            courses,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los cursos del alumno",
            error: err.message
        });
    }
};