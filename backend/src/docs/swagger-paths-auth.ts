const authPaths = {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        200: { description: "Login realizado com sucesso" },
        400: { description: "Campos obrigatórios ausentes" },
        401: { description: "Senha inválida" },
        404: { description: "Usuário não encontrado" },
      },
    },
  },
  "/auth/register-teacher": {
    post: {
      tags: ["Auth"],
      summary: "Registrar professor",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterTeacherRequest" },
          },
        },
      },
      responses: {
        201: { description: "Professor registrado com sucesso" },
      },
    },
  },
  "/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Dados do usuário autenticado",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Usuário autenticado" },
        401: { description: "Não autenticado" },
      },
    },
  },
};

export default authPaths;