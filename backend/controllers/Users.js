import User from "../models/UserModel.js";
import Dosen from "../models/DosenModel.js"; // Import the Dosen model
import argon2 from "argon2";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'role', 'nip', 'email', 'loginTime', 'logoutTime'] // Include email
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'role', 'email'], // Include email
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

// Create user
// Create user
export const createUser = async (req, res) => {
    const { nip, email, password, confirmPassword, role } = req.body;

    const validRoles = ['admin', 'dosen'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: "Role tidak valid" });
    }

    if (!nip || !password || !confirmPassword || !role) {
        return res.status(400).json({ msg: "Semua bidang diperlukan" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    try {
        // Check if NIP exists in the dosens table
        const dosen = await Dosen.findOne({ where: { nip } });
        if (!dosen) {
            return res.status(400).json({ msg: "NIP tidak ditemukan di tabel dosens" });
        }

        // Check if NIP is already registered in the users table
        const existingNip = await User.findOne({ where: { nip } });
        if (existingNip) {
            return res.status(400).json({ msg: "NIP sudah terdaftar sebagai user" });
        }

        // Check if the email is already registered (only if email is provided)
        if (email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({ msg: "Email sudah terdaftar" });
            }
        }

        // Hash the password
        const hashPassword = await argon2.hash(password);

        // Create new user with name from dosens table
        const newUser = await User.create({
            nip,
            email, // Can be null if not provided
            password: hashPassword,
            role,
            name: dosen.name // Set the name from dosens table
        });

        res.status(201).json({
            msg: "Register Berhasil",
            user: {
                uuid: newUser.uuid,
                name: newUser.name,
                role: newUser.role,
                email: newUser.email // Include email in response
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// Update user
export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const { name, password, confirmPassword, role, email } = req.body;
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
            password: hashPassword,
            role,
            email // Update email
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


// Delete user
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

// Assuming you're using Sequelize for ORM, adjust it according to your setup
export const addDosen = async (req, res) => {
    const { nip, name } = req.body;

    // Check if both nip and name are provided
    if (!nip || !name) {
        return res.status(400).json({ msg: "NIP and Name are required" });
    }

    try {
        // Check if the NIP already exists in the database
        const existingDosen = await Dosen.findOne({ where: { nip } });

        if (existingDosen) {
            return res.status(400).json({ msg: "NIP already exists" });
        }

        // Create a new Dosen
        const newDosen = await Dosen.create({
            nip,
            name,
        });

        res.status(201).json({ msg: "Dosen added successfully", dosen: newDosen });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Function for adding multiple Dosens (bulk insert)
export const addDosensBulk = async (req, res) => {
    const dosenData = req.body.dosenData; // Array of dosens to be inserted

    // Check if dosenData is valid
    if (!Array.isArray(dosenData) || dosenData.length === 0) {
        return res.status(400).json({ msg: "No dosen data provided" });
    }

    // Validate each Dosen's data
    for (const data of dosenData) {
        if (!data.nip || !data.name) {
            return res.status(400).json({ msg: "All fields are required for each Dosen" });
        }
    }

    try {
        // Extract all NIPs from the incoming data
        const nips = dosenData.map(data => data.nip);

        // Check if any of the NIPs already exist in the database
        const existingDosens = await Dosen.findAll({
            where: {
                nip: nips,
            },
        });

        // If there are existing dosens with the same NIPs, return an error message
        if (existingDosens.length > 0) {
            const existingNips = existingDosens.map(dosen => dosen.nip);
            return res.status(400).json({ msg: `The following NIPs already exist: ${existingNips.join(", ")}` });
        }

        // Insert the new dosens using bulkCreate
        const newDosens = await Dosen.bulkCreate(dosenData);

        res.status(201).json({ msg: "Dosens added successfully", dosens: newDosens });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get all dosens
export const getDosens = async (req, res) => {
    try {
        const response = await Dosen.findAll({
            attributes: ['nip', 'name'] // Include only NIP and Name fields, or customize as needed
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};










