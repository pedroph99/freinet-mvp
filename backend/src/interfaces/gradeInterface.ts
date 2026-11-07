export const PASSING_GRADE = 7;

export const gradeFields = [
  "u1",
  "u2",
  "u3",
  "recoveryExam",
  "finalExam",
] as const;

export type GradeField = (typeof gradeFields)[number];

export type GradeLifecycleStatus =
  | "PENDING_UNITS"
  | "APPROVED_BY_MEDIA1"
  | "RECOVERY_REQUIRED"
  | "APPROVED_BY_RECOVERY"
  | "FINAL_EXAM_REQUIRED"
  | "APPROVED_BY_FINAL_EXAM"
  | "FAILED";

export interface GradeValues {
  u1: number | null;
  u2: number | null;
  u3: number | null;
  recoveryExam: number | null;
  finalExam: number | null;
}

export interface GradeInput {
  studentId: number;
  u1?: number | null;
  u2?: number | null;
  u3?: number | null;
  recoveryExam?: number | null;
  finalExam?: number | null;
}

export interface GradeComputationResult {
  media1: number | null;
  media2: number | null;
  media3: number | null;
  finalAverage: number | null;
  status: GradeLifecycleStatus;
}
