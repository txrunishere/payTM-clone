import { Router } from "express";
import {
  handleUserSignIn,
  handleUserSignUp,
  handleUpdateUserDetails,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(handleUserSignUp);
router.route("/signin").post(handleUserSignIn);

router.route("/").put(authMiddleware, handleUpdateUserDetails);
router.route("/bulk").get(authMiddleware, getUsers);
router.route("/").get(authMiddleware, getUser);

export default router;
