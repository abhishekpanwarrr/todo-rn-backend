import express from "express";
import {
  createUserTodo,
  getAllUserTodos,
  patchTodo,
  getTodosDate,
  getTodosCount
} from "../controllers/todo.controller.js";
const router = express.Router();

router.post("/:userId", createUserTodo);
router.get("/:userId/todos", getAllUserTodos);
router.patch("/:todoId/complete", patchTodo);
router.get("/todos/completed/:date", getTodosDate);
router.get("/todos/count", getTodosCount);

export default router;
