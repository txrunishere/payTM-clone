import { Router } from "express";
import {
  handleUserSignIn,
  handleUserSignUp,
  handleUpdateUserDetails,
  getUsers,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/bulk").get(getUsers);

router.route("/signup").post(handleUserSignUp);
router.route("/signin").post(handleUserSignIn);

router.route("/").put(authMiddleware, handleUpdateUserDetails);

export default router;
