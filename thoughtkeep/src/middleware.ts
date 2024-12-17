import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must be less than 10 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be less than 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const validateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // schema.parse(req.body);
    next();
  } catch (error) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
    return;
  }
};

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  //@ts-ignore
  const decoded = jwt.verify(header as string, JWT_SECRET) as JwtPayload;
  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not logged in.",
    });
    return;
  }
};
