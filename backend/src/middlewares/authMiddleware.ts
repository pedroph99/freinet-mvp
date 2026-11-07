import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import prisma from '../lib/prisma';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const public_paths = ['/auth/login', '/auth/register-teacher'];
        const normalizedPath = req.path.replace(/\/+$/, '') || '/';

        if (req.method === 'OPTIONS' || public_paths.includes(normalizedPath)) {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token missing" });
        }

        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(decoded.sub) },
            include: {
                person: {
                    include: {
                        studentProfile: true,
                        teacherProfile: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = {
            id: user.id,
            role: user.role,
            personId: user.personId,
            studentId: user.person.studentProfile?.id,
            teacherId: user.person.teacherProfile?.id
        };

        next();
    }
    catch (error) {
        res.status(500).json({ error: "Authentication failed" });
    }
}
