import {
  GradeComputationResult,
  GradeValues,
  PASSING_GRADE,
} from "../interfaces/gradeInterface";

function roundGrade(value: number): number {
  return Number(value.toFixed(2));
}

function hasAllUnitGrades(grades: GradeValues): boolean {
  return grades.u1 !== null && grades.u2 !== null && grades.u3 !== null;
}

export function calculateGradeProgress(grades: GradeValues): GradeComputationResult {
  const media1 = hasAllUnitGrades(grades)
    ? roundGrade((grades.u1! + grades.u2! + grades.u3!) / 3)
    : null;

  const media2 =
    media1 !== null && grades.recoveryExam !== null
      ? roundGrade((media1 + grades.recoveryExam) / 2)
      : null;

  const media3 =
    media2 !== null && grades.finalExam !== null
      ? roundGrade((media2 + grades.finalExam) / 2)
      : null;

  if (media1 === null) {
    return {
      media1,
      media2,
      media3,
      finalAverage: null,
      status: "PENDING_UNITS",
    };
  }

  if (media1 >= PASSING_GRADE) {
    return {
      media1,
      media2,
      media3,
      finalAverage: media1,
      status: "APPROVED_BY_MEDIA1",
    };
  }

  if (grades.recoveryExam === null || media2 === null) {
    return {
      media1,
      media2,
      media3,
      finalAverage: media1,
      status: "RECOVERY_REQUIRED",
    };
  }

  if (media2 >= PASSING_GRADE) {
    return {
      media1,
      media2,
      media3,
      finalAverage: media2,
      status: "APPROVED_BY_RECOVERY",
    };
  }

  if (grades.finalExam === null || media3 === null) {
    return {
      media1,
      media2,
      media3,
      finalAverage: media2,
      status: "FINAL_EXAM_REQUIRED",
    };
  }

  return {
    media1,
    media2,
    media3,
    finalAverage: media3,
    status: media3 >= PASSING_GRADE ? "APPROVED_BY_FINAL_EXAM" : "FAILED",
  };
}
