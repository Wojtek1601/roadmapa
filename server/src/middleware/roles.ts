import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export function requireRole(...allowedRoles: Role[]) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.userId;
    const projectId = req.params.projectId;

    if (!userId) {
      res.status(401).json({ error: "Brak autoryzacji" });
      return;
    }

    if (!projectId) {
      res.status(400).json({ error: "Brak ID projektu" });
      return;
    }

    try {
      const projectRole = await prisma.projectRole.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: projectId as string,
          },
        },
      });

      if (!projectRole || !allowedRoles.includes(projectRole.role)) {
        res
          .status(403)
          .json({ error: "Brak uprawnień do wykonania tej operacji" });
        return;
      }

      next();
    } catch {
      res.status(500).json({ error: "Błąd serwera" });
    }
  };
}
