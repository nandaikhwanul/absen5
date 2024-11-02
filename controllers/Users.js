import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role', 'nip', 'loginTime', 'logoutTime'] // Include loginTime and logoutTime
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        if (!response) return res.status(404).json({ msg: "User tidak ditemukan" });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    const { name, email, password, confirmPassword, role, nip } = req.body;

    const validRoles = ['admin', 'dosen'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: "Role tidak valid" });
    }

    if (!name || !email || !nip || !password || !confirmPassword) {
        return res.status(400).json({ msg: "Semua bidang diperlukan" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah terdaftar" });
        }

        const existingNip = await User.findOne({ where: { nip } });
        if (existingNip) {
            return res.status(400).json({ msg: "NIP sudah terdaftar" });
        }

        const hashPassword = await argon2.hash(password);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            nip
        });

        res.status(201).json({
            msg: "Register Berhasil",
            user: {
                uuid: newUser.uuid,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const { name, email, password, confirmPassword, role } = req.body;
    let hashPassword = user.password;
    if (password) {
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
        }
        hashPassword = await argon2.hash(password);
    }

    try {
        await User.update({
            name,
            email,
            password: hashPassword,
            role
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        await User.destroy({
            where: {
                uuid: req.params.id
            }
        });

        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};