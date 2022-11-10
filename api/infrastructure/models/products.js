module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      price: DataTypes.FLOAT,
      currency: DataTypes.STRING,
      description:DataTypes.STRING,
      views : DataTypes.BIGINT,
    }, {
      timestamps: true,
      paranoid: true,
    });
    return Product;
  };
  