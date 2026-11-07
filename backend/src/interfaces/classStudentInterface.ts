import { Prisma } from "@prisma/client";
import { DateInput } from "./common";

export type ClassStudentResponse = Prisma.ClassStudentGetPayload<{
	include: {
		class: true;
		student: {
			include: {
				person: true;
			};
		};
	};
}>;

export interface CreateClassStudentData {
	classId: number;
	studentId: number;
	enrolledAt?: DateInput;
}

export interface UpdateClassStudentData {
	classId?: number;
	studentId?: number;
	enrolledAt?: DateInput;
}
