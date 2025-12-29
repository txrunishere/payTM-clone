import { Router } from "express";
import {
  handleUserSignIn,
  handleUserSignUp,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(handleUserSignUp);

router.route("/signin").post(handleUserSignIn);

export default router;
