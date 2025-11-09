export default (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    title: DataTypes.STRING,
    year: DataTypes.INTEGER
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Author, {
      foreignKey: "authorId",
      as: "author"
    });
  };

  return Book;
};