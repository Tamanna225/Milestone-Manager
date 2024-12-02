import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Box, ArrowUpRight, ArrowDownRight, Percent, Edit, Trash, PlusCircle } from 'lucide-react';
import { useParams } from "react-router-dom";
import { FaPlus } from 'react-icons/fa';
import AdminNavbar from './AdminNavbar';

export default function AdminInventory() {
  const { id } = useParams();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for adding and editing
  const [newItem, setNewItem] = useState({ item_name: "", initial_stock: 0, unit_price: 0 });
  const [editItem, setEditItem] = useState(null); // For storing the item being edited
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility

  useEffect(() => {
    fetch(`http://localhost/backend/get_InventoryData.php?project_id=${id}`) 
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        const updatedData = data.map(item => ({
          id: item.inventory_id,
          name: item.item_name,
          quantity: item.remaining_stock || 0,
          price: parseFloat(item.unit_price) || 0,
          totalPrice: parseFloat(item.total_price) || 0,
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
  

  const handleDelete = (itemId) => {
    fetch('http://localhost/backend/delete_inventory.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventory_id: itemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setInventoryData((prev) => prev.filter((item) => item.id !== itemId));
        } else {
          console.error(data.error);
        }
      });
  };

  const barChartData = useMemo(() =>
    inventoryData.map(item => ({
      name: item.name,
      value: item.totalPrice || 0,
      quantity: item.quantity,
      price: item.price,
    })),
    [inventoryData]
  );

  const handleAdd = () => {
    if (!newItem.item_name || newItem.initial_stock <= 0 || newItem.unit_price <= 0) {
      alert("Please fill out all fields correctly!");
      return;
    }
  
    fetch('http://localhost/backend/add_inventory.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, project_id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.newItem) {
          const formattedItem = {
            id: data.newItem.inventory_id,
            name: data.newItem.item_name,
            quantity: data.newItem.initial_stock,
            price: parseFloat(data.newItem.unit_price),
            totalPrice: parseFloat(data.newItem.initial_stock * data.newItem.unit_price),
            status: "in-stock",
          };
          setInventoryData((prev) => [...prev, formattedItem]);
          setNewItem({ item_name: "", initial_stock: 0, unit_price: 0 });
          setShowModal(false); // Close modal
        } else {
          console.error("Add Item Error:", data.error || "Unexpected response format.");
        }
      })
      .catch((err) => {
        console.error("Add Item Fetch Error:", err.message);
      });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true); // Open modal for editing
  };

  const handleUpdate = () => {
    if (!editItem.name || editItem.quantity < 0 || editItem.price < 0) {
      alert("Please fill out all fields correctly!");
      return;
    }
    fetch('http://localhost/backend/update_inventory.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inventory_id: editItem.id,
        item_name: editItem.name,
        initial_stock: editItem.quantity,
        unit_price: editItem.price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setInventoryData((prev) =>
            prev.map((item) =>
              item.id === editItem.id
                ? { ...item, name: editItem.name, quantity: editItem.quantity, price: editItem.price, totalPrice: editItem.quantity * editItem.price }
                : item
            )
          );
          setEditItem(null);
          setShowModal(false); // Close modal
        } else {
          console.error("Update Item Error:", data.message);
        }
      })
      .catch((err) => {
        console.error("Update Item Fetch Error:", err.message);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null); // Reset edit item if modal is closed
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen text-white p-8">
      <AdminNavbar />
      <div className="p-8 rounded-lg shadow-xl">
        <h1 className="text-8xl font-bold text-center">Inventory <span className='text-purple-700'>Overview</span></h1>
        
        {/* Bar Graph */}
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

        {/* Inventory Table */}
        <div className="overflow-x-auto mt-8">
          <div className="text-center p-4 ">
          <button
            onClick={() => setShowModal(true)}
            className="text-purple-500 hover:text-purple-700 flex items-center justify-center w-full h-full"
          >
            <div className="flex items-center justify-center bg-purple-500 rounded-full w-16 h-16">
              <FaPlus size={30} className="text-white" />
            </div>
          </button>
        </div>

        <div className="overflow-x-auto mt-8 mb-10">
  <h2 className="text-5xl font-bold text-white mb-4 mt-10 text-center">
    <span className='text-green-200'>In </span><span className='text-purple-600'>Stock</span> Items
  </h2>
  <table className="min-w-full table-auto text-xl">
    <thead>
      <tr className="text-green-200 border-b border-gray-300">
        <th className="text-left p-4 border-r border-gray-300">Item Name</th>
        <th className="text-right p-4 border-r border-gray-300">Remaining Stock</th>
        <th className="text-right p-4 border-r border-gray-300">Unit Price</th>
        <th className="text-right p-4 border-r border-gray-300">Total Price</th>
        <th className="text-right p-4">Actions</th>
      </tr>
    </thead>
    <tbody>
      {inventoryData.filter((item) => item.quantity > 0).map((item) => (
        <tr key={item.id} className="hover:bg-gray-800">
          <td className="p-4 text-gray-300 border-r border-gray-300">{item.name}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">{item.quantity}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">₹{item.price.toFixed(2)}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">₹{item.totalPrice.toFixed(2)}</td>
          <td className="p-4 text-right text-gray-300 flex justify-end space-x-2">
            <button onClick={() => handleEdit(item)} className="text-blue-500 p-2">
              <Edit />
            </button>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2">
              <Trash />
            </button>
          </td>
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
        <th className="text-left p-4 border-r border-gray-300">Item Name</th>
        <th className="text-right p-4 border-r border-gray-300">Remaining Stock</th>
        <th className="text-right p-4 border-r border-gray-300">Unit Price</th>
        <th className="text-right p-4 border-r border-gray-300">Total Price</th>
        <th className="text-right p-4">Actions</th>
      </tr>
    </thead>
    <tbody>
      {inventoryData.filter((item) => item.quantity === 0).map((item) => (
        <tr key={item.id} className="hover:bg-gray-800">
          <td className="p-4 text-gray-300 border-r border-gray-300">{item.name}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">{item.quantity}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">₹{item.price.toFixed(2)}</td>
          <td className="p-4 text-right text-gray-300 border-r border-gray-300">₹{item.totalPrice.toFixed(2)}</td>
          <td className="p-4 text-right text-gray-300 flex justify-end space-x-2">
            <button onClick={() => handleEdit(item)} className="text-blue-500 p-2">
              <Edit />
            </button>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2">
              <Trash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 border border-white rounded-lg w-1/2">
            <h2 className="text-4xl text-purple-600 mb-4 text-center">{editItem ? "Edit Item" : "Add New Item"}</h2>
            <div className="grid grid-rows-3 grid-flow-col gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={editItem ? editItem.name : newItem.item_name}
                onChange={(e) => editItem
                  ? setEditItem({ ...editItem, name: e.target.value })
                  : setNewItem({ ...newItem, item_name: e.target.value })}
                className="p-2 rounded bg-black text-white border border-white rounded"
              />
              <input
                type="number"
                placeholder="Initial Stock"
                value={editItem ? editItem.quantity : newItem.initial_stock}
                onChange={(e) => editItem
                  ? setEditItem({ ...editItem, quantity: +e.target.value })
                  : setNewItem({ ...newItem, initial_stock: +e.target.value })}
                className="p-2 rounded bg-black text-white border border-white rounded"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={editItem ? editItem.price : newItem.unit_price}
                onChange={(e) => editItem
                  ? setEditItem({ ...editItem, price: +e.target.value })
                  : setNewItem({ ...newItem, unit_price: +e.target.value })}
                className="p-2 rounded bg-black text-white border border-white rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={closeModal} className="text-white bg-red-500 p-2 rounded">Cancel</button>
              <button
                onClick={editItem ? handleUpdate : handleAdd}
                className="bg-green-600 text-white p-2 rounded"
              >
                {editItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
