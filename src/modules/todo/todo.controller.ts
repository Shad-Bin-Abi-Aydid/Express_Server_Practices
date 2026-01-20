import { Request, Response } from "express";
import { todoServices } from "./todo.service";

// post todos
const createTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoServices.createTodo(user_id, title);

    res.status(201).json({
      success: true,
      message: "Todo Created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Todo
const getTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodo();

    res.status(200).json({
      success: true,
      message: "todos data retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Todos data not found",
    });
  }
};

// Get Single Todo
const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getSingleTodo(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos data found successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
};

// update todo
const updateTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await todoServices.updateTodo(
      user_id,
      title,
      req.params.id as string,
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos data update successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
};

// Delete todo
const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.deleteTodo(req.params.id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos delete successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
};

export const todoController = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo
};
