// Aqui importo las dependencias necesarias
import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import router from "./routes/api.js";
import morgan from "morgan";
// const morgan = require('morgan');
// Configuro las variables de entorno
dotenv.config();
// Creo la aplicación Express
const app = express();
// Middleware para parsear JSON en las solicitudes  
app.use(express.json());
// Middleware para registrar las peticiones HTTP usando morgan
app.use(morgan("dev"));
// Uso las rutas definidas en el archivo routes/api.js
app.use("/api", router);
// Defino el puerto desde las variables de entorno o uso el 3000 por defecto
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conecto a la base de datos PostgreSQL y 
    // authenticate me aseguro de que la conexión es exitosa
    await db.sequelize.authenticate();
    console.log("✅ Conectado a la base de datos PostgreSQL.");
    // Sincronizo los modelos con la base de datos
    await db.sequelize.sync({ force: false }); 
    // force: true para recrear las tablas en cada inicio
    console.log("🧩 Modelos sincronizados.");
    // Inicio el servidor
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  } 
  catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
}
// Ejecuto Inicio el servidor
startServer();