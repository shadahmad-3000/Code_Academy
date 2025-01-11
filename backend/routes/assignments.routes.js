import { Router } from "express";
import {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} from "../controllers/assignments.controller.js";
import {
  isStellar,
  isGalactic,
  verifyToken,
} from "../middlewares/authJwt.middleware.js";

const router = Router();

// Create a new assignment
router.post("/create", createAssignment);

// Get assignments for a specific course
router.get("/course/:courseId", getAssignmentsByCourse);

// Get a specific assignment by ID
router.get("/:id", getAssignmentById);

// Update an assignment 
router.put("/update/:id", updateAssignment);

// Delete an assignment 
router.delete("/delete/:id", deleteAssignment);

export default router;