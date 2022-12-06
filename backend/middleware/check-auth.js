import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";
const checkAuth = (req, res, next) => {
	if (req.method === "OPTIONS") {
		next();
	}
	try {
		const token = req.headers.authorization.split(" ")[1]; //authorization: 'Bearer token'
		if (!token) {
			throw new Error("Authentication failed!");
		}
	} catch (error) {}
	const decodedToken = jwt.verify(token, "supersecret");
	req.userData = { userId: decodedToken.userId };
	next();
	const error = new HttpError("Authentication failed", 401);
	return next(error);
};

export default checkAuth;
