export default (sequelize, DataTypes) => {
  const Student = sequelize.define("Student", {
    name: DataTypes.STRING
  });

  Student.associate = (models) => {
    Student.belongsToMany(models.Course, {
      through: "Enrollments",
      as: "courses",
      foreignKey: "studentId"
    });
  };

  return Student;
};