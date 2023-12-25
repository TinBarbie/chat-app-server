module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define("Chats", {
        description: {
            type: DataTypes.STRING,
        },
        filename: {
            type: DataTypes.STRING,
        },
        originalName: {
            type: DataTypes.STRING,
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
