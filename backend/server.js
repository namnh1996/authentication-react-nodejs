import express from "express";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";
import mongoose from "mongoose";
const app = express();

app.use(bodyParser.json());

//using to fix cors error
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	next();
});

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route!", 404);
	throw error;
});
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "Error unknow" });
});

mongoose
	.connect(
		"mongodb+srv://namdev96:namdev96@cluster0.pmgwec6.mongodb.net/Places?retryWrites=true&w=majority"
	)
	.then(() => {
		app.listen(5000);
	})
	.catch((err) => {
		console.log(err);
	});
