const User = require("../models/user.js");

exports.getUserProfile = async (req, res, next) => {
	if (!req.isAuth) {
		return res.status(403).json({ message: "Not Authorized" });
	}

	const userId = req.userId;

	if (!userId) {
		return res.status(400).json({ message: "No user found" });
	}
	try {
		const user = await User.findById(userId).select(['email', 'name', 'profilePicture']);

		if (!user) {
			throw new Error("Failed to Fetch");
		}

		res.status(200).json({ user: user });
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

	const profilePicture = req.body.file;

	if (!profilePicture) {
		return res.status(400).json({ message: "No file uploaded" });
	}

	user.profilePicture = profilePicture.path;

	await user.save();

	res
		.status(200)
		.json({ message: "Profile picture uploaded successfully", user });
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

  user.name = name;
  user.email = email;

  await user.save();

  res.status(200).json({ message: "User details updated successfully", user });
};



// TODO - Integrate bcrypt to hash the password before saving it
// TODO - Add validation to check if the new password is the same as the old password with bcrypt
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

  const isMatch = await user.comparePasswords(currentPassword);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({ message: "Password updated successfully", user });
};