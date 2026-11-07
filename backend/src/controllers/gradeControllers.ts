import { Request, Response } from "express";
import { GradeInput, GradeValues, gradeFields } from "../interfaces/gradeInterface";
import {
  extractGradeValues,
  getClassStudentEnrollments,
  getTeacherClassById,
  getTeacherClassGradebook,
  updateClassGrades,
} from "../models/gradeModels";
import { calculateGradeProgress } from "../utils/gradeCalculations";

function hasAtLeastOneGradeField(input: GradeInput): boolean {
  return gradeFields.some((field) => Object.prototype.hasOwnProperty.call(input, field));
}

function isValidGradeValue(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10);
}

function mergeGrades(base: GradeValues, input: GradeInput): GradeValues {
  return gradeFields.reduce<GradeValues>((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      acc[field] = input[field] ?? null;
      return acc;
    }

    acc[field] = base[field];
    return acc;
  }, { ...base });
}

function formatGradebook(classGradebook: NonNullable<Awaited<ReturnType<typeof getTeacherClassGradebook>>>) {
  return {
    class: {
      id: classGradebook.id,
      name: classGradebook.name,
      description: classGradebook.description,
      schedule: classGradebook.schedule,
      teacher: {
        id: classGradebook.teacher.id,
        name: classGradebook.teacher.person.name,
      },
    },
    students: classGradebook.students.map((enrollment) => {
      const grades = extractGradeValues(enrollment);
      const summary = calculateGradeProgress(grades);

      return {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        student: {
          id: enrollment.student.id,
          name: enrollment.student.person.name,
          registrationNumber: enrollment.student.registrationNumber,
          status: enrollment.student.status,
        },
        grades: {
          ...grades,
          ...summary,
        },
      };
    }),
  };
}

export async function getClassGradebook(req: Request, res: Response) {
  try {
    const classId = Number(req.params.id);
    const teacherId = req.user?.teacherId;

    if (!teacherId) {
      return res.status(403).json({ error: "Teacher profile not found" });
    }

    if (isNaN(classId)) {
      return res.status(400).json({ error: "Invalid class ID" });
    }

    const classGradebook = await getTeacherClassGradebook(classId, teacherId);

    if (!classGradebook) {
      return res.status(404).json({ error: "Class not found for this teacher" });
    }

    return res.status(200).json(formatGradebook(classGradebook));
  } catch (error) {
    return res.status(500).json({ error: `Error fetching class gradebook: ${(error as Error).message}` });
  }
}

export async function upsertClassGrades(req: Request, res: Response) {
  try {
    const classId = Number(req.params.id);
    const teacherId = req.user?.teacherId;
    const grades = req.body?.grades as GradeInput[] | undefined;

    if (!teacherId) {
      return res.status(403).json({ error: "Teacher profile not found" });
    }

    if (isNaN(classId)) {
      return res.status(400).json({ error: "Invalid class ID" });
    }

    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: "Request body must contain a non-empty grades array" });
    }

    const requestedClass = await getTeacherClassById(classId, teacherId);
    if (!requestedClass) {
      return res.status(404).json({ error: "Class not found for this teacher" });
    }

    const studentIds = grades.map((grade) => grade.studentId);
    const uniqueStudentIds = new Set(studentIds);

    if (uniqueStudentIds.size !== studentIds.length) {
      return res.status(400).json({ error: "Duplicate studentId values are not allowed" });
    }

    for (const grade of grades) {
      if (!Number.isInteger(grade.studentId) || grade.studentId <= 0) {
        return res.status(400).json({ error: "Each grade entry must have a valid studentId" });
      }

      if (!hasAtLeastOneGradeField(grade)) {
        return res.status(400).json({ error: `Student ${grade.studentId} must include at least one grade field` });
      }

      for (const field of gradeFields) {
        if (Object.prototype.hasOwnProperty.call(grade, field) && !isValidGradeValue(grade[field])) {
          return res.status(400).json({ error: `Field ${field} for student ${grade.studentId} must be a number between 0 and 10 or null` });
        }
      }
    }

    const enrollments = await getClassStudentEnrollments(classId, [...uniqueStudentIds]);
    if (enrollments.length !== grades.length) {
      return res.status(404).json({ error: "One or more students are not enrolled in this class" });
    }

    const enrollmentByStudentId = new Map(enrollments.map((enrollment) => [enrollment.studentId, enrollment]));

    for (const gradeInput of grades) {
      const currentEnrollment = enrollmentByStudentId.get(gradeInput.studentId);
      if (!currentEnrollment) {
        return res.status(404).json({ error: `Student ${gradeInput.studentId} is not enrolled in this class` });
      }

      const mergedGrades = mergeGrades(extractGradeValues(currentEnrollment), gradeInput);
      const progress = calculateGradeProgress(mergedGrades);
      const hasAllUnits =
        mergedGrades.u1 !== null && mergedGrades.u2 !== null && mergedGrades.u3 !== null;

      if (mergedGrades.recoveryExam !== null && !hasAllUnits) {
        return res.status(400).json({ error: `Student ${gradeInput.studentId} needs U1, U2 and U3 before recovery exam` });
      }

      if (progress.media1 !== null && progress.media1 >= 7 && mergedGrades.recoveryExam !== null) {
        return res.status(400).json({ error: `Student ${gradeInput.studentId} already reached media 7 and does not need recovery exam` });
      }

      if (mergedGrades.finalExam !== null && mergedGrades.recoveryExam === null) {
        return res.status(400).json({ error: `Student ${gradeInput.studentId} needs a recovery exam before final exam` });
      }

      if (progress.media2 !== null && progress.media2 >= 7 && mergedGrades.finalExam !== null) {
        return res.status(400).json({ error: `Student ${gradeInput.studentId} already reached media 7 after recovery and does not need final exam` });
      }
    }

    await updateClassGrades(classId, grades);
    const updatedGradebook = await getTeacherClassGradebook(classId, teacherId);

    if (!updatedGradebook) {
      return res.status(404).json({ error: "Class not found for this teacher" });
    }

    return res.status(200).json({
      message: "Grades updated successfully",
      ...formatGradebook(updatedGradebook),
    });
  } catch (error) {
    return res.status(500).json({ error: `Error updating grades: ${(error as Error).message}` });
  }
}
