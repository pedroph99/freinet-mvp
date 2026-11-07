import { Response, Request } from "express";
import {
  getAllLessons,
  getLessonById,
  getLessonsByClassId,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../models/lessonModels";

export const getAllLessonsController = async (
  req: Request,
  res: Response
) => {
  try {
    const lessons = await getAllLessons();
    res.status(200).json({
      message: "Lessons retrieved successfully",
      data: lessons,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving lessons",
      error: error.message,
    });
  }
};

export const getLessonByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const lesson = await getLessonById(Number(id));

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      message: "Lesson retrieved successfully",
      data: lesson,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving lesson",
      error: error.message,
    });
  }
};

export const getLessonsByClassIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { classId } = req.params;
    const lessons = await getLessonsByClassId(Number(classId));

    res.status(200).json({
      message: "Lessons retrieved successfully",
      data: lessons,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving lessons",
      error: error.message,
    });
  }
};

export const createLessonController = async (
  req: Request,
  res: Response
) => {
  try {
    const { classId, date, topic, description, duration } = req.body;

    if (!classId || !date) {
      return res.status(400).json({
        message: "Missing required fields: classId and date",
      });
    }

    const newLesson = await createLesson({
      classId,
      date,
      topic,
      description,
      duration,
    });

    res.status(201).json({
      message: "Lesson created successfully",
      data: newLesson,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating lesson",
      error: error.message,
    });
  }
};

export const updateLessonController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { topic, description, date, duration } = req.body;

    const updatedLesson = await updateLesson(Number(id), {
      topic,
      description,
      date,
      duration,
    });

    res.status(200).json({
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating lesson",
      error: error.message,
    });
  }
};

export const deleteLessonController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const deletedLesson = await deleteLesson(Number(id));

    res.status(200).json({
      message: "Lesson deleted successfully",
      data: deletedLesson,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting lesson",
      error: error.message,
    });
  }
};
