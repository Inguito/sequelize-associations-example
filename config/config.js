// Aqui importo las dependencias necesarias
import dotenv from "dotenv";
// Configuro las variables de entorno
dotenv.config();
// Exporto la configuración de la base de datos
export default {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
};