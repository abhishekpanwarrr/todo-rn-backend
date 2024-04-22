import Todo from "../models/todo.model.js";
import moment from "moment";
import User from "../models/user.model.js";

const createUserTodo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, category } = req.body;

    const newTodo = await Todo.create({
      title,
      category,
      dueDate: moment().format("YYYY-MM-DD"),
    });

    await newTodo.save();
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user?.todos.push(newTodo?._id);
    await user.save();
    res.status(201).json({ msg: "Todo created successfully", todo: newTodo });
  } catch (error) {
    res.status(500).json({ msg: "Error in adding user todos" });
  }
};

const getAllUserTodos = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("todos");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "Found user's todos", todos: user?.todos });
  } catch (error) {
    res.status(500).json({ msg: "Error in fetching user's todos" });
  }
};

const patchTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const updateTodo = await Todo.findByIdAndUpdate(
      todoId,
      {
        status: "completed",
      },
      { new: true }
    );
    if (!updateTodo) {
      return res.status(404).json({ msg: "No such todo exists!" });
    }
    res.status(200).json({ msg: "Updated the todo", todo: updateTodo });
  } catch (error) {
    res.status(500).json({ msg: "Error in updating todo" });
  }
};

const getTodosDate = async (req, res) => {
  try {
    const date = req.params.date;
    const completedTodos = await Todo.find({
      status: "completed",
      createdAt: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`),
      },
    }).exec();
    res.status(200).json({ msg: "Found it", completedTodos });
  } catch (error) {
    res.status(500).json({ msg: "Error in fetching todos" });
  }
};
const getTodosCount = async (req, res) => {
  try {
    const completedTotal = await Todo.countDocuments({
      status: "completed",
    }).exec();
    const pendingTotal = await Todo.countDocuments({
      status: "pending",
    }).exec();
    res.status(200).json({ completedTotal, pendingTotal });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
export {
  createUserTodo,
  getAllUserTodos,
  patchTodo,
  getTodosDate,
  getTodosCount,
};
