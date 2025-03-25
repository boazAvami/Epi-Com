
import { IUser } from "./models/User";

declare global {
  namespace Express {
    interface Request {
        userId?: string | null; // Add the `user` property to the Request interface
    }
  }
}
