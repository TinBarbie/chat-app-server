module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        loggedIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
        }
    });
    Users.associate = (models) => {
        Users.belongsToMany(models.Rooms, {
            onDelete: "cascade",
            through: 'Userrooms'
        });
        Users.hasMany(models.Chats, {
            onDelete: "cascade",
        });
    }

    return Users;
};
