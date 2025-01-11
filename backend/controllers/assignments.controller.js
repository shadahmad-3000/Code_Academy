import mongoose from 'mongoose';
import Assignment from '../models/assignments.model.js';
import Course from '../models/course.model.js';
import User from '../models/user.model.js'; // Assuming you have a User model

// Create a new assignment
export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      course,
      dueDate,
      userId
    } = req.body;

    // Verify the course is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'The userId ID is invalid'
      });
    }

    // Create new assignment
    const newAssignment = new Assignment({
      title,
      description,
      course,
      dueDate: new Date(dueDate),
      createdBy: userId,
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: savedAssignment
    });
  } catch (error) {
    console.error('Assignment creation error:', error);
    res.status(400).json({
      message: 'Error creating assignment',
      error: error.message
    });
  }
};

// Get all assignments for a specific course
export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: 'Invalid User ID',
      });
    }

    // Find the user to retrieve their course
    const user = await User.findById(courseId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Check if the user is associated with a course
    if (!user.course) {
      return res.status(404).json({
        message: 'No course associated with this user',
      });
    }

    // Find assignments for the specific course
    const assignments = await Assignment.find({ course: user.course })
      .populate('course', 'courseTitle') // Populate course title
      .populate('createdBy', 'name');   // Populate createdBy with name

    if (!assignments.length) {
      return res.status(404).json({
        message: 'No assignments found for this course',
      });
    }
    console.log(assignments);

    // Respond with the list of assignments
    res.status(200).json({
      message: 'Assignments retrieved successfully',
      totalAssignments: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    res.status(500).json({
      message: 'Error retrieving assignments',
      error: error.message,
    });
  }
};

// Get a single assignment by its ID
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    // Find the user and populate roles
    const user = await User.findById(objectId).populate('roles');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Find assignments created by the user
    const assignments = await Assignment.find({ createdBy: objectId });

    if (!assignments.length) {
      return res.status(404).json({
        message: 'No assignments found for this user',
      });
    }

    // Calculate the total number of assignments
    const totalAssignments = assignments.length;

    return res.status(200).json({
      message: 'Assignments retrieved successfully',
      totalAssignments, // Include the total count in the response
      assignments,
    });
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    return res.status(500).json({
      message: 'An error occurred while retrieving assignments',
      error: error.message,
    });
  }
};

// Update an assignment
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verify the assignment ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'The assignment ID is invalid'
      });
    }

    // Find and update the assignment
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error('Assignment update error:', error);
    res.status(400).json({
      message: 'Error updating assignment',
      error: error.message
    });
  }
};

// Delete an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the assignment ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'The assignment ID is invalid'
      });
    }

    // Find and delete the assignment
    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      message: 'Assignment deleted successfully',
      assignment: deletedAssignment
    });
  } catch (error) {
    console.error('Assignment deletion error:', error);
    res.status(400).json({
      message: 'Error deleting assignment',
      error: error.message
    });
  }
};