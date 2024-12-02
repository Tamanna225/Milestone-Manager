import React, { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";

export default function Budget() {
  const { id } = useParams(); // Get project_id from the URL
  const [budgetData, setBudgetData] = useState([]);
  const [selectedSlice, setSelectedSlice] = useState(null);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#4ecdc4"];

  const handlePieClick = (entry, index) => {
    setSelectedSlice(selectedSlice === index ? null : index);
  };

  // Calculate total and used budget
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

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-8 flex items-center justify-center">
      
  <div className="border-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
  <Navbar />
    <div className="p-4 text-center">
      <h1 className="text-7xl sm:text-6xl font-bold text-white mb-3">
         Project <span className="text-purple-600">Budget</span> Breakdown
      </h1>
      <p className="text-gray-400">
        Total Budget: ₹{totalBudget.toLocaleString()} | Used Budget: ₹{usedBudget.toLocaleString()}
      </p>
    </div>
    <div className="p-4">
      {/* Stack chart and table vertically */}
      <div className="space-y-8">
        {/* Chart Section */}
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
        
        {/* Table Section */}
        <div className="overflow-x-auto">
        <table className="w-full table-auto text-xl text-gray-200">
  <thead>
    <tr>
      <th className="text-purple-600 py-2 px-4 text-left border-r border-gray-500">Category</th>
      <th className="text-purple-600 py-2 px-4 text-right border-r border-gray-500">Total Budget</th>
      <th className="text-purple-600 py-2 px-4 text-right border-r border-gray-500">Used Budget</th>
      <th className="text-purple-600 py-2 px-4 text-right">Remaining</th>
    </tr>
  </thead>
  <tbody>
    {budgetData.map((item, index) => (
      <tr
        key={`${item.category}-${index}`}
        className={selectedSlice === index ? "bg-gray-900" : ""}
      >
        <td className="py-2 px-4 border-r border-gray-500">{item.category}</td>
        <td className="py-2 px-4 text-right border-r border-gray-500">
        ₹{parseFloat(item.allocated_amount).toLocaleString()}
        </td>
        <td className="py-2 px-4 text-right border-r border-gray-500">
        ₹{parseFloat(item.spent_amount).toLocaleString()}
        </td>
        <td className="py-2 px-4 text-right">
        ₹{(
            parseFloat(item.allocated_amount) - parseFloat(item.spent_amount)
          ).toLocaleString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>
    </div>
  </div>
</div>

  );
}
