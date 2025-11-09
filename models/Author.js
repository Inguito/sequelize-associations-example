export default (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    name: DataTypes.STRING
  });

  Author.associate = (models) => {
    Author.hasMany(models.Book, {
      foreignKey: "authorId",
      as: "books"
    });
  };

  return Author;
};