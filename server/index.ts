import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.routes";
import { requestLogger } from "./middlewares/requestLogger";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(requestLogger);

app.use("/api/auth", authRoutes);




app.use(errorMiddleware);

const PORT = process.env.PORT ?? 3000;

const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

export default server;
