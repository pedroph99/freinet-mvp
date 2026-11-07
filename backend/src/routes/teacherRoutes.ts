import { Router } from "express";
import {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from "../controllers/teacherControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verifyIsTeacher } from "../middlewares/rolesMiddleware";
import { getTeacherDashboard } from "../controllers/dashboardControllers";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", verifyIsTeacher, getTeacherDashboard);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", verifyIsTeacher, updateTeacher);
router.delete("/:id", verifyIsTeacher, deleteTeacher);

export default router;
