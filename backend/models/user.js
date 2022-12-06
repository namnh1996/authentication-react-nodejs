import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, require: true },
	email: { type: String, require: true, unique: true },
	password: { type: String, require: true, minLength: 6 },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
