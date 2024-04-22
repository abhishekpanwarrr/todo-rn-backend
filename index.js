import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";

const app = express();
dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
    process.exit(1);
  });

// Import routes
app.use("/",(req,res) =>{
  res.send("Hello there user")
})
app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);
