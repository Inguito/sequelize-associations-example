import { Sequelize, DataTypes } from "sequelize";
// Importamos las variables de configuración de la base de datos
import dbConfig from "../config/config.js";
import UserModel from "./User.js";
import ProfileModel from "./Profile.js";
import AuthorModel from "./Author.js";
import BookModel from "./Book.js";
import StudentModel from "./Student.js";
import CourseModel from "./Course.js";

// Nos conectamos a la base de datos
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
  }
);
// Definimos un objeto para almacenar los modelos
const db = {};
// Inicializamos los modelos
db.User = UserModel(sequelize, DataTypes);
db.Profile = ProfileModel(sequelize, DataTypes);
db.Author = AuthorModel(sequelize, DataTypes);
db.Book = BookModel(sequelize, DataTypes);
db.Student = StudentModel(sequelize, DataTypes);
db.Course = CourseModel(sequelize, DataTypes);
// Definimos las asociaciones entre los modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Exportamos el objeto db que contiene todos los modelos y la conexión sequelize
db.sequelize = sequelize;
// También exportamos la clase Sequelize para posibles usos futuros
db.Sequelize = Sequelize;

export default db;