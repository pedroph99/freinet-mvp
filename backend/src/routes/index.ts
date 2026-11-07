import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import studentRoutes from "./studentRoutes";
import classRoutes from "./classRoutes";
import attendanceRoutes from "./attendanceRoutes";
import classStudentRoutes from "./classStudentRoutes";
import teacherRoutes from "./teacherRoutes";
import lessonRoutes from "./lessonRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/class-students", classStudentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/lessons", lessonRoutes);

export default router;