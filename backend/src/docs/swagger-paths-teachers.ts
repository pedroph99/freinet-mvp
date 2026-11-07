const teachersPaths = {
  "/teachers/dashboard": {
    get: {
      tags: ["Teachers"],
      summary: "Painel do professor com notas, frequência e anotações dos alunos",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Turmas e alunos do professor autenticado" } },
    },
  },
  "/teachers": {
    get: {
      tags: ["Teachers"],
      summary: "Listar professores",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Lista de professores" } },
    },
    post: {
      tags: ["Teachers"],
      summary: "Criar professor",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/TeacherCreateRequest" },
          },
        },
      },
      responses: { 201: { description: "Professor criado" } },
    },
  },
};

export default teachersPaths;
