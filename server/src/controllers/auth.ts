import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthRequest } from "../middleware/auth";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  assignRoleToUser,
} from "../services/auth";
import { Role } from "@prisma/client";

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password, name } = req.body;
    const result = await registerUser({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Email jest już zajęty") {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Błąd serwera" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Nieprawidłowy email lub hasło"
    ) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Błąd serwera" });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await getCurrentUser(req.userId!);
    res.json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Użytkownik nie został znaleziony"
    ) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Błąd serwera" });
  }
}

export async function assignRole(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { userId, role } = req.body;
    const projectId = req.params.projectId as string;
    const result = await assignRoleToUser({
      userId,
      role: role as Role,
      projectId,
    });
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Użytkownik nie został znaleziony") {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === "Projekt nie został znaleziony") {
        res.status(404).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: "Błąd serwera" });
  }
}
