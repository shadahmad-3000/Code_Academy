import { Router } from "express";
import {
  createNewUser,
  bulkVerifyUsers,
  verifyUser,
  usersAdmin,
  allAdmins,
  updateUserProfile,
  allTeachers
} from "../controllers/user.controller.js";
import {
  isStellar,
  isGalactic,
  verifyToken,
} from "../middlewares/authJwt.middleware.js";
import { checkExistingUser } from "../middlewares/verifySignup.middleware.js";

const router = Router();

router.post("/create-new-admin", checkExistingUser, createNewUser);

router.put("/bulk-verified", checkExistingUser, bulkVerifyUsers);

router.put("/verified/:id", checkExistingUser, verifyUser);

router.put("/update-profile/:userId", updateUserProfile);

router.get("/admins/all", checkExistingUser, allAdmins);

router.get("/teachers/all", checkExistingUser, allTeachers);

router.post("/users-admin/:idcard", checkExistingUser, usersAdmin);

export default router;
