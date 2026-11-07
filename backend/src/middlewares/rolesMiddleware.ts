import { Request, Response, NextFunction } from 'express';


export async function verifyIsTeacher(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userRole = req.user.role;

        if (userRole !== 'TEACHER') {
            return res.status(403).json({ error: "Access denied: Teachers only" });
        }

        next();
    }
     catch (error) {
        res.status(500).json({ error: "Role verification failed" });
    }
}

export async function verifyIsStudent(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userRole = req.user.role;

        if (userRole !== 'STUDENT') {
            return res.status(403).json({ error: "Access denied: Students only" });
        }

        next();
    }
     catch (error) {
        res.status(500).json({ error: "Role verification failed" });
    }
}

export async function verifyIsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Access denied: Admins only" });
        }

        next();
    }
     catch (error) {
        res.status(500).json({ error: "Role verification failed" });
    }
}