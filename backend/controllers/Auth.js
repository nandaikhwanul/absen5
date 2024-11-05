import User from "../models/UserModel.js";
import argon2 from "argon2";

// Fungsi Login
export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { nip: req.body.nip }
        });
        
        if (!user) {
            console.error("User not found for NIP:", req.body.nip);
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) {
            console.error("Password mismatch for user:", req.body.nip);
            return res.status(400).json({ msg: "Password salah" });
        }

        req.session.userId = user.uuid;

        // Update loginTime for dosen and admin roles
        if (user.role === "dosen" || user.role === "admin") {
            await user.update({ loginTime: new Date() });
            console.log("Login time updated for user:", user.nip);
        }

        const { uuid, name, email, role } = user;
        res.status(200).json({ uuid, name, email, role });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

// Fungsi Logout
export const logOut = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findOne({ where: { uuid: userId } });

        // Update logoutTime only for dosen role
        if (user && user.role.toLowerCase() === "dosen") {
            await user.update({ logoutTime: new Date() });
            console.log("Logout time updated for user:", user.nip);
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("Error during logout:", err);
                return res.status(400).json({ msg: "Gagal melakukan logout" });
            }
            res.status(200).json({ msg: "Anda telah berhasil logout" });
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

// Fungsi Me untuk mendapatkan informasi user yang sedang login
// Fungsi Me untuk mendapatkan informasi user yang sedang login
export const Me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "Silakan login terlebih dahulu" });
        }

        const user = await User.findOne({
            where: { uuid: req.session.userId },
            attributes: ['uuid', 'name', 'email', 'role', 'nip', 'loginTime', 'logoutTime'] // Tambahkan 'loginTime' dan 'logoutTime' di sini
        });

        if (!user) {
            console.error("User not found for UUID:", req.session.userId);
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};
