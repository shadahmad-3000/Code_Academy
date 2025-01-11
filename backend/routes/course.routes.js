import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseTeacherById
} from "../controllers/course.controller.js";
import {
  isStellar,
  isGalactic,
  verifyToken,
} from "../middlewares/authJwt.middleware.js";

const router = Router();

// Create a new course
router.post("/create", createCourse);

// Get all courses (authenticated users)
router.get("/all", getAllCourses);

// Get a specific course by ID (authenticated users)
router.get("/:id", getCourseById);

// Get a specific course by ID (authenticated users)
router.get("/teacher/:id", getCourseTeacherById);

// Update a course 
router.put("/update/:id", updateCourse);

// Delete a course 
router.delete("/delete/:id", deleteCourse);

export default router;