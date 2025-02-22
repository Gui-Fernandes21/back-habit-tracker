const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

exports.signup = async (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	if (!name || !email || !password) {
		console.log("No data received");
		return;
	}

	const isRegistred = await User.findOne({ email: email });

	if (isRegistred) {
		return res.status(400).json({
			message: "User Already Exists",
		});
	}

	try {
		const hashPassword = await bcrypt.hash(password, 12);
		const user = new User({
			name: name,
			email: email,
			password: hashPassword,
			habits: [],
		});

		const savedUser = await user.save();

		const token = await jwt.sign(
			{
				email: user.email,
				userId: user._id.toString(),
			},
			"somesupersecret",
			{ expiresIn: "1hr" }
		);

		res.status(201).json({
			message: "User Created Successfully",
			token: token,
			// user: savedUser,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		console.log("No data received");
		return;
	}

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			res.status(401).json({
				message: "No User Found",
			});
			console.log("No User Found");
			return;
		}

		const doMatch = await bcrypt.compare(password, user.password);

		if (!doMatch) {
			res.status(401).json({
				message: "Incorrect Password",
			});
			console.log("Incorrect Password");
		}
    
		const token = await jwt.sign(
			{
				email: user.email,
				userId: user._id.toString(),
			},
			"somesupersecret",
			{ expiresIn: "1hr" }
		);

		res.status(200).json({
			token: token,
			user: user,
		});
	} catch (err) {
		res.status(500);
		console.log(err);
	}
};

exports.fetchUser = async (req, res, next) => {
	if (!req.isAuth) {
		throw new Error("Not Authenticated");
	}
	if (!req.body.userId) {
		throw new Error("Failed to Fetch");
	}
	try {
		const user = await User.findById(req.body.userId);

		if (!user) {
			throw new Error("Failed to Fetch");
		}

		res.status(200).json({ user: user });
	} catch (err) {
		console.log(err);
		const error = new Error("Failed to Fetch User");
		throw error;
	}
};

// exports.fetchAllUsers = async (req, res, next) => {
//   if (!req.isAuth) {
//     const error = new Error('Not Authorized!');
//     console.log('Not Authorized!');
//     throw error;
//   }

//   try {
//     // const users = await User.find(u => u._id !== req.userId);
//     let users = await User.find();

//     users = users.filter(u => u._id.toString() !== req.userId);

//     res.status(200).json({ users });
//   } catch(err) {
//     console.log(err)
//   }
// };
