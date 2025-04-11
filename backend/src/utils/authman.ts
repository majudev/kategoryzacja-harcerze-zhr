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

        // If district admin but no district set, return 500
        if(req.session.userRole === "DISTRICT_COORDINATOR" && (req.session.userDistrictAdmin === null || req.session.userDistrictAdmin === undefined)){
            res.status(500).json({ message: "you are supposedly district coordinator, but it seems your managed district id is unset" });
            return;
        }
    }

    return next();
};

export default authman;