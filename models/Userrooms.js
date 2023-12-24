module.exports = (sequelize, DataTypes) => {
    const Userrooms = sequelize.define("Userrooms", {
        userSocketId: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Userrooms;
};
