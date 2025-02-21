import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { getAuth } from "firebase/auth";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do" });

  useEffect(() => {
    const fetchTasks = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get("http://localhost:5000/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setTasks(response.data);
        } catch (error) {
          console.error("Error fetching tasks:", error.response?.data || error.message);
        }
      } else {
        console.error("No user authenticated");
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    reorderedItem.category = result.destination.droppableId;
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      user.getIdToken().then((token) => {
        axios.put(`http://localhost:5000/tasks/${reorderedItem._id}`, reorderedItem, {
          headers: { Authorization: `Bearer ${token}` },
        });
      });
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title) {
      alert("Title is required.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      try {
        const response = await axios.post(
          "http://localhost:5000/tasks",
          newTask,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setNewTask({ title: "", description: "", category: "To-Do" });
      } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      try {
        await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* Task Creation Form */}
      <div className="mb-8 p-6 bg-white shadow-md rounded-lg flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Create New Task</h2>
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button
          onClick={handleCreateTask}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Task
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["To-Do", "In Progress", "Done"].map((category) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-4 bg-gray-100 rounded-lg shadow-md"
                  >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">{category}</h2>
                    {tasks
                      .filter((task) => task.category === category)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 my-2 bg-white rounded-md shadow hover:shadow-lg transition-shadow"
                            >
                              <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="mt-2 text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default TaskBoard;
