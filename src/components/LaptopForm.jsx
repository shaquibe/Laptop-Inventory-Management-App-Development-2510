import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import * as FiIcons from 'react-icons/fi';

const { FiX } = FiIcons;

const LaptopForm = ({ isOpen, onClose, laptop }) => {
  const { addLaptop, updateLaptop } = useLaptop();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    specifications: '',
    quantity: '',
    minStockLevel: '',
  });

  useEffect(() => {
    if (laptop) {
      setFormData({
        brand: laptop.brand,
        model: laptop.model,
        specifications: laptop.specifications,
        quantity: laptop.quantity.toString(),
        minStockLevel: laptop.minStockLevel.toString(),
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        specifications: '',
        quantity: '',
        minStockLevel: '',
      });
    }
  }, [laptop]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const laptopData = {
      ...formData,
      // Set default prices to 0 for new laptops without pricing info
      purchasePrice: laptop ? laptop.purchasePrice : 0,
      sellingPrice: laptop ? laptop.sellingPrice : 0,
      quantity: parseInt(formData.quantity),
      minStockLevel: parseInt(formData.minStockLevel),
      dateAdded: laptop ? laptop.dateAdded : new Date().toISOString(),
    };

    if (laptop) {
      updateLaptop({ ...laptopData, id: laptop.id });
    } else {
      addLaptop(laptopData);
    }

    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {laptop ? 'Edit Laptop' : 'Add New Laptop'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Dell, HP, Lenovo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., XPS 13, Pavilion"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specifications *
                    </label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Intel i7, 16GB RAM, 512GB SSD"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Stock Level *
                      </label>
                      <input
                        type="number"
                        name="minStockLevel"
                        value={formData.minStockLevel}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="2"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Note:</div>
                    <div className="text-xs text-blue-700">
                      Pricing information can be set when recording purchases and sales.
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {laptop ? 'Update' : 'Add'} Laptop
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LaptopForm;