import { Request, Response } from 'express';
import * as teacherModel from '../models/teacherModels';

// Listar todos os professores
export async function getAllTeachers(req: Request, res: Response) {
    try {
        const teachers = await teacherModel.getAllTeachers();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
}

// Buscar professor por ID
export async function getTeacherById(req: Request, res: Response) {
    try {
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const teacherId = paramId ? parseInt(paramId) : req.user?.teacherId;
        
        if (!teacherId || isNaN(teacherId)) {
            return res.status(400).json({ error: "Invalid teacher ID" });
        }

        const teacher = await teacherModel.getTeacherById(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch teacher" });
    }
}

// Criar professor (Person + TeacherProfile + User) - COM LOGIN
export async function createTeacher(req: Request, res: Response) {
    try {
        const data = req.body;
        
        if (!data.name || !data.email || !data.password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newTeacher = await teacherModel.createTeacher(data);

        res.status(201).json({ 
            message: "Teacher created successfully", 
            teacher: newTeacher 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create teacher" });
    }
}

// Atualizar professor
export async function updateTeacher(req: Request, res: Response) {
    try {
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const teacherId = paramId ? parseInt(paramId) : req.user?.teacherId;
        const data = req.body;

        if (!teacherId || isNaN(teacherId)) {
            return res.status(400).json({ error: "Invalid teacher ID" });
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: "No data to update" });
        }

        const updatedTeacher = await teacherModel.updateTeacher(teacherId, data);
        res.status(200).json({ 
            message: "Teacher updated successfully", 
            teacher: updatedTeacher 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update teacher" });
    }
}

// Deletar professor
export async function deleteTeacher(req: Request, res: Response) {
    try {
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const teacherId = paramId ? parseInt(paramId) : 0;

        if (!teacherId || isNaN(teacherId)) {
            return res.status(400).json({ error: "Invalid teacher ID" });
        }

        await teacherModel.deleteTeacher(teacherId);
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete teacher" });
    }
}
