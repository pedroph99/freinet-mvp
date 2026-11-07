const studentsPaths = {
  "/students": {
    get: {
      tags: ["Students"],
      summary: "Listar alunos",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Lista de alunos" } },
    },
    post: {
      tags: ["Students"],
      summary: "Criar aluno",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/StudentCreateRequest" },
          },
        },
      },
      responses: { 201: { description: "Aluno criado" } },
    },
  },
  "/students/{id}": {
    get: {
      tags: ["Students"],
      summary: "Buscar aluno por ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Aluno encontrado" } },
    },
    put: {
      tags: ["Students"],
      summary: "Atualizar aluno",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/StudentUpdateRequest" },
          },
        },
      },
      responses: { 200: { description: "Aluno atualizado" } },
    },
    delete: {
      tags: ["Students"],
      summary: "Excluir aluno",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Aluno removido" } },
    },
  },
};

export default studentsPaths;