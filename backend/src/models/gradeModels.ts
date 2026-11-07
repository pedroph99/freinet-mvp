import prisma from "../lib/prisma";
import { GradeInput, GradeValues, gradeFields } from "../interfaces/gradeInterface";

const classGradebookInclude = {
  teacher: {
    include: {
      person: true,
    },
  },
  students: {
    include: {
      student: {
        include: {
          person: true,
        },
      },
    },
    orderBy: {
      student: {
        person: {
          name: "asc" as const,
        },
      },
    },
  },
};

export const getTeacherClassGradebook = async (classId: number, teacherId: number) => {
  return prisma.class.findFirst({
    where: {
      id: classId,
      teacherId,
    },
    include: classGradebookInclude,
  });
};

export const getTeacherClassById = async (classId: number, teacherId: number) => {
  return prisma.class.findFirst({
    where: {
      id: classId,
      teacherId,
    },
  });
};

export const getClassStudentEnrollments = async (classId: number, studentIds: number[]) => {
  return prisma.classStudent.findMany({
    where: {
      classId,
      studentId: {
        in: studentIds,
      },
    },
    include: {
      student: {
        include: {
          person: true,
        },
      },
    },
  });
};

export const updateClassGrades = async (classId: number, grades: GradeInput[]) => {
  await prisma.$transaction(
    grades.map((grade) =>
      prisma.classStudent.update({
        where: {
          classId_studentId: {
            classId,
            studentId: grade.studentId,
          },
        },
        data: gradeFields.reduce<Record<string, number | null | undefined>>((acc, field) => {
          if (Object.prototype.hasOwnProperty.call(grade, field)) {
            acc[field] = grade[field] ?? null;
          }
          return acc;
        }, {}),
      })
    )
  );
};

type GradeCarrier = {
  u1?: number | null;
  u2?: number | null;
  u3?: number | null;
  recoveryExam?: number | null;
  finalExam?: number | null;
};

export const extractGradeValues = (enrollment: GradeCarrier): GradeValues => ({
  u1: enrollment.u1 ?? null,
  u2: enrollment.u2 ?? null,
  u3: enrollment.u3 ?? null,
  recoveryExam: enrollment.recoveryExam ?? null,
  finalExam: enrollment.finalExam ?? null,
});
