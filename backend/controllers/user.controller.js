import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Required to convert import.meta.url
import moment from "moment"; // To work with dates

// Get __dirname in ES6 using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNewUser = async (req, res) => {
  try {
    const { email, name, lastname, roles } = req.body;

    const emailFound = await User.findOne({ email });

    if (emailFound)
      return res.status(400).json({
        message: ["Email is already in use."],
      });

    const password = "12345678";

    const rolesFound = await Role.find({ name: { $in: roles } });

    // encrypting password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new User
    const user = new User({
      email,
      name,
      lastname,
      password: passwordHash,
      roles: rolesFound.map((role) => role._id),
    });

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error(error);
  }
};

export const bulkVerifyUsers = async (req, res) => {
  try {
    const { studentIds } = req.body;

    // Validate that IDs were received
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: "An array of student IDs is required.",
        success: false
      });
    }

    const results = {
      verified: [],
      errors: []
    };

    // Process each id in the array
    for (const identification of studentIds) {
      try {
        // Search and update user by ID
        const updatedUser = await User.findOneAndUpdate(
          { identification: identification },
          { verified: true },
          { new: true, runValidators: true }
        );

        if (updatedUser) {
          results.verified.push({
            _id: updatedUser._id,
            identification: updatedUser.identification,
            email: updatedUser.email,
            name: updatedUser.name,
            lastname: updatedUser.lastname
          });
        } else {
          results.errors.push({
            identification: identification,
            message: "User not found"
          });
        }
      } catch (error) {
        results.errors.push({
          identification: identification,
          message: "Error updating user",
          error: error.message
        });
      }
    }

    // Calculate statistics
    const stats = {
      total: studentIds.length,
      successful: results.verified.length,
      failed: results.errors.length
    };

    //Return results
    return res.status(200).json({
      message: "Verification process completed",
      stats,
      results,
      success: true
    });

  } catch (error) {
    console.error("Mass verification error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the ID was received
    if (!id) {
      return res.status(400).json({
        message: "Student ID is required.",
        success: false,
      });
    }

    // Search for user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Toggle the "verified" status
    const newVerifiedState = !user.verified;

    // Update the user with the new status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { verified: newVerifiedState },
      { new: true, runValidators: true }
    );

    // Return the updated user
    return res.status(200).json({
      message: `User verification status set to ${newVerifiedState}`,
      data: {
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        lastname: updatedUser.lastname,
        verified: updatedUser.verified,
      },
      success: true,
    });
  } catch (error) {
    // If the error is invalid ID
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
        error: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {
      identification,
      email,
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

    // Validate that all required fields are present
    const requiredFields = [
      identification, email, name, lastname, birth_date,
      sgpi, cgpi, year, course, phone, country, state, address
    ];
    if (requiredFields.some(field => !field)) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log(user);

    // Preparing update results
    let updateResults = {
      profileUpdated: false,
      emailUpdated: false,
      identificationUpdated: false,
    };

    // Check if the ID is in use
    const existingIdentification = await User.findOne({
      identification,
      _id: { $ne: userId },
    });

    if (!existingIdentification) {
      // We only update if the ID is different
      if (user.identification !== identification) {
        user.identification = identification;
        updateResults.identificationUpdated = true;
      }
    }

    // Check if the email is in use
    const existingEmail = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (!existingEmail) {
      // We only update if the email is different
      if (user.email !== email) {
        user.email = email;
        updateResults.emailUpdated = true;
      }
    }

    // Update profile details
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
    updateResults.profileUpdated = true;

    await user.save();

    // Prepare response message
    let message = "Profile updated successfully.";
    if (updateResults.identificationUpdated && updateResults.emailUpdated) {
      message = "Profile, identification, and email updated successfully.";
    } else if (updateResults.identificationUpdated) {
      message = "Profile and identification updated successfully. Email remains unchanged.";
    } else if (updateResults.emailUpdated) {
      message = "Profile and email updated successfully. Identification remains unchanged.";
    }

    return res.json({
      message,
      updateResults,
      isRegistrationComplete: user.isRegistrationComplete,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const usersAdmin = async (req, res) => {
  try {
    const { idcard } = req.params;

    const formatIdentification = "V-" + idcard;

    // Performs the query to obtain the users with the provided ID
    const user = await Empren.findOne({
      identification: formatIdentification,
    }).lean();
    if (!user || user.length === 0) {
      // If no results were found, send a 404 status response
      return res.status(404).json({ message: ["No users found."] });
    }

    // Returns results in JSON format
    return res.json(user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const allAdmins = async (req, res) => {
  try {
    const users = await User.find()
      .populate("roles")
      .lean();

    if (!users || users.length === 0) {
      return res.status(400).json({
        message: ["No users found."],
      });
    }

    // Transform users data to include role numbers and status
    const usersWithRoleInfo = users.map((user) => {
      // Convert role names to numbers
      const roleNumbers = user.roles.map((role) => {
        switch (role.name.toLowerCase()) {
          case '1':
            return "student";
          case '2':
            return "teacher";
          case '3':
            return "admin";
          default:
            return 0;
        }
      });

      // Return transformed user object
      return {
        ...user,
        roleNumbers, // Array of role numbers [1,2,3]
        roleNames: user.roles.map(role => role.name), // Array of role names ['student','teacher','admin']
        verified: user.verified ? "Verified" : "Not verified" 
      };
    });

    return res.json({
      success: true,
      data: usersWithRoleInfo,
      message: "Users successfully recovered."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const allTeachers = async (req, res) => {
  try {
    // Get the ID of the "teacher" role
    const teacherRole = await Role.findOne({ name: "2" });

    if (!teacherRole) {
      return res.status(400).json({
        message: ["Role 'teacher' not found."],
      });
    }

    // Search for users who have the role of "teacher"
    const teachers = await User.find({ roles: teacherRole._id })
      .populate("roles") // To obtain the role data if necessary
      .lean(); // We use lean to get simple objects, without Mongoose methods

    if (!teachers || teachers.length === 0) {
      return res.status(400).json({
        message: ["No teachers found."],
      });
    }

    return res.json({
      success: true,
      data: teachers, // Returns the complete user data
      message: "Teachers successfully recovered.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  return res.json(user);
};

