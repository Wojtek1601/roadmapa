import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";

// Mock PrismaClient - must be defined before jest.mock hoisting
const mockUserModel = {
  findUnique: jest.fn(),
  create: jest.fn(),
};

const mockProjectRoleModel = {
  findUnique: jest.fn(),
  upsert: jest.fn(),
};

const mockProjectModel = {
  findUnique: jest.fn(),
};

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: mockUserModel,
      projectRole: mockProjectRoleModel,
      project: mockProjectModel,
    })),
    Role: { ADMIN: "ADMIN", PROJECT_MANAGER: "PROJECT_MANAGER", DEVELOPER: "DEVELOPER", VIEWER: "VIEWER" },
  };
});

// Import app AFTER mock setup
import app from "../app";

const mockUser = {
  id: "user-uuid-1",
  email: "test@example.com",
  password: "",
  name: "Test User",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  it("should register a new user successfully", async () => {
    mockUserModel.findUnique.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      createdAt: mockUser.createdAt,
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.name).toBe("Test User");
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });

  it("should return 409 if email is already taken", async () => {
    mockUserModel.findUnique.mockResolvedValue(mockUser);

    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email jest już zajęty");
  });

  it("should return 400 for invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "invalid-email",
      password: "password123",
      name: "Test User",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 for short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "123",
      name: "Test User",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 for missing name", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should hash the password before saving", async () => {
    mockUserModel.findUnique.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      createdAt: mockUser.createdAt,
    });

    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const createCall = mockUserModel.create.mock.calls[0][0];
    const savedPassword = createCall.data.password;
    expect(savedPassword).not.toBe("password123");
    const isHashed = await bcrypt.compare("password123", savedPassword);
    expect(isHashed).toBe(true);
  });
});

describe("POST /api/auth/login", () => {
  it("should login successfully with correct credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    mockUserModel.findUnique.mockResolvedValue({
      ...mockUser,
      password: hashedPassword,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });

  it("should return 401 for wrong password", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    mockUserModel.findUnique.mockResolvedValue({
      ...mockUser,
      password: hashedPassword,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Nieprawidłowy email lub hasło");
  });

  it("should return 401 for non-existent email", async () => {
    mockUserModel.findUnique.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Nieprawidłowy email lub hasło");
  });

  it("should return 400 for invalid email format", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 for empty password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("GET /api/auth/me", () => {
  it("should return current user with valid token", async () => {
    const token = jwt.sign({ userId: mockUser.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    mockUserModel.findUnique.mockResolvedValue({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      createdAt: mockUser.createdAt,
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.name).toBe("Test User");
  });

  it("should return 401 without token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Brak tokenu autoryzacji");
  });

  it("should return 401 with invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Nieprawidłowy token");
  });

  it("should return 401 with malformed authorization header", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "NotBearer token");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Brak tokenu autoryzacji");
  });
});

describe("POST /api/auth/projects/:projectId/roles", () => {
  const projectId = "project-uuid-1";

  it("should assign a role when user is admin", async () => {
    const token = jwt.sign({ userId: mockUser.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    // Mock role check - user is ADMIN
    mockProjectRoleModel.findUnique.mockResolvedValueOnce({
      id: "role-1",
      role: "ADMIN",
      userId: mockUser.id,
      projectId,
    });

    // Mock user exists
    mockUserModel.findUnique.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440001",
      email: "target@example.com",
      name: "Target User",
    });

    // Mock project exists
    mockProjectModel.findUnique.mockResolvedValue({
      id: projectId,
      name: "Test Project",
    });

    // Mock role assignment
    mockProjectRoleModel.upsert.mockResolvedValue({
      id: "role-2",
      role: "DEVELOPER",
      userId: "550e8400-e29b-41d4-a716-446655440001",
      projectId,
      user: { id: "550e8400-e29b-41d4-a716-446655440001", email: "target@example.com", name: "Target User" },
      project: { id: projectId, name: "Test Project" },
    });

    const res = await request(app)
      .post(`/api/auth/projects/${projectId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440001",
        role: "DEVELOPER",
      });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("DEVELOPER");
  });

  it("should return 403 when user is not admin", async () => {
    const token = jwt.sign({ userId: mockUser.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    mockProjectRoleModel.findUnique.mockResolvedValueOnce({
      id: "role-1",
      role: "DEVELOPER",
      userId: mockUser.id,
      projectId,
    });

    const res = await request(app)
      .post(`/api/auth/projects/${projectId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440001",
        role: "VIEWER",
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Brak uprawnień do wykonania tej operacji");
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app)
      .post(`/api/auth/projects/${projectId}/roles`)
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440001",
        role: "DEVELOPER",
      });

    expect(res.status).toBe(401);
  });

  it("should return 400 for invalid role value", async () => {
    const token = jwt.sign({ userId: mockUser.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    mockProjectRoleModel.findUnique.mockResolvedValueOnce({
      id: "role-1",
      role: "ADMIN",
      userId: mockUser.id,
      projectId,
    });

    const res = await request(app)
      .post(`/api/auth/projects/${projectId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440001",
        role: "INVALID_ROLE",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("GET /api/health", () => {
  it("should return health status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
