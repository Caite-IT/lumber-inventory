import React, { useState, useEffect } from 'react';
import { Plus, Minus, Package } from 'lucide-react';

const LumberInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: '',
    dimensions: '',
    quantity: 0,
    type: 'inbound'
  });

  // Load data from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInventory = localStorage.getItem('inventory');
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      }
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [inventory]);

  const handleAddTransaction = () => {
    if (!newItem.itemName || !newItem.dimensions || !newItem.quantity) return;

    const quantity = newItem.type === 'inbound' ? 
      parseInt(newItem.quantity) : 
      -parseInt(newItem.quantity);

    const existingItemIndex = inventory.findIndex(
      item => item.itemName === newItem.itemName && item.dimensions === newItem.dimensions
    );

    if (existingItemIndex > -1) {
      const updatedInventory = [...inventory];
      updatedInventory[existingItemIndex] = {
        ...updatedInventory[existingItemIndex],
        balance: updatedInventory[existingItemIndex].balance + quantity,
        transactions: [...updatedInventory[existingItemIndex].transactions, {
          type: newItem.type,
          quantity: Math.abs(quantity),
          date: new Date().toLocaleString()
        }]
      };
      setInventory(updatedInventory);
    } else {
      setInventory([...inventory, {
        itemName: newItem.itemName,
        dimensions: newItem.dimensions,
        balance: quantity,
        transactions: [{
          type: newItem.type,
          quantity: Math.abs(quantity),
          date: new Date().toLocaleString()
        }]
      }]);
    }

    setNewItem({
      itemName: '',
      dimensions: '',
      quantity: 0,
      type: 'inbound'
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-6 w-6" />
          <h1 className="text-xl font-bold">Lumber Inventory Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name (e.g., Pine, Oak)"
            className="p-2 border rounded"
            value={newItem.itemName}
            onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
          />
          <input
            type="text"
            placeholder="Dimensions (e.g., 2x4x8)"
            className="p-2 border rounded"
            value={newItem.dimensions}
            onChange={(e) => setNewItem({...newItem, dimensions: e.target.value})}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="p-2 border rounded"
            value={newItem.quantity}
            onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
          />
          <select
            className="p-2 border rounded"
            value={newItem.type}
            onChange={(e) => setNewItem({...newItem, type: e.target.value})}
          >
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
        </div>
        <button
          onClick={handleAddTransaction}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </div>

      <div className="grid gap-4">
        {inventory.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.itemName}</h3>
                <p className="text-gray-600">{item.dimensions}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  Balance: {item.balance}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {item.transactions.map((transaction, tIndex) => (
                <div key={tIndex} className="flex items-center gap-2 text-sm">
                  {transaction.type === 'inbound' ? 
                    <Plus className="h-4 w-4 text-green-500" /> : 
                    <Minus className="h-4 w-4 text-red-500" />
                  }
                  <span>{transaction.quantity}</span>
                  <span className="text-gray-500">{transaction.date}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LumberInventory;
