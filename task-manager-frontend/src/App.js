import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/tasks");
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title.trim()) return;

    const response = await axios.post("http://localhost:5000/tasks", {
      title,
    });

    setTasks([...tasks, response.data]);
    setTitle("");
  };

  const updateTask = async (id, status) => {
    const response = await axios.patch(
      `http://localhost:5000/tasks/${id}`,
      { status }
    );

    setTasks(
      tasks.map((task) =>
        task._id === id ? response.data : task
      )
    );
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);

    setTasks(tasks.filter((task) => task._id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Task Manager</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={createTask}
        >
          Add Task
        </button>
      </div>

      <div className="row">
        {["Pending", "Ongoing", "Completed"].map((status) => (
          <div className="col-md-4" key={status}>
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5>{status} Tasks</h5>
              </div>

              <div className="card-body">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div className="card mb-2" key={task._id}>
                      <div className="card-body">
                        <h6>{task.title}</h6>

                        <p className="text-muted">
                          Status: {task.status}
                        </p>

                        {status !== "Ongoing" && (
                          <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() =>
                              updateTask(task._id, "Ongoing")
                            }
                          >
                            Ongoing
                          </button>
                        )}

                        {status !== "Completed" && (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              updateTask(task._id, "Completed")
                            }
                          >
                            Completed
                          </button>
                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                {tasks.filter((task) => task.status === status)
                  .length === 0 && (
                  <p className="text-muted">
                    No tasks in this category.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

