import { Request, Response } from "express";
import * as attendanceModel from "../models/attendanceModels";

export async function getAllAttendance(req: Request, res: Response) {
    try {
        const records = await attendanceModel.getAllAttendance();
        res.status(200).json({ attendance: records });
    } catch (error) {
        res.status(500).json({ error: `Error fetching attendance: ${(error as Error).message}` });
    }
}

export async function getAttendanceById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid attendance ID" });
        }

        const record = await attendanceModel.getAttendanceById(id);

        if (!record) {
            return res.status(404).json({ error: "Attendance record not found" });
        }

        res.status(200).json({ attendance: record });
    } catch (error) {
        res.status(500).json({ error: `Error fetching attendance: ${(error as Error).message}` });
    }
}

export async function createAttendance(req: Request, res: Response) {
    try {
        const { studentId, lessonId, status, notes, checkedAt } = req.body;

        if (!studentId || !lessonId || !status) {
            return res.status(400).json({ error: "Missing required fields: studentId, lessonId, status" });
        }

        const validStatuses = ["PRESENT", "ABSENT", "JUSTIFIED", "LATE"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const newRecord = await attendanceModel.createAttendance({ studentId, lessonId, status, notes, checkedAt });

        res.status(201).json({
            message: "Attendance record created successfully",
            attendance: newRecord
        });
    } catch (error) {
        res.status(500).json({ error: `Error creating attendance: ${(error as Error).message}` });
    }
}

export async function updateAttendance(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { status, notes, checkedAt } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid attendance ID" });
        }

        if (!status && !notes) {
            return res.status(400).json({ error: "Provide at least status or notes to update" });
        }

        const validStatuses = ["PRESENT", "ABSENT", "JUSTIFIED", "LATE"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const existing = await attendanceModel.getAttendanceById(id);
        if (!existing) {
            return res.status(404).json({ error: "Attendance record not found" });
        }

        const updated = await attendanceModel.updateAttendance(id, { status, notes, checkedAt });

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance: updated
        });
    } catch (error) {
        res.status(500).json({ error: `Error updating attendance: ${(error as Error).message}` });
    }
}

export async function deleteAttendance(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid attendance ID" });
        }

        const existing = await attendanceModel.getAttendanceById(id);
        if (!existing) {
            return res.status(404).json({ error: "Attendance record not found" });
        }

        await attendanceModel.deleteAttendance(id);

        res.status(200).json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: `Error deleting attendance: ${(error as Error).message}` });
    }
}

export async function getStudentAttendanceSummary(req: Request, res: Response) {
    try {
        const studentId = Number(req.params.studentId);

        if (isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const [attended, missed] = await Promise.all([
            attendanceModel.countLessonsAttendedByStudent(studentId),
            attendanceModel.countLessonsMissedByStudent(studentId)
        ]);

        const total = attended + missed;
        const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

        res.status(200).json({
            studentId,
            summary: {
                total,
                present: attended,
                absent: missed,
                attendanceRate: `${attendanceRate}%`
            }
        });
    } catch (error) {
        res.status(500).json({ error: `Error fetching summary: ${(error as Error).message}` });
    }
}
