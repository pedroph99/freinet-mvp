import prisma from "../lib/prisma";
import {
  CreateLessonData,
  LessonResponse,
  UpdateLessonData,
} from "../interfaces/lessonInterface";

export const getAllLessons = async (): Promise<LessonResponse[]> => {
  const lessons = await prisma.lesson.findMany({
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return lessons;
};

export const getLessonById = async (lessonId: number): Promise<LessonResponse | null> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return lesson;
};

export const getLessonsByClassId = async (classId: number): Promise<LessonResponse[]> => {
  const lessons = await prisma.lesson.findMany({
    where: { classId },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return lessons;
};

export const createLesson = async (lessonData: CreateLessonData): Promise<LessonResponse> => {
  const newLesson = await prisma.lesson.create({
    data: {
      classId: lessonData.classId,
      date: new Date(lessonData.date),
      topic: lessonData.topic,
      description: lessonData.description,
      duration: lessonData.duration,
    },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return newLesson;
};

export const updateLesson = async (lessonId: number, lessonData: UpdateLessonData): Promise<LessonResponse> => {
  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      topic: lessonData.topic,
      description: lessonData.description,
      date: lessonData.date ? new Date(lessonData.date) : undefined,
      duration: lessonData.duration,
    },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return updatedLesson;
};

export const deleteLesson = async (lessonId: number) => {
  const deletedLesson = await prisma.lesson.delete({
    where: { id: lessonId },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return deletedLesson;
};
