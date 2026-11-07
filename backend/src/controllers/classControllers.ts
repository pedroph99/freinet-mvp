import { Request, Response } from "express";
import { getTeacherById } from "../models/teacherModels";
import * as classModel from "../models/classModels";

export async function createClass(req: Request, res: Response) {
    try {
        const data = req.body;

        if (!data.name) {
            return res.status(400).json({ error: "Missing required fields: name" });
        }

        if (req.user?.role !== "TEACHER") {
            return res.status(403).json({ error: "You do not have permission to create a class for this teacher" });
        }

        const teacherId = data.teacherId || req.user?.teacherId;

        const teacher = await getTeacherById(teacherId);

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        const newClass = await classModel.createClass({...data, teacherId });

        res.status(201).json({ message: "Class created successfully", class: newClass });

        if (!newClass) {
            return res.status(500).json({ error: "Error creating class" });
        }
    } catch (error) {
        res.status(500).json({ error: `Error creating class: ${(error as Error).message}` });
    }
}

export async function getAllClasses(req: Request, res: Response) {
    try {
        const classes = await classModel.getAllClasses();

        if (!classes) {
            return res.status(404).json({ error: "No classes found" });
        }

        res.status(200).json({ classes });

    } catch (error) {
        res.status(500).json({ error: `Error fetching classes: ${(error as Error).message}` });
    }
}

export async function getClassById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const foundClass = await classModel.getClassById(id);

        if (!foundClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        return res.status(200).json({ class: foundClass });

    } catch (error) {
        return res.status(500).json({ 
            error: `Error fetching class: ${(error as Error).message}` 
        });
    }
}

export async function updateClass(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const updatedClass = await classModel.updateClass(Number(id), data);

        if (!updatedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.status(200).json({ message: "Class updated successfully", class: updatedClass });

    } catch (error) {
        res.status(500).json({ error: `Error updating class: ${(error as Error).message}` });
    }
}


export async function deleteClass(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const deletedClass = await classModel.deleteClass(Number(id));

        if (!deletedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.status(200).json({ message: "Class deleted successfully", class: deletedClass });

    } catch (error) {
        res.status(500).json({ error: `Error deleting class: ${(error as Error).message}` });
    }
}

export async function getClassesByTeacherId(req: Request, res: Response) {
    try {
        const teacherId = req.user?.role === "TEACHER" ? req.user.teacherId : Number(req.params.teacherId);

        if (!teacherId) {
            return res.status(400).json({ error: "Teacher ID is required" });
        }

        if (isNaN(teacherId)) {
            return res.status(400).json({ error: "Invalid teacher ID" });
        }

        const classes = await classModel.getAllClassesByTeacherId(teacherId);

        if (!classes) {
            return res.status(404).json({ error: "No classes found for this teacher" });
        }

        res.status(200).json({ classes });

    } catch (error) {
        res.status(500).json({ error: `Error fetching classes: ${(error as Error).message}` });
    }
}

export async function enrollStudent(req: Request, res: Response) {
    try {
        const classId = Number(req.params.id);
        const { studentId } = req.body;

        if (isNaN(classId)) {
            return res.status(400).json({ error: "Invalid class ID" });
        }

        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        const classExists = await classModel.getClassById(classId);
        if (!classExists) {
            return res.status(404).json({ error: "Class not found" });
        }

        const isEnrolled = await classModel.isStudentEnrolled(classId, studentId);
        if (isEnrolled) {
            return res.status(409).json({ error: "Student already enrolled in this class" });
        }

        const enrollment = await classModel.enrollStudent(classId, studentId);

        res.status(201).json({
            message: "Student enrolled successfully",
            enrollment: {
                id: enrollment.id,
                enrolledAt: enrollment.enrolledAt,
                student: {
                    id: enrollment.student.id,
                    name: enrollment.student.person.name,
                    photo: enrollment.student.photo,
                    registrationNumber: enrollment.student.registrationNumber
                },
                class: {
                    id: enrollment.class.id,
                    name: enrollment.class.name
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: `Error enrolling student: ${(error as Error).message}` });
    }
}

export async function removeStudent(req: Request, res: Response) {
    try {
        const classId = Number(req.params.id);
        const studentId = Number(req.params.studentId);

        if (isNaN(classId)) {
            return res.status(400).json({ error: "Invalid class ID" });
        }

        if (isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const isEnrolled = await classModel.isStudentEnrolled(classId, studentId);
        if (!isEnrolled) {
            return res.status(404).json({ error: "Student not enrolled in this class" });
        }

        await classModel.removeStudent(classId, studentId);

        res.status(200).json({ message: "Student removed successfully" });
    } catch (error) {
        res.status(500).json({ error: `Error removing student: ${(error as Error).message}` });
    }
}

export async function getClassStudents(req: Request, res: Response) {
    try {
        const classId = Number(req.params.id);

        if (isNaN(classId)) {
            return res.status(400).json({ error: "Invalid class ID" });
        }

        const classExists = await classModel.getClassById(classId);
        if (!classExists) {
            return res.status(404).json({ error: "Class not found" });
        }

        const enrollments = await classModel.getClassStudents(classId);

        const students = enrollments.map(enrollment => ({
            enrollmentId: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            student: {
                id: enrollment.student.id,
                name: enrollment.student.person.name,
                email: enrollment.student.person.email,
                phone: enrollment.student.person.phone,
                photo: enrollment.student.photo,
                registrationNumber: enrollment.student.registrationNumber,
                status: enrollment.student.status
            }
        }));

        res.status(200).json({
            classId,
            className: classExists.name,
            totalStudents: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({ error: `Error fetching students: ${(error as Error).message}` });
    }
}
