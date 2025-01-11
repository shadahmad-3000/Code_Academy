import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { TOKEN_SECRET } from "../config.js";
import bcrypt from "bcryptjs";

export const signupHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Find the default role "1"
    const defaultRole = await Role.findOne({ name: "1" });
    if (!defaultRole) {
      return res.status(400).json({ message: "The default role does not exist." });
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user object with the default role
    const newUser = new User({
      email,
      password: passwordHash,
      roles: [defaultRole._id],
    });

    // Save the user to MongoDB
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, TOKEN_SECRET, {
      expiresIn: 86400, // 24 horas
    });

    // Respond with the user data and token
    return res.status(200).json({
      _id: savedUser._id,
      email: savedUser.email,
      roles: savedUser.roles,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


export const signinHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Request body email can be an email or username
    const userFound = await User.findOne({ email: email }).populate(
      "roles"
    );
    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect."],
      });
    }

    const token = jwt.sign({ id: userFound._id }, TOKEN_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    console.log(userFound.identification);

    res.json({
      _id: userFound._id,
      email: userFound.email,
      identification: userFound.identification,
      name: userFound.name,
      lastname: userFound.lastname,
      birth_date: userFound.birth_date,
      sgpi: userFound.sgpi,
      cgpi: userFound.cgpi,
      year: userFound.year,
      course: userFound.course,
      phone: userFound.phone,
      country: userFound.country,
      state: userFound.state,
      address: userFound.address,
      roles: userFound.roles,
      isRegistrationComplete: userFound.isRegistrationComplete,
      verified: userFound.verified,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      token
    });
  } catch (error) {
    console.log(error);
  }
};

export const completUser = async (req, res) => {
  try {
    const {
      identification,
      name,
      lastname,
      birth_date,
      sgpi,
      cgpi,
      year,
      course,
      phone,
      country,
      state,
      address,
    } = req.body;

    // Check if all required fields are present
    if (!identification || !name || !lastname || !birth_date || !sgpi ||
      !cgpi || !year || !course || !phone || !country || !state || !address) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const userId = req.params.userId; // We receive `userId` as a URL parameter

    // Check if a user with the same identification already exists
    const existingUser = await User.findOne({
      identification,
      _id: { $ne: userId }, // Exclude current user from search
    });

    if (existingUser) {
      return res.status(400).json({ message: "The ID is already in use." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user with the new information
    user.identification = identification;
    user.name = name;
    user.lastname = lastname;
    user.birth_date = birth_date;
    user.sgpi = sgpi;
    user.cgpi = cgpi;
    user.year = year;
    user.course = course;
    user.phone = phone;
    user.country = country;
    user.state = state;
    user.address = address;
    user.isRegistrationComplete = true;

    await user.save();

    // Reply with the desired information
    return res.json({
      message: "Registration completed successfully.",
      isRegistrationComplete: user.isRegistrationComplete,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const changePasswordHandler = async (req, res) => {
  try {
    const { _id, oldPassword, newPassword } = req.body;
    console.log(_id);
    // Search for the user by their ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "The previous password is incorrect." });
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Generate a new token
    const token = jwt.sign({ id: user._id }, TOKEN_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.json({ message: "Password updated successfully.", token });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password." });
  }
};

export const verify = async (req, res, next) => {
  const token = req.headers.authorization;

  // Check if a token was provided in the authorization header
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or incorrectly formatted authorization token." });
  }

  // Extract token from string "Bearer [token]"
  const tokenValue = token.split(" ")[1];

  try {
    // Verify the token and get the payload (includes the user id)
    const decoded = jwt.verify(tokenValue, TOKEN_SECRET);

    // Search for the user in the database
    const userFound = await User.findById(decoded.id);
    if (!userFound) {
      return res.status(401).json({ message: "User not found." });
    }

    // Assign the user to req.user so that it is available in the following routes
    req.user = userFound;
    // Move to next middleware or controller
    // Send user information to frontend
    return res.status(200).json({
      _id: userFound._id,
      email: userFound.email,
      identification: userFound.identification,
      name: userFound.name,
      lastname: userFound.lastname,
      birth_date: userFound.birth_date,
      sgpi: userFound.sgpi,
      cgpi: userFound.cgpi,
      year: userFound.year,
      course: userFound.course,
      phone: userFound.phone,
      country: userFound.country,
      state: userFound.state,
      address: userFound.address,
      roles: userFound.roles,
      isRegistrationComplete: userFound.isRegistrationComplete,
      verified: userFound.verified,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    return res.status(401).json({ message: "You are not authorized to perform this action. Please log in again." });
  }
};