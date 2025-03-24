import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";

 interface AuthRequest extends Request {
  userId: string ;
}



const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const excludedOperations = ['register', 'login'];

  // Check if the operation is register or login
  const operationName = req.body;
  console.log("boaz " + "operation name " + operationName)
  if (excludedOperations.includes(operationName)) {
    // Skip authentication for register and login
    return next();
  }

  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = decoded?.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export { authMiddleware, AuthRequest };
