import React, { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useParams } from "react-router-dom";
import { FaPlus } from 'react-icons/fa';
import AdminNavbar from "./AdminNavbar";

export default function AdminBudget() {
  const { id } = useParams(); // Get project_id from the URL
  const [budgetData, setBudgetData] = useState([]);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    allocated_amount: "",
    spent_amount: "",
  });

  const [editingIndex, setEditingIndex] = useState(null); // For updating entries
  const [isModalOpen, setIsModalOpen] = useState(false); // For managing modal visibility
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#4ecdc4"];

  const handlePieClick = (entry, index) => {
    setSelectedSlice(selectedSlice === index ? null : index);
  };

  const totalBudget = useMemo(
    () => budgetData.reduce((sum, item) => sum + parseFloat(item.allocated_amount || 0), 0),
    [budgetData]
  );

  const usedBudget = useMemo(
    () => budgetData.reduce((sum, item) => sum + parseFloat(item.spent_amount || 0), 0),
    [budgetData]
  );

  const pieChartData = useMemo(
    () =>
      budgetData.map((item) => ({
        name: item.category,
        value: parseFloat(item.spent_amount || 0),
        totalBudget: parseFloat(item.allocated_amount || 0),
      })),
    [budgetData]
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost/backend/get_BudgetData.php?project_id=${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setBudgetData(data);
        } else {
          console.error("Error fetching budget data:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddBudget = async () => {
    try {
      const response = await fetch(`http://localhost/backend/add_BudgetData.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, ...formData }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setBudgetData([...budgetData, newEntry]);
        setFormData({ category: "", allocated_amount: "", spent_amount: "" });
        setIsModalOpen(false); // Close modal after successful add
      } else {
        console.error("Error adding budget data");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleEditBudget = async () => {
    const updatedData = { 
      budget_id: budgetData[editingIndex]?.budget_id, 
      ...formData 
    };
  
    if (!updatedData.budget_id) {
      console.error("Error: budget_id is undefined");
      return; // Prevent sending the update if the budget_id is missing
    }
  
    try {
      const response = await fetch(`http://localhost/backend/update_BudgetData.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const updatedBudgetData = [...budgetData];
        updatedBudgetData[editingIndex] = { ...updatedBudgetData[editingIndex], ...formData };
        setBudgetData(updatedBudgetData);
        setEditingIndex(null);
        setFormData({ category: "", allocated_amount: "", spent_amount: "" });
        setIsModalOpen(false); // Close modal after successful edit
      } else {
        console.error("Error updating budget data");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleDeleteBudget = async (index) => {
    try {
      const response = await fetch(
        `http://localhost/backend/delete_BudgetData.php?budget_id=${budgetData[index].budget_id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setBudgetData(budgetData.filter((_, i) => i !== index));
      } else {
        console.error("Error deleting budget data");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const openModal = (index) => {
    if (index !== undefined) {
      setEditingIndex(index);
      const item = budgetData[index];
      setFormData({
        category: item.category,
        allocated_amount: item.allocated_amount,
        spent_amount: item.spent_amount,
      });
    } else {
      setFormData({ category: "", allocated_amount: "", spent_amount: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="border-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <AdminNavbar />
        <div className="p-4 text-center">
          <h1 className="text-7xl sm:text-6xl font-bold text-white mb-3">
            Project <span className="text-purple-600">Budget</span> Breakdown (Admin)
          </h1>
          <p className="text-gray-400">
            Total Budget: ₹{totalBudget.toLocaleString()} | Used Budget: ₹{usedBudget.toLocaleString()}
          </p>
        </div>
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
                onClick={handlePieClick}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke={selectedSlice === index ? "#fff" : "transparent"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const total = props?.payload?.totalBudget || 0;
                  return [`$${value.toLocaleString()} / ₹${total.toLocaleString()}`, name];
                }}
                contentStyle={{ background: "white", border: "none", color: "#F3F4F6" }}
              />
              <Legend
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Form for Add/Update */}
        <div className="text-center p-4 ">
  <button
    onClick={() => openModal()}
    className="text-purple-500 hover:text-purple-700 flex items-center justify-center w-full h-full"
  >
    <div className="flex items-center justify-center bg-purple-500 rounded-full w-16 h-16">
      <FaPlus size={30} className="text-white" />
    </div>
  </button>
</div>


        {/* Table with Delete/Edit */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full table-auto text-xl text-gray-200">
            <thead>
              <tr>
                <th className="text-purple-600 py-2 px-4 text-left border-r border-gray-500">Category</th>
                <th className="text-purple-600 py-2 px-4 text-right border-r border-gray-500">Total Budget</th>
                <th className="text-purple-600 py-2 px-4 text-right border-r border-gray-500">Used Budget</th>
                <th className="text-purple-600 py-2 px-4 text-right border-r border-gray-500">Remaining</th>
                <th className="text-purple-600 py-2 px-4 text-right border-r border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetData.map((item, index) => (
                <tr key={item.budget_id}>
                  <td className="py-2 px-4 border-r border-gray-500">{item.category}</td>
                  <td className="py-2 px-4 text-right border-r border-gray-500">
                  ₹{parseFloat(item.allocated_amount).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right border-r border-gray-500">
                  ₹{parseFloat(item.spent_amount).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right border-r border-gray-500">
                  ₹{(
                      parseFloat(item.allocated_amount) - parseFloat(item.spent_amount)
                    ).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right border-r border-gray-500">
                    <button onClick={() => openModal(index)} className="text-blue-500 ">Edit</button>
                    <button onClick={() => handleDeleteBudget(index)} className="text-red-500 ml-4">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg w-80  border border-white">
            <h2 className="text-2xl font-bold mb-4 text-purple-600 text-center">{editingIndex !== null ? "Edit" : "Add"} Budget</h2>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full p-2 mb-4 border border-white rounded bg-black"
            />
            <input
              type="number"
              name="allocated_amount"
              value={formData.allocated_amount}
              onChange={handleInputChange}
              placeholder="Allocated Amount"
              className="w-full p-2 mb-4 border border-white rounded bg-black"
            />
            <input
              type="number"
              name="spent_amount"
              value={formData.spent_amount}
              onChange={handleInputChange}
              placeholder="Spent Amount"
              className="w-full p-2 mb-4 border border-white rounded bg-black"
            />
            <div className="flex justify-end">
              <button onClick={closeModal} className="text-white mr-2 bg-red-500 border rounded px-4 py-2">Cancel</button>
              <button
                onClick={editingIndex !== null ? handleEditBudget : handleAddBudget}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
