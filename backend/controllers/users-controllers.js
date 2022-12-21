import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getUsers = async (req, res, next) => {
	try {
		const users = await User.find({}, "-password");
		res.json({
			users: users.map((user) => user.toObject({ getters: true })),
		});
	} catch (error) {
		const err = new HttpError("Fetching users failed, try again later!");
		return next(err);
	}
};

const logIn = async (req, res, next) => {
	const { email, password } = req.body;
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (error) {
		console.log(error);
		const err = new HttpError(
			"Signing up failed, please again later!",
			500
		);
		next(err);
	}

	if (!existingUser) {
		const error = new HttpError(
			"Invalid credentials, could not log you in!",
			401
		);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (error) {
		const err = new HttpError(
			"Could not log you in, please check your credentials and try again",
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError(
			"Invalid credentials, could not log you in!!!!!",
			401
		);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			"supersecret",
			{ expiresIn: "1m" }
		);
	} catch (error) {
		const err = new HttpError("Logging up failed, try again!", 500);
		return next(error);
	}

	res.json({
		user: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};

const signUp = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		next(
			new HttpError("Invalid inputs passed, please check your data!", 442)
		);
	}
	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (error) {
		const err = new HttpError(
			"Signing up failed, please again later!",
			500
		);
		next(err);
	}

	if (existingUser) {
		const error = new HttpError(
			"User exists already, please login instead!",
			442
		);
		next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (error) {
		const err = new HttpError(
			"Could not create user, please try again",
			500
		);
		return next(err);
	}

	const createdUser = new User({
		name,
		email,
		password: hashedPassword,
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError("Signing up failed, try again!", 500);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			"supersecret",
			{ expiresIn: "1m" }
		);
	} catch (error) {
		const err = new HttpError("Signing up failed, try again!", 500);
		return next(err);
	}
	res.status(201).json({
		user: createdUser.id,
		email: createdUser.email,
		token: token,
	});
};

const logOut = (req, res, nexnt) => {};

export { getUsers, signUp, logOut, logIn };
