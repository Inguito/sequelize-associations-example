export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: "userId",
      as: "profile"
    });
  };

  return User;
};