const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mainRoutes = require("./routes/main");
const authMiddleware = require("./middlewares/auth");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(authMiddleware);
app.use("/", mainRoutes);

const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
const dbUsername = encodeURIComponent(process.env.DB_USERNAME);
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@uolagilecourse.wnsi5.mongodb.net/HabitTracker?retryWrites=true&w=majority&appName=UoLAgileCourse`;
const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
	try {
    console.log("Connecting to the database...");
		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log("Connected to the database successfully");
	} catch (err) {
		console.error("Error connecting to the database:", err);
	}
}
 
run()
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log(`Server is running on port ${process.env.PORT || 8080}`);
		});
	})
	.catch((err) => {
		console.error("Error starting the server:", err);
	});
