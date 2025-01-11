import { Router } from "express";
import {
  signinHandler,
  signupHandler,
  changePasswordHandler,
  completUser,
  verify
} from "../controllers/auth.controller.js";
import {
  checkExistingRole,
  checkExistingUser,
} from "../middlewares/verifySignup.middleware.js";

import {
  verifyToken
} from "../middlewares/authJwt.middleware.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", signupHandler);

router.post("/signin", signinHandler);

router.get("/verify", verify);

router.put("/complete-registration/:userId", verifyToken, completUser);


router.post('/change-password', changePasswordHandler);

export default router;
