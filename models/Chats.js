module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define("Chats", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Chats.associate = (models) => {
        Chats.belongsTo(models.Users, {
            onDelete: "cascade",
        });
        Chats.belongsTo(models.Rooms, {
            onDelete: "cascade",
        });
    }

    return Chats;
};
