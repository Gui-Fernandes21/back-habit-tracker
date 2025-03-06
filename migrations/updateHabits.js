const mongoose = require("mongoose");
const Habit = require("../models/habit");

const express = require("express");
require("dotenv").config();
const app = express();

const updateHabitsSchema = async () => {
	try {
		const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
		const dbUsername = encodeURIComponent(process.env.DB_USERNAME);
		const uri = `mongodb+srv://${dbUsername}:${dbPassword}@uolagilecourse.wnsi5.mongodb.net/HabitTracker?retryWrites=true&w=majority&appName=UoLAgileCourse`;
		const clientOptions = {
			serverApi: { version: "1", strict: true, deprecationErrors: true },
		};
		
		try {
		console.log("Connecting to the database...");
			await mongoose.connect(uri, clientOptions);
			await mongoose.connection.db.admin().command({ ping: 1 });
			console.log("Connected to the database successfully");
		} catch (err) {
			console.error("Error connecting to the database:", err);
		}

		app.listen(process.env.PORT || 8080, () => {
			console.log(`Server is running on port ${process.env.PORT || 8080}`);
		});

		const defaultGoal = 1;
		const defaultRepeat = "Daily";
		const defaultStartDate = new Date();

		const result = await Habit.updateMany(
			{
				$or: [
					{ goal: { $exists: false } },
					{ repeat: { $exists: false } },
					{ startDate: { $exists: false } },
				],
			},
			{
				$set: {
					goal: defaultGoal,
					repeat: defaultRepeat,
					startDate: defaultStartDate,
				},
			}
		);

		console.log(`Updated ${result.modifiedCount} habits successfully`);
	} catch (error) {
		console.error("Migration failed:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
		process.exit();
	}
};

updateHabitsSchema();