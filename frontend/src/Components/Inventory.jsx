import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Box, ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react';
import { useParams } from "react-router-dom";
import Navbar from './navbar';

export default function Inventory() {
  const { id } = useParams();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/backend/get_InventoryData.php?project_id=${id}`) 
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        // Parse unit_price and total_price to float and map the necessary data
        const updatedData = data.map(item => ({
          name: item.item_name,
          quantity: item.remaining_stock || 0,  // Ensure quantity is not undefined
          price: parseFloat(item.unit_price) || 0,  // Convert unit price to a number
          totalPrice: parseFloat(item.total_price) || 0, // Convert total price to a number
          status: item.status,
        }));
        setInventoryData(updatedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Separate inventory data based on stock status
  const inStockItems = inventoryData.filter(item => item.quantity > 0);
  const outOfStockItems = inventoryData.filter(item => item.quantity === 0);

  // Calculate total inventory value
  const totalInventoryValue = useMemo(() =>
    inventoryData.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0),
    [inventoryData]
  );

  // Prepare data for the bar chart
  const barChartData = useMemo(() =>
    inventoryData.map(item => ({
      name: item.name,
      value: item.totalPrice || 0,
      quantity: item.quantity,
      price: item.price,
    })),
    [inventoryData]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen text-white p-8">
      <Navbar />
      <div className="p-8 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ">
        <h1 className="text-8xl sm:text-7xl font-bold text-white text-center">Inventory <span className='text-purple-700'>Overview </span></h1>
        <p className="text-gray-400 mt-2 text-center">Total Inventory Value: ₹{totalInventoryValue.toLocaleString()}</p>


          {/* Bar Graph Section */}
          <div className="h-80 sm:h-96 transition-transform transform hover:scale-110 duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                <YAxis tick={{ fill: '#ccc' }} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `₹${value.toLocaleString()} (${props.payload.quantity} units)`,
                    'Total Value',
                  ]}
                  contentStyle={{ background: '#333', border: 'none', color: '#fff' }}
                />
                <Legend
                  formatter={(value) => <span className="text-gray-300">{value}</span>}
                />
                <Bar
                  dataKey="value"
                  fill="url(#colorGradient)"
                  stroke="#333"
                  barSize={40}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6384" />
                    <stop offset="100%" stopColor="#36A2EB" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>

          </div>
          <div>
          {/* In Stock Items Table */}
          <div className="overflow-x-auto mt-8 mb-10">
  <h2 className="text-5xl font-bold text-white mb-4 mt-10 text-center">
    <span className='text-green-200'>In </span><span className='text-purple-600'>Stock</span> Items
  </h2>
  <table className="min-w-full table-auto text-xl">
    <thead>
      <tr className="text-green-200 border-b border-gray-300">
        <th className="text-left p-4 border-r border-gray-300">Item</th>
        <th className="text-right p-4 border-r border-gray-300">Quantity</th>
        <th className="text-right p-4 border-r border-gray-300">Unit Price</th>
        <th className="text-right p-4">Total Value</th>
      </tr>
    </thead>
    <tbody>
      {inStockItems.map((item) => (
        <tr key={item.name} className="hover:bg-gray-800">
          <td className="p-4 text-gray-300 flex items-center border-r border-gray-300">
            <Box className="mr-3 text-gray-400" />
            {item.name}
          </td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">{item.quantity}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">₹{item.price.toLocaleString()}</td>
          <td className="p-4 text-right text-gray-300">₹{(item.quantity * item.price).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



        {/* Out of Stock Items Table */}
        <div className="overflow-x-auto mt-10 mb-12">
  <h2 className="text-5xl font-bold text-white mb-4 mt-12 text-center">
    <span className='text-red-200'>Out</span> of <span className='text-purple-600'>Stock</span> Items
  </h2>
  <table className="min-w-full table-auto text-xl">
    <thead>
      <tr className="text-red-200 border-b border-gray-300">
        <th className="text-left p-4 border-r border-gray-300">Item</th>
        <th className="text-right p-4 border-r border-gray-300">Quantity</th>
        <th className="text-right p-4 border-r border-gray-300">Unit Price</th>
        <th className="text-right p-4">Total Value</th>
      </tr>
    </thead>
    <tbody>
      {outOfStockItems.map((item) => (
        <tr key={item.name} className="hover:bg-gray-800">
          <td className="p-4 text-gray-300 flex items-center border-r border-gray-300">
            <Box className="mr-3 text-gray-400" />
            {item.name}
          </td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">{item.quantity}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">₹{item.price.toLocaleString()}</td>
          <td className="p-4 text-right text-gray-300">₹{(item.quantity * item.price).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



        </div>
        
          {/* Stats Section with Animation */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-sm font-medium text-gray-100">Total Inventory Value</h3>
              <DollarSign className="h-5 w-5 text-white" />
              <p className="text-3xl font-bold text-white">₹{totalInventoryValue.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 rounded-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-sm font-medium text-gray-100">Highest Value Item</h3>
              <ArrowUpRight className="h-5 w-5 text-white" />
              <p className="text-3xl font-bold text-white">₹{Math.max(...inventoryData.map(item => item.totalPrice || 0)).toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-sm font-medium text-gray-100">Most Stocked Item</h3>
              <ArrowDownRight className="h-5 w-5 text-white" />
              <p className="text-3xl font-bold text-white">{Math.max(...inventoryData.map(item => item.quantity || 0))} units</p>
            </div>

            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-6 rounded-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-sm font-medium text-gray-100">Stock Utilization</h3>
              <Percent className="h-5 w-5 text-white" />
              <p className="text-3xl font-bold text-white">100%</p>
            </div>
          </div>
        </div>

        
    </div>
  );
}
