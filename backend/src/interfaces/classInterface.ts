import { Prisma } from "@prisma/client";
import { DateInput } from "./common";

export type ClassResponse = Prisma.ClassGetPayload<{
	include: {
		teacher: {
			include: {
				person: true;
			};
		};
		students: {
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

export interface CreateClassData {
	name: string;
	description?: string | null;
	teacherId: number;
	schedule?: string | null;
	startDate?: DateInput;
	endDate?: DateInput | null;
}

export interface UpdateClassData {
	name?: string;
	description?: string | null;
	teacherId?: number;
	schedule?: string | null;
	startDate?: DateInput;
	endDate?: DateInput | null;
	isActive?: boolean;
}
