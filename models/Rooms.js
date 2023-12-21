module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define("Rooms", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Rooms.associate = (models) => {
        Rooms.hasMany(models.Chats, {
            onDelete: "cascade",
        });
        Rooms.belongsToMany(models.Users, {
            onDelete: "cascade",
            through: 'UserRooms'
        });
    }

    return Rooms;
};
