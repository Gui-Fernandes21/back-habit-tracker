const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const habitSchema = new Schema({
	userId: { type: mongoose.Types.ObjectId, required: true },

	name: { type: String, required: true },
	description: { type: String, required: true },
	hour: { type: Number, required: true },
	minute: { type: Number, required: true },
	completed: { type: Boolean, default: false },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

habitSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

habitSchema.pre("findOneAndUpdate", function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

module.exports = mongoose.model("Habit", habitSchema);
