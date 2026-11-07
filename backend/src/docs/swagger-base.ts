const swaggerBase = {
  openapi: "3.0.3",
  info: {
    title: "Freinet API",
    version: "1.0.0",
    description: "Documentação da API da aplicação Freinet.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Students" },
    { name: "Teachers" },
    { name: "Classes" },
    { name: "Lessons" },
    { name: "Attendance" },
    { name: "Class Students" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default swaggerBase;
