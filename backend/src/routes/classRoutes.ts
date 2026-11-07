import {Router} from "express";
import { 
    createClass, 
    getAllClasses, 
    getClassById, 
    updateClass, 
    deleteClass, 
    getClassesByTeacherId,
    enrollStudent,
    removeStudent,
    getClassStudents
} from "../controllers/classControllers";
import { getClassGradebook, upsertClassGrades } from "../controllers/gradeControllers";
import { verifyIsTeacher } from "../middlewares/rolesMiddleware";

const router = Router();

router.post("/", verifyIsTeacher, createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", verifyIsTeacher, updateClass);
router.delete("/:id", verifyIsTeacher, deleteClass);
router.get("/teacher/:teacherId", verifyIsTeacher, getClassesByTeacherId);
router.post("/:id/students", verifyIsTeacher, enrollStudent);      
router.delete("/:id/students/:studentId", verifyIsTeacher, removeStudent); 
router.get("/:id/students", getClassStudents);
router.get("/:id/grades", verifyIsTeacher, getClassGradebook);
router.put("/:id/grades", verifyIsTeacher, upsertClassGrades);

export default router
