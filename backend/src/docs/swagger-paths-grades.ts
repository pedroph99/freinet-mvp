const gradePaths = {
  "/classes/{id}/grades": {
    get: {
      tags: ["Grades"],
      summary: "Listar boletim da turma do professor",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Boletim da turma" } },
    },
    put: {
      tags: ["Grades"],
      summary: "Lançar ou atualizar notas da turma",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ClassGradesUpsertRequest" },
          },
        },
      },
      responses: { 200: { description: "Notas atualizadas" } },
    },
  },
};

export default gradePaths;
