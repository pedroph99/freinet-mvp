import express from "express";
import cors from 'cors';
import router from "./routes";
import {authMiddleware} from "./middlewares/authMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";


const app = express();

app.use(cors());
app.use(express.json());
app.get("/api-docs.json", (req, res) => {
	res.json(swaggerSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(authMiddleware, router)

export default app;