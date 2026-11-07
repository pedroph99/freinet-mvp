const lessonsPaths = {
  "/lessons": {
    get: {
      tags: ["Lessons"],
      summary: "Listar aulas",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Lista de aulas" } },
    },
    post: {
      tags: ["Lessons"],
      summary: "Criar aula",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LessonCreateRequest" },
          },
        },
      },
      responses: { 201: { description: "Aula criada" } },
    },
  },
  "/lessons/{id}": {
    get: {
      tags: ["Lessons"],
      summary: "Buscar aula por ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Aula encontrada" } },
    },
    put: {
      tags: ["Lessons"],
      summary: "Atualizar aula",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LessonUpdateRequest" },
          },
        },
      },
      responses: { 200: { description: "Aula atualizada" } },
    },
    delete: {
      tags: ["Lessons"],
      summary: "Excluir aula",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Aula removida" } },
    },
  },
};

export default lessonsPaths;