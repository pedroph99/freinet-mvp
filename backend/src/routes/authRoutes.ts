import {Router} from "express";
import { getMe, login, registerTeacher } from "../controllers/authControllers";


const router = Router();

router.post("/login", login);
router.post("/register-teacher", registerTeacher);
router.get("/me", getMe)

export default router;