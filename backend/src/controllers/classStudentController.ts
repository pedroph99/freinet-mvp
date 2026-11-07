import { Request, Response } from "express";
import * as classStudentModel from "../models/classStudentModel";
import { getClassById } from "../models/classModels";

export async function enrollStudent(req: Request, res: Response) {
    try {
        const classId = Number(req.params.id);
        const { studentId } = req.body;

        if (isNaN(classId)) {
            return res.status(400).json({ error: "Invalid class ID" });
        }

        if (!studentId || isNaN(Number(studentId))) {
            return res.status(400).json({ error: "studentId is required" });
        }

        const classExists = await getClassById(classId);
        if (!classExists) {
            return res.status(404).json({ error: "Class not found" });
        }

        const alreadyEnrolled = await classStudentModel.isStudentEnrolled(classId, Number(studentId));
        if (alreadyEnrolled) {
            return res.status(409).json({ error: "Student is already enrolled in this class" });
        }

        const enrollment = await classStudentModel.enrollStudent(classId, Number(studentId));

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

        if (isNaN(classId) || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid class ID or student ID" });
        }

        const isEnrolled = await classStudentModel.isStudentEnrolled(classId, studentId);
        if (!isEnrolled) {
            return res.status(404).json({ error: "Student is not enrolled in this class" });
        }

        await classStudentModel.removeStudent(classId, studentId);

        res.status(200).json({ message: "Student removed from class successfully" });
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

        const classExists = await getClassById(classId);
        if (!classExists) {
            return res.status(404).json({ error: "Class not found" });
        }

        const enrollments = await classStudentModel.getClassStudents(classId);

        res.status(200).json({
            classId,
            className: classExists.name,
            totalStudents: enrollments.length,
            students: enrollments.map(e => ({
                enrollmentId: e.id,
                enrolledAt: e.enrolledAt,
                student: {
                    id: e.student.id,
                    name: e.student.person.name,
                    email: e.student.person.email,
                    phone: e.student.person.phone,
                    photo: e.student.photo,
                    registrationNumber: e.student.registrationNumber,
                    status: e.student.status
                }
            }))
        });
    } catch (error) {
        res.status(500).json({ error: `Error fetching students: ${(error as Error).message}` });
    }
}
