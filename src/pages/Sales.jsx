import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import SaleForm from '../components/SaleForm';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrendingUp, FiCalendar, FiUser, FiPackage } = FiIcons;

const Sales = () => {
  const { sales, laptops, purchases } = useLaptop();
  const [showForm, setShowForm] = useState(false);

  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  const totalProfit = sales.reduce((sum, sale) => {
    const laptop = laptops.find(l => l.id === sale.laptopId);
    if (laptop) {
      return sum + ((sale.unitPrice - laptop.purchasePrice) * sale.quantity);
    }
    return sum;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Records</h1>
          <p className="text-gray-600">Track all your laptop sales and customer information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-success-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-success-700 transition-colors shadow-lg"
        >
          <SafeIcon icon={FiPlus} />
          <span>Record Sale</span>
        </motion.button>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-success-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{sales.length}</h3>
            <p className="text-gray-600">Total Sales</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiPackage} className="text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {sales.reduce((sum, sale) => sum + sale.quantity, 0)}
            </h3>
            <p className="text-gray-600">Units Sold</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalSalesValue.toLocaleString()}</h3>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalProfit.toLocaleString()}</h3>
            <p className="text-gray-600">Total Profit</p>
          </div>
        </div>
      </motion.div>

      {/* Sales List */}
      {sales.length > 0 ? (
        <div className="space-y-4">
          {sales.map((sale, index) => {
            const laptop = laptops.find(l => l.id === sale.laptopId);
            const profit = laptop ? (sale.unitPrice - laptop.purchasePrice) * sale.quantity : 0;
            
            return (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                        <SafeIcon icon={FiTrendingUp} className="text-xl text-success-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {laptop ? `${laptop.brand} ${laptop.model}` : 'Unknown Laptop'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiPackage} className="text-gray-400" />
                            <span>Quantity: {sale.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiUser} className="text-gray-400" />
                            <span>Customer: {sale.customer}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiCalendar} className="text-gray-400" />
                            <span>{format(new Date(sale.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div>
                            <span>Unit Price: ₹{sale.unitPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                    <div className="text-2xl font-bold text-success-600">
                      ₹{sale.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="text-lg font-semibold text-green-600 mt-1">
                      +₹{profit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Profit</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiTrendingUp} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No sales recorded</h3>
          <p className="text-gray-600 mb-6">Start by recording your first laptop sale</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-success-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-success-700 transition-colors"
          >
            Record Your First Sale
          </button>
        </motion.div>
      )}

      {/* Sale Form Modal */}
      <SaleForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default Sales;