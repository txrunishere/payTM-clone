import { Router } from "express";
import {
  getBalance,
  transferBalance,
} from "../controllers/account.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/balance").get(getBalance);
router.route("/transfer").post(transferBalance);

export default router;
