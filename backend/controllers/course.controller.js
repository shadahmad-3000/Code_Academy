import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

export const createCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      startDate,
      endDate,
      selectedTeacher,
      studentIds // Array of identification numbers
    } = req.body;

    // Verify that selected Teacher is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(selectedTeacher)) {
      return res.status(400).json({
        message: 'The teacher ID is invalid'
      });
    }

    // Check the existence of all students by their ID number
    const existingStudents = await User.find({
      identification: { $in: studentIds }
    }).select('_id identification');

    // Check the existence of all students by their ID number
    const foundIdentifications = existingStudents.map(student =>
      student.identification
    );

    // Find ids that don't exist
    const nonExistentIdentifications = studentIds.filter(id =>
      !foundIdentifications.includes(id)
    );

    // If there are ids that do not exist, return error
    if (nonExistentIdentifications.length > 0) {
      return res.status(400).json({
        message: `The following student ID numbers do not exist: ${nonExistentIdentifications.join(', ')}`
      });
    }

    // Get the ObjectIds of the found students
    const studentObjectIds = existingStudents.map(student => student._id);
    const teacherId = new mongoose.Types.ObjectId(selectedTeacher);

    const newCourse = new Course({
      courseTitle,
      courseDescription,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      teacher: teacherId,
      students: studentObjectIds // Using the ObjectIds of the found students
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: 'Course created successfully',
    });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(400).json({
      message: 'Error creating course',
      error: error.message
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $addFields: {
          studentCount: { $size: "$students" }, // Add the student count
        },
      },
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "teacher", // Field in Course that references the teacher's _id
          foreignField: "_id", // Field in User that corresponds to the teacher's _id
          as: "teacherInfo", // Name of the new field where the teacher's information is stored
        },
      },
      {
        $unwind: "$teacherInfo", // Decomposes the `teacherInfo` array into an object
      },
    ]);

    if (!courses || courses.length === 0) {
      return res.status(400).json({
        message: "No courses found",
      });
    }

    console.log(courses); // Here you can see the full content of the result
    res.status(200).json(courses);
  } catch (error) {
    console.error(error); //Debugging log
    res.status(500).json({
      message: "Error fetching courses",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // First we look for the user and their role to know if they are a student or a teacher.
    const user = await User.findById(id).populate('roles');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // We determine if the user is a student or teacher
    const userRole = user.roles[0].name;

    const course = await Course.find({
      $or: [
        { students: id },
        { teacher: id }
      ]
    });

    if (!course || course.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // We prepare the response with user information
    const coursesWithDetails = await Promise.all(course.map(async (c) => {
      const courseObj = c.toObject();

      if (userRole === "1") { // If you are a student, we look for information about the teacher
        const teacher = await User.findById(c.teacher).select('name lastname');
        courseObj.teacherDetails = teacher ? {
          name: teacher.name,
          lastname: teacher.lastname
        } : null;
      } else if (userRole === "2") { //If you are a teacher, we look for information about students
        const students = await User.find({
          _id: { $in: c.students }
        }).select('name lastname');
        
        courseObj.studentsDetails = students.map(student => ({
          id: student._id,
          name: student.name,
          lastname: student.lastname
        }));
      }

      return courseObj;
    }));
    console.log(coursesWithDetails);
    res.status(200).json(coursesWithDetails);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching course',
      error: error.message
    });
  }
};

export const getCourseTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    // First, find the user and their role
    const user = await User.findById(id).populate('roles');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user role
    const userRole = user.roles[0].name;

    // Return 404 if user is not a teacher (role !== "2")
    if (userRole !== "2") {
      return res.status(404).json({ message: 'Only teachers can access this information' });
    }

    // Find courses where the user is either a student or teacher
    const course = await Course.find({
      $or: [
        { students: id },
        { teacher: id }
      ]
    });

    if (!course || course.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Prepare response with user details
    const coursesWithDetails = await Promise.all(course.map(async (c) => {
      const courseObj = c.toObject();
      
      // Since we now know it's a teacher, get students' details
      const students = await User.find({
        _id: { $in: c.students }
      }).select('name lastname');
      
      courseObj.studentsDetails = students.map(student => ({
        id: student._id,
        name: student.name,
        lastname: student.lastname
      }));

      return courseObj;
    }));

    console.log(coursesWithDetails);
    res.status(200).json(coursesWithDetails);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching course',
      error: error.message
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert date strings to Date objects if they exist
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    // If teacher is being updated, convert to ObjectId
    if (updateData.selectedTeacher) {
      updateData.teacher = new mongoose.Types.ObjectId(updateData.selectedTeacher);
      delete updateData.selectedTeacher;
    }

    // If students are being updated, convert to ObjectIds
    if (updateData.studentIds) {
      updateData.students = updateData.studentIds.map(id => new mongoose.Types.ObjectId(id));
      delete updateData.studentIds;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating course',
      error: error.message
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted successfully',
      course: deletedCourse
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting course',
      error: error.message
    });
  }
};