# API de sistema de Gestion de Alumnos

Esta API está diseñada para la gestión de alumnos, proporcionando múltiples funciones para su administración. 

## Variables de Entorno

Para configurar la API, modifica el archivo `.env` en el directorio raíz y ajusta las siguientes variables según sea necesario:

```env
MONGO_URI=<tu_cadena_de_conexión_mongodb>
PORT=<tu_puerto_del_servidor>
JWT_SECRET=<tu_secreto_jwt>
```

## Instalación

1. Clona el repositorio:
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Accede al directorio del proyecto:
   ```sh
   cd nombre-del-proyecto
   ```
3. Instala las dependencias:
   ```sh
   npm install
   ```

## Uso

Para iniciar el servidor:
```sh
npm start dev
```


## Endpoints de la API

### Registrar un usuario
**URL:** `http://localhost:3000/studentsSystem/v1/auth/register`
**MÉTODO:** `POST`
**Formato JSON:**
```json
{
    "name": "String",
    "surname": "String",
    "username": "String",
    "email": "String",
    "password": "String",
    "profilePicture": "file",
    "phone": "String",
    "role": "String"
}
```

### Login
**URL:** `http://localhost:3000/studentsSystem/v1/auth/login`
**MÉTODO:** `POST`
**Formato JSON:**
```json
{
    "username": "String",
    "password": "String"
}
```

### Usuario ALUMNOS Y PROFESOR

#### Eliminar ALUMNO
**URL:** `http://localhost:3000/studentsSystem/v1/user/deleteUser/:uid`
**MÉTODO:** `DELETE`

#### Actualizar ALUMNO
**URL:** `http://localhost:3000/studentsSystem/v1/user/updateUser/:uid`
**MÉTODO:** `PUT`
**Formato JSON:**
```json
{
    "name": "String",
    "surname": "String",
    "username": "String",
    "email": "String",
    "phone": "String"
}
```

#### Unirte a Curso ALUMNO
**URL:** `http://localhost:3000/studentsSystem/v1/course/alumnoJoin`
**MÉTODO:** `POST`
**Formato JSON:**
```json
{
    "uid": "String ID",
    "courseId": "String ID"
}
```

#### Listar Cursos ALUMNO
**URL:** `http://localhost:3000/studentsSystem/v1/course/alumnos/:uid/courses`
**MÉTODO:** `GET`

### Crear Curso PROFESOR
**URL:** `http://localhost:3000/studentsSystem/v1/course/createCourse`
**MÉTODO:** `POST`
**Formato JSON:**
```json
{
    "nameCourse": "String",
    "duration": "String",
    "description": "String",
    "teacher": "String ID"
}
```

### Eliminar Curso PROFESOR
**URL:** `http://localhost:3000/studentsSystem/v1/course/deleteCourse`
**MÉTODO:** `POST`
**Formato JSON:**
```json
{
    "professorId": "String ID",
    "courseId": "String ID"
}
```

### Actualizar Curso PROFESOR
**URL:** `http://localhost:3000/studentsSystem/v1/course/update`
**MÉTODO:** `PUT`
**Formato JSON:**
```json
{
    "professorId": "String ID",
    "courseId": "String ID",
    "nameCourse": "String",
    "description": "String",
    "duration": "String"
}
```

### Listar Cursos PROFESOR
**URL:** `http://localhost:3000/studentsSystem/v1/course/profesor/:uid/cursos`
**MÉTODO:** `GET`



## Desarrollado por:

Samuel Alexander Perez Cap
Carnet: 2020493
Grado: IN6BM


