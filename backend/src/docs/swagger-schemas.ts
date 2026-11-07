const swaggerSchemas = {
  ErrorResponse: {
    type: "object",
    properties: {
      error: { type: "string" },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", example: "teacher@school.com" },
      password: { type: "string", example: "secret123" },
    },
  },
  RegisterTeacherRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string", example: "Maria Silva" },
      email: { type: "string", example: "maria@school.com" },
      password: { type: "string", example: "secret123" },
      phone: { type: "string", nullable: true, example: "+5511999999999" },
      specialization: { type: "string", nullable: true, example: "Strength" },
      cpf: { type: "string", nullable: true, example: "12345678900" },
      birthDate: { type: "string", format: "date-time", nullable: true },
    },
  },
  StudentCreateRequest: {
    type: "object",
    required: ["name", "registrationNumber", "responsibleName"],
    properties: {
      name: { type: "string" },
      email: { type: "string", nullable: true },
      phone: { type: "string", nullable: true },
      cpf: { type: "string", nullable: true },
      birthDate: { type: "string", format: "date-time", nullable: true },
      registrationNumber: { type: "string" },
      photo: { type: "string", nullable: true, example: "https://i.pravatar.cc/300?img=1" },
      responsibleName: { type: "string" },
      responsiblePhone: { type: "string", nullable: true },
      emergencyContact: { type: "string", nullable: true },
    },
  },
  StudentUpdateRequest: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      cpf: { type: "string" },
      birthDate: { type: "string", format: "date-time" },
      photo: { type: "string", nullable: true, example: "https://i.pravatar.cc/300?img=1" },
      responsibleName: { type: "string" },
      responsiblePhone: { type: "string" },
      emergencyContact: { type: "string" },
      status: { type: "string", enum: ["ACTIVE", "INACTIVE", "SUSPENDED"] },
    },
  },
  TeacherCreateRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      phone: { type: "string", nullable: true },
      cpf: { type: "string", nullable: true },
      birthDate: { type: "string", format: "date-time", nullable: true },
      specialization: { type: "string", nullable: true },
    },
  },
  ClassCreateRequest: {
    type: "object",
    required: ["name", "teacherId"],
    properties: {
      name: { type: "string" },
      description: { type: "string", nullable: true },
      teacherId: { type: "integer", example: 1 },
      schedule: { type: "string", nullable: true, example: "Mon/Wed/Fri 18:00" },
      startDate: { type: "string", format: "date-time" },
      endDate: { type: "string", format: "date-time", nullable: true },
    },
  },
  ClassUpdateRequest: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string", nullable: true },
      teacherId: { type: "integer" },
      schedule: { type: "string", nullable: true },
      startDate: { type: "string", format: "date-time" },
      endDate: { type: "string", format: "date-time", nullable: true },
      isActive: { type: "boolean" },
    },
  },
  LessonCreateRequest: {
    type: "object",
    required: ["classId", "date"],
    properties: {
      classId: { type: "integer", example: 1 },
      date: { type: "string", format: "date-time" },
      topic: { type: "string", nullable: true },
      description: { type: "string", nullable: true },
      duration: { type: "integer", nullable: true, example: 60 },
    },
  },
  LessonUpdateRequest: {
    type: "object",
    properties: {
      classId: { type: "integer" },
      date: { type: "string", format: "date-time" },
      topic: { type: "string", nullable: true },
      description: { type: "string", nullable: true },
      duration: { type: "integer", nullable: true },
    },
  },
  AttendanceCreateRequest: {
    type: "object",
    required: ["studentId", "lessonId", "status"],
    properties: {
      studentId: { type: "integer", example: 1 },
      lessonId: { type: "integer", example: 1 },
      status: { type: "string", enum: ["PRESENT", "ABSENT", "JUSTIFIED", "LATE"] },
      notes: { type: "string", nullable: true },
      checkedAt: { type: "string", format: "date-time", nullable: true },
    },
  },
  AttendanceUpdateRequest: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["PRESENT", "ABSENT", "JUSTIFIED", "LATE"] },
      notes: { type: "string", nullable: true },
      checkedAt: { type: "string", format: "date-time", nullable: true },
    },
  },
  ClassGradesUpsertRequest: {
    type: "object",
    required: ["grades"],
    properties: {
      grades: {
        type: "array",
        items: {
          type: "object",
          required: ["studentId"],
          properties: {
            studentId: { type: "integer", example: 1 },
            u1: { type: "number", format: "float", nullable: true, example: 8.5 },
            u2: { type: "number", format: "float", nullable: true, example: 6.5 },
            u3: { type: "number", format: "float", nullable: true, example: 7.25 },
            recoveryExam: { type: "number", format: "float", nullable: true, example: 8 },
            finalExam: { type: "number", format: "float", nullable: true, example: 7 },
          },
        },
      },
    },
  },
};

export default swaggerSchemas;
