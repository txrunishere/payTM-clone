import { Router } from "express";
import {
  getBalance,
  transferBalance,
} from "../controllers/account.controller.js";

const router = Router();

router.route("/balance").get(getBalance);
router.route("/transfer").post(transferBalance);

export default router;
