import { Request, Response } from 'express';
import * as studentModel from '../models/studentModels';

// Listar todos os alunos (para admin/professor)
export async function getAllStudents(req: Request, res: Response) {
    try {
        const students = await studentModel.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
}


export async function getStudentById(req: Request, res: Response) {
    try {
 
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const studentId = paramId ? parseInt(paramId) : req.user?.studentId;
        
        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const student = await studentModel.getStudentById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch student" });
    }
}

export async function createStudent(req: Request, res: Response) {
    try {
        const data = req.body;
        
        if (!data.name || !data.registrationNumber || !data.responsibleName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newStudent = await studentModel.createStudent(data);

        res.status(201).json({ 
            message: "Student created successfully", 
            student: newStudent 
        });

        if (!newStudent) {
            return res.status(500).json({ error: "Failed to create student" });
        }
   
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create student" });
    }
}

// Atualizar aluno
export async function updateStudent(req: Request, res: Response) {
    try {
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const studentId = paramId ? parseInt(paramId) : req.user?.studentId;
        const data = req.body;

        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: "No data to update" });
        }

        const updatedStudent = await studentModel.updateStudent(studentId, data);
        res.status(200).json({ 
            message: "Student updated successfully", 
            student: updatedStudent 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update student" });
    }
}

// Deletar aluno
export async function deleteStudent(req: Request, res: Response) {
    try {
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const studentId = paramId ? parseInt(paramId) : 0;

        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        await studentModel.deleteStudent(studentId);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete student" });
    }
}

// Ativar acesso do aluno (criar login)
export async function activateStudentAccess(req: Request, res: Response) {
    try {
        const paramId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        const studentId = paramId ? parseInt(paramId) : 0;
        const { email, password } = req.body;

        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await studentModel.activateStudentAccess(studentId, { email, password });
        
        res.status(200).json({ 
            message: "Student access activated successfully",
            user: {
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to activate student access" });
    }
}