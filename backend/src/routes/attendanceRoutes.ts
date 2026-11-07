import { Router } from "express";
import {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getStudentAttendanceSummary
} from "../controllers/attendanceControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verifyIsTeacher } from "../middlewares/rolesMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/student/:studentId/summary", getStudentAttendanceSummary);
router.get("/", getAllAttendance);
router.get("/:id", getAttendanceById);
router.post("/", verifyIsTeacher, createAttendance);
router.patch("/:id", verifyIsTeacher, updateAttendance);
router.delete("/:id", verifyIsTeacher, deleteAttendance);

export default router;
