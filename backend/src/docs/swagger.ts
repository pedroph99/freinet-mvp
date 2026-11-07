import swaggerBase from "./swagger-base";
import swaggerSchemas from "./swagger-schemas";
import authPaths from "./swagger-paths-auth";
import studentsPaths from "./swagger-paths-students";
import teachersPaths from "./swagger-paths-teachers";
import classesPaths from "./swagger-paths-classes";
import lessonsPaths from "./swagger-paths-lessons";
import attendancePaths from "./swagger-paths-attendance";
import classStudentsPaths from "./swagger-paths-class-students";
import gradePaths from "./swagger-paths-grades";

const swaggerSpec = {
  ...swaggerBase,
  components: {
    ...swaggerBase.components,
    schemas: swaggerSchemas,
  },
  paths: {
    ...authPaths,
    ...studentsPaths,
    ...teachersPaths,
    ...classesPaths,
    ...lessonsPaths,
    ...attendancePaths,
    ...classStudentsPaths,
    ...gradePaths,
  },
};

export default swaggerSpec;
