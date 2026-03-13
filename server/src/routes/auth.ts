import { Router } from "express";
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

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", authenticate, me);
router.post(
  "/projects/:projectId/roles",
  authenticate,
  requireRole(Role.ADMIN),
  assignRoleValidation,
  assignRole
);

export default router;
