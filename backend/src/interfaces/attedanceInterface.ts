import { AttendanceStatus, Prisma } from "@prisma/client";
import { DateInput } from "./common";

export type AttendanceResponse = Prisma.AttendanceGetPayload<{
	include: {
		student: {
			include: {
				person: true;
			};
		};
		lesson: {
			include: {
				class: true;
			};
		};
	};
}>;

export interface CreateAttendanceData {
	studentId: number;
	lessonId: number;
	status: AttendanceStatus;
	notes?: string | null;
	checkedAt?: DateInput;
}

export interface UpdateAttendanceData {
	status?: AttendanceStatus;
	notes?: string | null;
	checkedAt?: DateInput;
}

export interface AttendanceSummaryData {
	total: number;
	present: number;
	absent: number;
	attendanceRate: string;
}

export interface AttendanceSummaryResponse {
	studentId: number;
	summary: AttendanceSummaryData;
}
