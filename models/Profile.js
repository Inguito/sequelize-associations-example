export default (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    bio: DataTypes.TEXT,
    avatar: DataTypes.STRING
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user"
    });
  };

  return Profile;
};