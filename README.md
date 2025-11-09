Una vez que lo descargues y extraigas:
1. Editá el archivo .env con tus credenciales de PostgreSQL.
2. Ejecutá en tu terminal:
npm install
npm start
3. El servidor se iniciará en:
http://localhost:3000/api

 
🏗️ Estructura del proyecto
sequelize-associations-example/
│
├── package.json
├── config/
│   └── config.js
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Profile.js
│   ├── Author.js
│   ├── Book.js
│   ├── Student.js
│   └── Course.js
├── routes/
│   └── api.js
├── server.js
└── .env
 
⚙️ 1. package.json
{ "name": "sequelize-associations-example", "version": "1.0.0", "type": "module", "main": "server.js", "scripts": { "start": "node server.js", "dev": "nodemon server.js" }, "dependencies": { "dotenv": "^16.4.5", "express": "^4.19.2", "pg": "^8.11.3", "pg-hstore": "^2.3.4", "sequelize": "^6.37.1" }, "devDependencies": { "nodemon": "^3.1.4" } } 
Instalación:
npm install 
 
🔐 2. .env
DB_NAME=sequelize_example DB_USER=postgres DB_PASSWORD=tu_password DB_HOST=localhost DB_DIALECT=postgres PORT=3000 
 
🧱 3. config/config.js
import dotenv from "dotenv"; 
dotenv.config(); 
export default { database: process.env.DB_NAME, 
		username: process.env.DB_USER, 
		password: process.env.DB_PASSWORD, 
		host: process.env.DB_HOST, 
		dialect: process.env.DB_DIALECT }; 
 
🧩 4. Modelos
models/index.js
import { Sequelize, DataTypes } from "sequelize"; 
import dbConfig from "../config/config.js"; 
import UserModel from "./User.js"; 
import ProfileModel from "./Profile.js"; 
import AuthorModel from "./Author.js"; 
import BookModel from "./Book.js"; import StudentModel from "./Student.js"; import CourseModel from "./Course.js"; const sequelize = new Sequelize( dbConfig.database, dbConfig.username, dbConfig.password, { host: dbConfig.host, dialect: dbConfig.dialect, logging: false } ); const db = {}; // Inicializar modelos db.User = UserModel(sequelize, DataTypes); db.Profile = ProfileModel(sequelize, DataTypes); db.Author = AuthorModel(sequelize, DataTypes); db.Book = BookModel(sequelize, DataTypes); db.Student = StudentModel(sequelize, DataTypes); db.Course = CourseModel(sequelize, DataTypes); // Asociaciones Object.keys(db).forEach(modelName => { if (db[modelName].associate) { db[modelName].associate(db); } }); db.sequelize = sequelize; db.Sequelize = Sequelize; export default db; 
 
🧠 Relación 1️⃣ UNO A UNO — User ↔ Profile
models/User.js
export default (sequelize, DataTypes) => { const User = sequelize.define("User", { name: DataTypes.STRING, email: DataTypes.STRING }); User.associate = (models) => { User.hasOne(models.Profile, { foreignKey: "userId", as: "profile" }); }; return User; }; 
models/Profile.js
export default (sequelize, DataTypes) => { const Profile = sequelize.define("Profile", { bio: DataTypes.TEXT, avatar: DataTypes.STRING }); Profile.associate = (models) => { Profile.belongsTo(models.User, { foreignKey: "userId", as: "user" }); }; return Profile; }; 
 
🧠 Relación 2️⃣ UNO A MUCHOS — Author ↔ Book
models/Author.js
export default (sequelize, DataTypes) => { const Author = sequelize.define("Author", { name: DataTypes.STRING }); Author.associate = (models) => { Author.hasMany(models.Book, { foreignKey: "authorId", as: "books" }); }; return Author; }; 
models/Book.js
export default (sequelize, DataTypes) => { const Book = sequelize.define("Book", { title: DataTypes.STRING, year: DataTypes.INTEGER }); Book.associate = (models) => { Book.belongsTo(models.Author, { foreignKey: "authorId", as: "author" }); }; return Book; }; 
 
🧠 Relación 3️⃣ MUCHOS A MUCHOS — Student ↔ Course
models/Student.js
export default (sequelize, DataTypes) => { const Student = sequelize.define("Student", { name: DataTypes.STRING }); Student.associate = (models) => { Student.belongsToMany(models.Course, { through: "Enrollments", as: "courses", foreignKey: "studentId" }); }; return Student; }; 
models/Course.js
export default (sequelize, DataTypes) => { const Course = sequelize.define("Course", { title: DataTypes.STRING }); Course.associate = (models) => { Course.belongsToMany(models.Student, { through: "Enrollments", as: "students", foreignKey: "courseId" }); }; return Course; }; 
 
🚦 5. routes/api.js
import express from "express"; import db from "../models/index.js"; const router = express.Router(); // === 1️⃣ Usuarios y Perfiles === router.post("/users", async (req, res) => { try { const user = await db.User.create(req.body, { include: [{ model: db.Profile, as: "profile" }] }); res.json(user); } catch (err) { res.status(500).json({ error: err.message }); } }); router.get("/users", async (req, res) => { const users = await db.User.findAll({ include: "profile" }); res.json(users); }); // === 2️⃣ Autores y Libros === router.post("/authors", async (req, res) => { const author = await db.Author.create(req.body, { include: [{ model: db.Book, as: "books" }] }); res.json(author); }); router.get("/authors", async (req, res) => { const authors = await db.Author.findAll({ include: "books" }); res.json(authors); }); // === 3️⃣ Estudiantes y Cursos === router.post("/students", async (req, res) => { const { name, courseIds } = req.body; const student = await db.Student.create({ name }); if (courseIds?.length) { const courses = await db.Course.findAll({ where: { id: courseIds } }); await student.addCourses(courses); } res.json(student); }); router.get("/students", async (req, res) => { const students = await db.Student.findAll({ include: "courses" }); res.json(students); }); export default router; 
 
🖥️ 6. server.js
import express from "express"; 
import dotenv from "dotenv"; 
import db from "./models/index.js"; 
import router from "./routes/api.js"; 
dotenv.config(); 
const app = express(); 
app.use(express.json()); 
app.use("/api", router); 
const PORT = process.env.PORT || 3000; 
async function startServer() { 
	try { await db.sequelize.authenticate(); 
console.log("✅ Conectado a la base de datos PostgreSQL."); 
await db.sequelize.sync({ force: true }); console.log("🧩 Modelos sincronizados."); app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)); } catch (error) { console.error("❌ Error al iniciar:", error); } } startServer(); 
 
🧪 7. Ejemplos de requests (Postman)
1️⃣ Crear usuario con perfil
POST /api/users
{ "name": "Héctor", 
"email": "hector@example.com", 
"profile": { "bio": "Fullstack Developer", 
	     "avatar": "avatar.png" } 
} 
2️⃣ Crear autor con libros
POST /api/authors
{ "name": "Gabriel García Márquez", 
"books": [ { "title": "Cien años de soledad", "year": 1967 }, 
           { "title": "El coronel no tiene quien le escriba", "year": 1961 } ] } 
3️⃣ Crear cursos y estudiantes
Primero creá los cursos:
INSERT INTO "Courses" ("title","createdAt","updatedAt") VALUES ('Matemática', NOW(), NOW()), ('Programación', NOW(), NOW()); 
Luego:
POST /api/students
{ "name": "Ana Pérez", "courseIds": [1, 2] } 
 
✅ Resultado
Podés consultar:
•	/api/users → Usuarios con su perfil (1:1)
•	/api/authors → Autores con sus libros (1:N)
•	/api/students → Estudiantes con cursos (N:M)
 
