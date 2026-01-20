import express, { Request, Response } from "express";
import { userController } from "./user.controller";

const router = express.Router();

// Post user data
router.post("/", userController.createUser );

// Get user data
router.get("/", userController.getUsers);

// get Single user
router.get("/:id", userController.getSingleUser);

// update user
router.put("/:id", userController.updateUser);

// delete user
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
