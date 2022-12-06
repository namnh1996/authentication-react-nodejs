import express from "express";
import { check } from "express-validator";
import {
	getUsers,
	signUp,
	logOut,
	logIn,
} from "../controllers/users-controllers.js";
// import { fileUpload } from "../middleware/file-upload.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/login", logIn);

router.post(
	"/signup",
	[
		check("name").not().isEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("password").isLength({ min: 6 }),
	],

	signUp
);

export default router;
