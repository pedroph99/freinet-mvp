import { Router } from "express";
import {
  getAllLessonsController,
  getLessonByIdController,
  getLessonsByClassIdController,
  createLessonController,
  updateLessonController,
  deleteLessonController,
} from "../controllers/lessonControllers";
import { verifyIsTeacher } from "../middlewares/rolesMiddleware";

const router = Router();

router.get("/", getAllLessonsController);
router.get("/:id", getLessonByIdController);
router.get("/class/:classId", getLessonsByClassIdController);
router.post("/", verifyIsTeacher, createLessonController);
router.put("/:id", verifyIsTeacher, updateLessonController);
router.delete("/:id", verifyIsTeacher, deleteLessonController);

export default router;
