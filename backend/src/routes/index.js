import { Router } from "express";

const router = Router();

import userRouter from "./user.route.js";

router.use("/users", userRouter);

export default router;
