import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import PurchaseForm from '../components/PurchaseForm';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiShoppingCart, FiCalendar, FiUser, FiPackage } = FiIcons;

const Purchases = () => {
  const { purchases, laptops } = useLaptop();
  const [showForm, setShowForm] = useState(false);

  const totalPurchaseValue = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Records</h1>
          <p className="text-gray-600">Track all your laptop purchases and supplier information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-primary-700 transition-colors shadow-lg"
        >
          <SafeIcon icon={FiPlus} />
          <span>Record Purchase</span>
        </motion.button>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiShoppingCart} className="text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{purchases.length}</h3>
            <p className="text-gray-600">Total Purchases</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiPackage} className="text-xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {purchases.reduce((sum, purchase) => sum + purchase.quantity, 0)}
            </h3>
            <p className="text-gray-600">Units Purchased</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SafeIcon icon={FiShoppingCart} className="text-xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalPurchaseValue.toLocaleString()}</h3>
            <p className="text-gray-600">Total Value</p>
          </div>
        </div>
      </motion.div>

      {/* Purchase List */}
      {purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase, index) => {
            const laptop = laptops.find(l => l.id === purchase.laptopId);
            return (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <SafeIcon icon={FiShoppingCart} className="text-xl text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {laptop ? `${laptop.brand} ${laptop.model}` : 'Unknown Laptop'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiPackage} className="text-gray-400" />
                            <span>Quantity: {purchase.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiUser} className="text-gray-400" />
                            <span>Supplier: {purchase.supplier}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiCalendar} className="text-gray-400" />
                            <span>{format(new Date(purchase.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div>
                            <span>Unit Price: ₹{purchase.unitPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{purchase.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Amount</div>
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
          <SafeIcon icon={FiShoppingCart} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases recorded</h3>
          <p className="text-gray-600 mb-6">Start by recording your first laptop purchase</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Record Your First Purchase
          </button>
        </motion.div>
      )}

      {/* Purchase Form Modal */}
      <PurchaseForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default Purchases;