
// importo express y el objeto db que contiene 
// los modelos definidos
import express from "express";
import db from "../models/index.js";

const router = express.Router();
// ***** Referido a User y Profile *******
// Aqui creo un usuario nuevo
router.post("/users/new", async (req, res) => {
  try {
    const user = await db.User.create(req.body, {
      include: [{ model: db.Profile, as: "profile" }]
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aquí traigo todos los usuarios con su perfil asociado
router.get("/users/getAll", async (req, res) => {
  const users = await db.User.findAll({ include: "profile" });
  res.json(users);
});
// Aquí modifico el perfil de un usuario existente o creo uno nuevo si no existe 
router.put("/users/modify/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, profile } = req.body;
  try {
    // Busco el usuario por su ID
    const user = await db.User.findByPk(id,{ include:{
      model:db.Profile, as :"profile"}
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Actualizo campos del usuario
    await user.update({ name, email });
    // Si se proporcionan datos de perfil, los actualizo o creo uno nuevo
    if(profile){
      if (user.profile) {
        // Si el perfil ya existe, lo actualizo
        await user.profile.update(profile);
      } else {
        // Si no existe, creo un nuevo perfil asociado al usuario
        await db.Profile.create({ ...profile, 
          userId: user.id });
              }
                }
    const updatedUser = await db.User.findByPk(id, { 
      include:{model: db.Profile, as: "profile"} 
    });
    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Error al actualizar al usuario", 
      error: error.message });
  } 
});

// Aquí elimino un usuario por su ID
router.delete("/users/delete/:id", async (req, res) => {
  const { id } = req.params;
  // Busco el usuario por su ID
  const user = await db.User.findByPk(id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  // Elimino el usuario
  await user.destroy();
  res.json({ message: "Usuario eliminado" });
});

// *****  Referido a Author y Book ******
// Aquí creo un autor nuevo junto con sus libros
router.post("/authors/new", async (req, res) => {
  // Espero que el cuerpo de la solicitud contenga 
  // los datos del autor y un array de libros
  const author = await db.Author.create(req.body, {
    include: [{ model: db.Book, as: "books" }]
  });
  res.json(author);
});

router.get("/authors/all", async (req, res) => {
  const authors = await db.Author.findAll({ include: "books" });
  res.json(authors);
});

router.post("/students", async (req, res) => {
  const { name, courseIds } = req.body;
  const student = await db.Student.create({ name });
  if (courseIds?.length) {
    const courses = await db.Course.findAll({ where: { id: courseIds } });
    await student.addCourses(courses);
  }
  res.json(student);
});

router.get("/students", async (req, res) => {
  const students = await db.Student.findAll({ include: "courses" });
  res.json(students);
});

export default router;