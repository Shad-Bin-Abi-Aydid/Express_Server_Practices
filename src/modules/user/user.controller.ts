import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, age } = req.body;

  try {
    const result = await userServices.createUser(name, email, age);
    // console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data inserted Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get users
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved data successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

// get Single user
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);

    // if didn't found any data
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User didn't found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user data found Successfully",
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

// update user
const updateUser = async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const result = await userServices.updateUser(
      name,
      email,
      age,
      req.params.id as string,
    );

    // if didn't found any data
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User didn't found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user updated Successfully",
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

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    // if didn't found any data
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User didn't found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user delete Successfully",
        data: result.rows,
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

export const userController = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
