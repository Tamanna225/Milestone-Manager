import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import subtasksImage from "../assets/images/subtasks.png";
import Navbar from "./navbar";


export default function ProjectDetails() {
  const { id } = useParams(); // Extract project ID from the URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch project details based on the project ID
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
  }, [id]);

  if (loading) {
    return (
      <p className="text-gray-400 text-center mt-10">Loading project details...</p>
    );
  }

  if (!data || data.error) {
    return (
      <p className="text-red-400 text-center mt-10">
        Error: {data?.error || "Unable to fetch project details."}
      </p>
    );
  }

  const { subtasks, budget, inventory } = data;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <Navbar />
      <div className="max-w-6xl mx-auto shadow-xl rounded-lg p-8 space-y-10">
        <header>
          <h1 className="text-6xl font-extrabold text-purple-600 text-center">
            <span className="text-white">Project </span> Details
          </h1>
          <p className="text-gray-400 text-center mt-2">
            Manage your project's tasks, budget, and inventory.
          </p>
        </header>

        {/* Subtasks */}
        <section>
        <div className="flex justify-center items-center">
          <img 
            src={subtasksImage} 
            alt="subtasks" 
            className="w-65 h-65 object-contain rounded-lg 
                      lg:w-[600px] lg:h-[600px]" />
        </div>

          <h2 className="text-4xl font-bold text-purple-600 mb-4 border-b border-white pb-2">
            <span className="text-white">Sub</span>
            tasks
          </h2>
          <div className="space-y-4">
            {subtasks.map((subtask) => (
              <div
              key={subtask.subtask_id}
              className="flex justify-between items-center bg-zinc-800/50 border border-white rounded-lg p-4 hover:bg-black/20 transition"
            >
              <span className="text-lg font-medium text-white">
                {subtask.title}
              </span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  subtask.status === "Completed"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-purple-600"
                }`}
              >
                {subtask.status}
              </span>
            </div>
            
            ))}
          </div>
        </section>

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
