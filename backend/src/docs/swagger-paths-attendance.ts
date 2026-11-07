const attendancePaths = {
  "/attendance": {
    get: {
      tags: ["Attendance"],
      summary: "Listar presenças",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Lista de presenças" } },
    },
    post: {
      tags: ["Attendance"],
      summary: "Registrar presença",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AttendanceCreateRequest" },
          },
        },
      },
      responses: { 201: { description: "Presença registrada" } },
    },
  },
  "/attendance/{id}": {
    get: {
      tags: ["Attendance"],
      summary: "Buscar presença por ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Presença encontrada" } },
    },
    patch: {
      tags: ["Attendance"],
      summary: "Atualizar presença",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AttendanceUpdateRequest" },
          },
        },
      },
      responses: { 200: { description: "Presença atualizada" } },
    },
    delete: {
      tags: ["Attendance"],
      summary: "Excluir presença",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Presença removida" } },
    },
  },
  "/attendance/student/{studentId}/summary": {
    get: {
      tags: ["Attendance"],
      summary: "Resumo de presença do aluno",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "studentId", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Resumo de presença" } },
    },
  },
};

export default attendancePaths;