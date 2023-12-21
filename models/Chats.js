module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define("Chats", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Chats;
};
