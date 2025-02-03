import { Session, SessionData } from "express-session";

declare module "express-session" {
    interface SessionData {
        authenticated?: boolean;
        
        userId?: number;
        userRole?: string;
        userDistrictAdmin?: {id: number; name: string} | null;

        captcha?: string;
    }
}