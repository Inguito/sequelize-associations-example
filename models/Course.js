export default (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    title: DataTypes.STRING
  });

  Course.associate = (models) => {
    Course.belongsToMany(models.Student, {
      through: "Enrollments",
      as: "students",
      foreignKey: "courseId"
    });
  };

  return Course;
};