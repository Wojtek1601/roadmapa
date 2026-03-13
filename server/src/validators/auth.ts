import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Podaj prawidłowy adres email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi mieć co najmniej 6 znaków"),
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Nazwa jest wymagana"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Podaj prawidłowy adres email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Hasło jest wymagane"),
];

export const assignRoleValidation = [
  body("userId").isUUID().withMessage("Nieprawidłowy ID użytkownika"),
  body("role")
    .isIn(["ADMIN", "MEMBER", "VIEWER"])
    .withMessage("Rola musi być jedną z: ADMIN, MEMBER, VIEWER"),
];
