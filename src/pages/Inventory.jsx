import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import LaptopForm from '../components/LaptopForm';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiPackage } = FiIcons;

const Inventory = () => {
  const { laptops, deleteLaptop } = useLaptop();
  const [showForm, setShowForm] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const filteredLaptops = laptops.filter(laptop => {
    const matchesSearch = 
      laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterBy === 'all' ||
      (filterBy === 'low-stock' && laptop.quantity <= laptop.minStockLevel) ||
      (filterBy === 'in-stock' && laptop.quantity > laptop.minStockLevel);
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (laptop) => {
    setEditingLaptop(laptop);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this laptop?')) {
      deleteLaptop(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLaptop(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your laptop stock and monitor inventory levels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-primary-700 transition-colors shadow-lg"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add New Laptop</span>
        </motion.button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search laptops by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Inventory Grid */}
      <AnimatePresence>
        {filteredLaptops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaptops.map((laptop, index) => (
              <motion.div
                key={laptop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {laptop.brand} {laptop.model}
                      </h3>
                      <p className="text-sm text-gray-600">{laptop.specifications}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(laptop)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEdit2} />
                      </button>
                      <button
                        onClick={() => handleDelete(laptop.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>

                  {/* Only show pricing if available */}
                  {laptop.purchasePrice > 0 && laptop.sellingPrice > 0 && (
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Purchase Price</span>
                        <span className="font-semibold text-gray-900">₹{laptop.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Selling Price</span>
                        <span className="font-semibold text-success-600">₹{laptop.sellingPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Profit Margin</span>
                        <span className="font-semibold text-success-600">
                          ₹{(laptop.sellingPrice - laptop.purchasePrice).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Stock level information */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock Level</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          laptop.quantity <= laptop.minStockLevel
                            ? 'bg-red-100 text-red-800'
                            : 'bg-success-100 text-success-800'
                        }`}>
                          {laptop.quantity <= laptop.minStockLevel ? 'Low Stock' : 'In Stock'}
                        </span>
                        <span className="font-semibold text-gray-900">{laptop.quantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Show message if no pricing info */}
                  {(laptop.purchasePrice === 0 || laptop.sellingPrice === 0) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        Set pricing when recording purchases and sales
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiPackage} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No laptops found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first laptop to the inventory'
              }
            </p>
            {!searchTerm && filterBy === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add Your First Laptop
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Laptop Form Modal */}
      <LaptopForm
        isOpen={showForm}
        onClose={handleCloseForm}
        laptop={editingLaptop}
      />
    </div>
  );
};

export default Inventory;