import Course from "../courses/courses.model.js";
import User from "../user/user.model.js"



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