import { Request, Response, NextFunction } from "express";

export const authman = (req: Request, res: Response, next: NextFunction) => {
    // Unprotected routes
    if (req.path.startsWith("/auth/")) {
        return next();
    }
    if (req.path.startsWith("/ranking")) {
        return next();
    }

    // Normal routes
    if(!req.session.userId){
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    
    // Administrative routes
    if (req.path.startsWith("/admin/")) {
        // Accessible to all administrative roles
        if(req.session.userRole !== "DISTRICT_COORDINATOR" && req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
            res.status(403).json({ message: "Forbidden" });
            return;
        }
    }

    return next();
};

export default authman;