import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Dosen = db.define('dosens', {
    nip: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
});

export default Dosen;
