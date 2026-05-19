import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerController, loginController, logoutController } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router