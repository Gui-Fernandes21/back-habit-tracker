const User = require("../models/user.js");
const bcrypt = require("bcrypt");

exports.getUserProfile = async (req, res, next) => {
	if (!req.isAuth) {
		return res.status(403).json({ message: "Not Authorized" });
	}

	const userId = req.userId;

	if (!userId) {
		return res.status(400).json({ message: "No user found" });
	}
	try {
		const user = await User.findById(userId).select([
			"email",
			"name",
			"profilePicture",
		]);

		res.status(200).json({ user });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Failed to Fetch User" });
	}
};

exports.uploadProfilePicture = async (req, res) => {
	if (!req.isAuth) {
		return res.status(403).json({ message: "Not Authorized" });
	}

	const userId = req.userId;

	if (!userId) {
		return res.status(400).json({ message: "No user found" });
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "No user found" });
	}

	const profilePictureUrl = req.body.path;

	if (!profilePictureUrl) {
		return res.status(400).json({ message: "No file uploaded" });
	}

	user.profilePicture = profilePictureUrl;

	await user.save();

	res.status(200).json({ message: "Profile picture uploaded successfully" });
};

exports.updateUserDetails = async (req, res) => {
	if (!req.isAuth) {
		return res.status(403).json({ message: "Not Authorized" });
	}

	const userId = req.userId;

	if (!userId) {
		return res.status(400).json({ message: "No user found" });
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "No user found" });
	}

	const { name, email } = req.body;

	if (!name || !email) {
		return res.status(400).json({ message: "Invalid user data" });
	}

	if (user.email !== email) {
		user.email = email;
	}

	if (user.name !== name) {
		user.name = name;
	}

	await user.save();

	res.status(200).json({ message: "User details updated successfully", user });
};

exports.updatePassword = async (req, res) => {
	if (!req.isAuth) {
		return res.status(403).json({ message: "Not Authorized" });
	}

	const userId = req.userId;

	if (!userId) {
		return res.status(400).json({ message: "No user found" });
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "No user found" });
	}

	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: "Invalid password data" });
	}

	const isMatch = await bcrypt.compare(currentPassword, user.password);
    
	if (!isMatch) {
    return res.status(400).json({ message: "Current Password does not match the actual current password." });
	}

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
	user.password = hashedNewPassword;

	await user.save();

	res.status(200).json({ message: "Password updated successfully" });
};
