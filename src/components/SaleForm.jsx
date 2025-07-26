import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import * as FiIcons from 'react-icons/fi';

const { FiX } = FiIcons;

const SaleForm = ({ isOpen, onClose }) => {
  const { laptops, addSale } = useLaptop();
  const [formData, setFormData] = useState({
    laptopId: '',
    quantity: '',
    unitPrice: '',
    customer: '',
    date: new Date().toISOString().split('T')[0],
  });

  const availableLaptops = laptops.filter(laptop => laptop.quantity > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const saleData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      unitPrice: parseInt(formData.unitPrice),
      totalAmount: parseInt(formData.quantity) * parseInt(formData.unitPrice),
      date: new Date(formData.date).toISOString(),
    };

    const success = addSale(saleData);
    if (success) {
      onClose();
      setFormData({
        laptopId: '',
        quantity: '',
        unitPrice: '',
        customer: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedLaptop = laptops.find(l => l.id === formData.laptopId);
  const totalAmount = formData.quantity && formData.unitPrice 
    ? parseInt(formData.quantity) * parseInt(formData.unitPrice)
    : 0;
  
  const profit = selectedLaptop && formData.quantity && formData.unitPrice
    ? (parseInt(formData.unitPrice) - selectedLaptop.purchasePrice) * parseInt(formData.quantity)
    : 0;

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
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Record Sale</h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Laptop *
                    </label>
                    <select
                      name="laptopId"
                      value={formData.laptopId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a laptop</option>
                      {availableLaptops.map(laptop => (
                        <option key={laptop.id} value={laptop.id}>
                          {laptop.brand} {laptop.model} (Stock: {laptop.quantity})
                        </option>
                      ))}
                    </select>
                    {availableLaptops.length === 0 && (
                      <p className="text-sm text-red-600 mt-1">No laptops available in stock</p>
                    )}
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
                        min="1"
                        max={selectedLaptop ? selectedLaptop.quantity : 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1"
                      />
                      {selectedLaptop && (
                        <p className="text-xs text-gray-500 mt-1">
                          Available: {selectedLaptop.quantity}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={selectedLaptop ? selectedLaptop.sellingPrice.toString() : "60000"}
                      />
                      {selectedLaptop && (
                        <p className="text-xs text-gray-500 mt-1">
                          Suggested: ₹{selectedLaptop.sellingPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer *
                    </label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Customer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {totalAmount > 0 && (
                    <div className="bg-success-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-success-600">Total Amount:</span>
                        <span className="font-semibold text-success-700">
                          ₹{totalAmount.toLocaleString()}
                        </span>
                      </div>
                      {profit !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-success-600">Profit:</span>
                          <span className={`font-semibold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            ₹{profit.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

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
                      disabled={availableLaptops.length === 0}
                      className="flex-1 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Record Sale
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

export default SaleForm;