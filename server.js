const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/taskmanager")

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Pending",
    },
  })
);

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = new Task({
    title: req.body.title,
  });

  const savedTask = await task.save();
  res.status(201).json(savedTask);
});

app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
