import express from "express";
import { addDosen, addDosensBulk, getDosens } from "../controllers/Users.js"; // Import the new bulk function
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Route for adding a single Dosen
router.post('/dosens', verifyUser, adminOnly, addDosen);

// Route for adding multiple Dosens (bulk insert)
router.post('/dosens/bulk', verifyUser, adminOnly, addDosensBulk); 

router.get('/dosens', verifyUser, adminOnly, getDosens);
export default router;
