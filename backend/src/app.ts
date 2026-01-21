import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("dev"));

// Routes
import authRoutes from "./modules/auth/auth.routes";
import dialogRoutes from "./modules/dialog/dialog.routes";
import userProgressRoutes from "./modules/userprogress/userprogress.routes";
import jlptRoutes from "./modules/jplt/jlpt.routes";

app.use("/api/auth", authRoutes);
app.use("/api/dialogs", dialogRoutes);
app.use("/api/userprogress", userProgressRoutes);
app.use("/api/jlpt", jlptRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Nihongo Talk Trainer API is running 🚀");
});

export default app;
