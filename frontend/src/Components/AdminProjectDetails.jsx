import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminProjectDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", status: "Upcoming" });
  const [editingSubtask, setEditingSubtask] = useState(null); // Track the subtask being edited

  const fetchProjectDetails = () => {
    setLoading(true);
    fetch(`http://localhost/backend/get_subtasks.php?project_id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = editingSubtask
      ? "update_subtask.php"
      : "add_subtask.php";
    const method = editingSubtask ? "PUT" : "POST";

    fetch(`http://localhost/backend/${endpoint}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, subtask_id: editingSubtask, project_id: id }),
    })
      .then(() => {
        fetchProjectDetails();
        setFormData({ title: "", status: "Upcoming" });
        setEditingSubtask(null);
      })
      .catch((error) => console.error("Error saving subtask:", error));
  };

  const handleDelete = (subtask_id) => {
    fetch(`http://localhost/backend/delete_subtask.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtask_id }),
    })
      .then(() => fetchProjectDetails())
      .catch((error) => console.error("Error deleting subtask:", error));
  };

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading project details...</p>;
  }

  if (!data || data.error) {
    return <p className="text-red-400 text-center mt-10">Error fetching project details.</p>;
  }

  const { subtasks, budget, inventory } = data;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto shadow-xl rounded-lg p-8 space-y-10">
        <header>
          <h1 className="text-6xl font-extrabold text-white text-center">
          Admin <span className="text-purple-600">Project </span> Details
          </h1>
          <p className="text-gray-400 text-center mt-2">Manage your project's tasks, budget, and inventory.</p>
        </header>

        {/* Subtasks Management */}
        <section>
          <h2 className="text-4xl font-bold text-purple-600 mb-4 border-b border-white pb-2">
            <span className="text-white">Manage</span> Subtasks
          </h2>
          <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full bg-zinc-800 border border-white rounded-lg p-2 text-white"
              placeholder="Subtask Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <select
              className="w-full bg-zinc-800 border border-white rounded-lg p-2 text-white"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              {editingSubtask ? "Update Subtask" : "Add Subtask"}
            </button>
          </form>

          <div className="space-y-4">
            {subtasks.map((subtask) => (
              <div
                key={subtask.subtask_id}
                className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4"
              >
                <span className="text-lg font-medium text-white">{subtask.title}</span>
                <span className="flex items-center gap-2">
                  <button
                    onClick={() => setFormData({ title: subtask.title, status: subtask.status }) || setEditingSubtask(subtask.subtask_id)}
                    className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subtask.subtask_id)}
                    className="text-sm font-semibold px-3 py-1 rounded-full bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Budget and Inventory Sections (unchanged) */}
 {/* Budget Details */}
 <section>
          <h2 className="text-4xl font-bold text-purple-600 mb-4 border-b border-white pb-2">
          <span className="text-white">Budget</span> Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4 hover:bg-black/20 transition">
              <span className="text-lg text-white">Total Budget</span>
              <span className="text-lg text-purple-600">₹{budget.total}</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4 hover:bg-black/20 transition">
              <span className="text-lg text-white">Budget Used</span>
              <span className="text-lg text-red-300">₹{budget.spent}</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4 hover:bg-black/20 transition">
              <span className="text-lg text-white">Budget Left</span>
              <span className="text-lg text-green-200">₹{budget.left}</span>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section>
          <h2 className="text-4xl font-bold text-purple-600 mb-4 border-b border-white pb-2">
          <span className="text-white">Inven</span>tory
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4 hover:bg-black/20 transition">
              <span className="text-lg text-white">In Stock</span>
              <span className="text-lg text-green-200">{inventory.in_stock}</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4 hover:bg-black/20 transition">
              <span className="text-lg text-white">Not In Stock</span>
              <span className="text-lg text-red-300">{inventory.not_in_stock}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
