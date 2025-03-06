const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const habitSchema = new Schema({
	userId: { type: mongoose.Types.ObjectId, required: true },

	name: { type: String, required: true },
	description: { type: String, required: true },
	hour: { type: String, required: true },
	minute: { type: String, required: true },
	status: {
		type: String,
		enum: ["TODO", "DONE", "SKIP"],
		default: "TODO",
	},
	goal: { type: Number, required: true },
	repeat: { type: String, required: true },
	startDate: { type: Date, default: Date.now },

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
