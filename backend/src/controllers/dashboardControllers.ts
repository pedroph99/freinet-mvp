import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { calculateGradeProgress } from "../utils/gradeCalculations";
import { extractGradeValues } from "../models/gradeModels";

export async function getTeacherDashboard(req: Request, res: Response) {
  const teacherId = req.user?.teacherId;
  if (!teacherId) return res.status(403).json({ error: "Teacher profile not found" });

  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: { person: true },
    });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const classes = await prisma.class.findMany({
      where: { teacherId },
      orderBy: { name: "asc" },
      include: {
        students: {
          include: {
            student: {
              include: {
                person: true,
                notes: {
                  where: { teacherId },
                  orderBy: { recordedAt: "desc" },
                  select: { id: true, type: true, content: true, recordedAt: true },
                },
              },
            },
          },
        },
        lessons: {
          include: { attendances: true },
          orderBy: { date: "asc" },
        },
      },
    });

    const result = classes.map((classroom) => {
      const attendanceByStudent = new Map<number, { absent: number; present: number; justified: number; late: number; recorded: number }>();
      for (const lesson of classroom.lessons) {
        for (const record of lesson.attendances) {
          const counts = attendanceByStudent.get(record.studentId) ?? { absent: 0, present: 0, justified: 0, late: 0, recorded: 0 };
          counts.recorded++;
          if (record.status === "ABSENT") counts.absent++;
          if (record.status === "PRESENT") counts.present++;
          if (record.status === "JUSTIFIED") counts.justified++;
          if (record.status === "LATE") counts.late++;
          attendanceByStudent.set(record.studentId, counts);
        }
      }

      const lessons = classroom.lessons.map((lesson) => {
        const records = new Map(lesson.attendances.map((record) => [record.studentId, record]));
        const attendance = classroom.students.map((enrollment) => {
          const record = records.get(enrollment.studentId);
          return {
            studentId: enrollment.studentId,
            name: enrollment.student.person.name,
            registrationNumber: enrollment.student.registrationNumber,
            photo: enrollment.student.photo,
            status: record?.status ?? null,
            notes: record?.notes ?? null,
          };
        });
        const present = attendance.filter((entry) => entry.status === "PRESENT").length;
        const absent = attendance.filter((entry) => entry.status === "ABSENT").length;
        const justified = attendance.filter((entry) => entry.status === "JUSTIFIED").length;
        const late = attendance.filter((entry) => entry.status === "LATE").length;
        const recorded = present + absent + justified + late;
        return {
          id: lesson.id,
          date: lesson.date,
          topic: lesson.topic,
          description: lesson.description,
          duration: lesson.duration,
          attendance,
          summary: {
            present, absent, justified, late, recorded,
            totalStudents: classroom.students.length,
            attendanceRate: recorded ? Number((((present + late) / recorded) * 100).toFixed(1)) : null,
          },
        };
      });

      return {
        id: classroom.id,
        name: classroom.name,
        schedule: classroom.schedule,
        lessonCount: classroom.lessons.length,
        lessons,
        students: classroom.students.map((enrollment) => {
          const student = enrollment.student;
          const grades = { ...extractGradeValues(enrollment), ...calculateGradeProgress(extractGradeValues(enrollment)) };
          const attendance = attendanceByStudent.get(student.id) ?? { absent: 0, present: 0, justified: 0, late: 0, recorded: 0 };
          return {
            id: student.id,
            name: student.person.name,
            registrationNumber: student.registrationNumber,
            status: student.status,
            photo: student.photo,
            email: student.person.email,
            phone: student.person.phone,
            birthDate: student.person.birthDate,
            responsibleName: student.responsibleName,
            responsiblePhone: student.responsiblePhone,
            emergencyContact: student.emergencyContact,
            notes: student.notes,
            grades,
            attendance: {
              ...attendance,
              absenceRate: attendance.recorded ? Number(((attendance.absent / attendance.recorded) * 100).toFixed(1)) : null,
            },
          };
        }),
      };
    });

    return res.json({
      teacher: { id: teacher.id, name: teacher.person.name, specialization: teacher.specialization },
      classes: result,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error fetching dashboard: ${(error as Error).message}` });
  }
}
