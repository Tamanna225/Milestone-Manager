import React, { useState } from "react";

export default function ProjectDetails() {
  const [tasks, setTasks] = useState([
    { id: "task-1", title: "Foundation Work", status: "Completed" },
    { id: "task-2", title: "Electrical Setup", status: "Ongoing" },
    { id: "task-3", title: "Painting", status: "Upcoming" },
  ]);
  const [newTask, setNewTask] = useState({ title: "", status: "Upcoming" });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [showRemoveIcon, setShowRemoveIcon] = useState(false);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, { id: `task-${Date.now()}`, ...newTask }]);
      setNewTask({ title: "", status: "Upcoming" });
      setIsAddTaskOpen(false);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  const handleRemoveTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return "✔️"; // Checkmark for completed
      case "Ongoing": return "🔄"; // Refresh symbol for ongoing
      case "Upcoming": return "🕒"; // Clock for upcoming
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto shadow-lg bg-gray-800 border-gray-700 p-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Project Overview</h1>
        <p className="text-gray-400">Manage your project tasks, budget, and inventory</p>

        {/* Add Task Button */}
        <div className="mt-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Task Management</h2>
          <div className="flex items-center">
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
            <button 
              onClick={() => setShowRemoveIcon(!showRemoveIcon)} 
              className={`ml-2 ${showRemoveIcon ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded`}
            >
              {showRemoveIcon ? 'Hide Remove' : 'Show Remove'}
            </button>
          </div>
        </div>

        {/* Add Task Popup */}
        {isAddTaskOpen && (
          <div className="bg-gray-700 p-4 rounded mt-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="bg-gray-600 border-gray-500 text-white p-2 rounded"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="bg-gray-600 border-gray-500 text-white p-2 rounded ml-2"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-2">
              Add Task
            </button>
          </div>
        )}

        {/* Task Sections */}
        <div className="mt-4">
          {["Upcoming", "Ongoing", "Completed"].map(status => (
            <div key={status} className="mt-6">
              <h3 className="text-lg font-semibold text-white">{status} Tasks</h3>
              <div className="bg-gray-700 border-gray-600 p-4 mb-2">
                {tasks.filter(task => task.status === status).map((task) => (
                  <div key={task.id} className="flex justify-between items-center mb-2">
                    <span className="text-white flex items-center">
                      {getStatusIcon(task.status)} {task.title}
                    </span>
                    <div className="flex items-center">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white p-2 rounded ml-2"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {showRemoveIcon ? (
                        <button onClick={() => handleRemoveTask(task.id)} className="text-red-600 ml-2">
                          🗑️
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Budget and Inventory Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Overview */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">Budget Overview</h2>
            <p>Total: <span className="font-bold text-blue-400">$100,000</span></p>
            <p>Used: <span className="font-bold text-yellow-400">$60,000</span></p>
            <p>Remaining: <span className="font-bold text-green-400">$40,000</span></p>
            <button
              onClick={() => console.log("View Budget Management")} // Replace with navigation
              className="mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              View More
            </button>
          </div>

          {/* Inventory Overview */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">Inventory Overview</h2>
            <p>In Stock: Cement, Bricks, Paint</p>
            <button
              onClick={() => console.log("View Inventory Management")} // Replace with navigation
              className="mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
