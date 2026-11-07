const classStudentsPaths = {
  "/class-students/{id}/students": {
    get: {
      tags: ["Class Students"],
      summary: "Listar alunos da turma",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Alunos da turma" } },
    },
    post: {
      tags: ["Class Students"],
      summary: "Matricular aluno na turma",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 201: { description: "Aluno matriculado" } },
    },
  },
};

export default classStudentsPaths;