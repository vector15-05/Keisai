import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerController, loginController, logoutController } from "../controllers/auth.controllers";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { validate } from "../middlewares/validationMiddleware";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout",logoutController);

export default router