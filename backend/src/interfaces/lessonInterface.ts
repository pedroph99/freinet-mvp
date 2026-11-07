import { Prisma } from "@prisma/client";
import { DateInput } from "./common";

export type LessonResponse = Prisma.LessonGetPayload<{
	include: {
		class: {
			include: {
				teacher: {
					include: {
						person: true;
					};
				};
			};
		};
		attendances: {
			include: {
				student: {
					include: {
						person: true;
					};
				};
			};
		};
	};
}>;

export interface CreateLessonData {
	classId: number;
	date: DateInput;
	topic?: string | null;
	description?: string | null;
	duration?: number | null;
}

export interface UpdateLessonData {
	classId?: number;
	date?: DateInput;
	topic?: string | null;
	description?: string | null;
	duration?: number | null;
}
