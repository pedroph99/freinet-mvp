const classesPaths = {
  "/classes": {
    get: {
      tags: ["Classes"],
      summary: "Listar turmas",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Lista de turmas" } },
    },
    post: {
      tags: ["Classes"],
      summary: "Criar turma",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ClassCreateRequest" },
          },
        },
      },
      responses: { 201: { description: "Turma criada" } },
    },
  },
  "/classes/{id}": {
    get: {
      tags: ["Classes"],
      summary: "Buscar turma por ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Turma encontrada" } },
    },
    put: {
      tags: ["Classes"],
      summary: "Atualizar turma",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ClassUpdateRequest" },
          },
        },
      },
      responses: { 200: { description: "Turma atualizada" } },
    },
    delete: {
      tags: ["Classes"],
      summary: "Excluir turma",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Turma removida" } },
    },
  },
};

export default classesPaths;