import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";

const app = express();
const port = config.port;

// add parser => this is for allow json format data
app.use(express.json());

// initializing DB
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next level Developer!!!!");
});

// <---------------------------> Users CURD <---------------------------------->

app.use("/users", userRoutes);

// <-----------------------------> todo's CURD <--------------------------------->

app.use("/todos", todoRoutes);

// not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not Found",
    path: req.path,
  });
});

// Listener
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
