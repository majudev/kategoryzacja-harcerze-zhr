import { Session, SessionData } from "express-session";

declare module "express-session" {
    interface SessionData {
        authenticated?: boolean;
        
        userId?: number;
        userRole?: "USER" | "DISTRICT_COORDINATOR" | "TOPLEVEL_COORDINATOR" | "ADMIN";
        userDistrictAdmin?: {id: number; name: string} | null;

        captcha?: string;
    }
}