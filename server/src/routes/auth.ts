import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, me, assignRole } from "../controllers/auth";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import {
  registerValidation,
  loginValidation,
  assignRoleValidation,
} from "../validators/auth";
import { Role } from "@prisma/client";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Zbyt wiele żądań, spróbuj ponownie później" },
});

router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);
router.get("/me", authenticate, me);
router.post(
  "/projects/:projectId/roles",
  authenticate,
  requireRole(Role.ADMIN),
  assignRoleValidation,
  assignRole
);

export default router;
