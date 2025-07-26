import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import * as FiIcons from 'react-icons/fi';

const { FiPackage, FiShoppingCart, FiTrendingUp, FiDollarSign, FiAlertTriangle, FiArrowRight } = FiIcons;

const Dashboard = () => {
  const { laptops, purchases, sales } = useLaptop();

  const totalInventoryValue = laptops.reduce((sum, laptop) => sum + (laptop.quantity * laptop.purchasePrice), 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProfit = totalSales - purchases.reduce((sum, purchase) => {
    const relatedSales = sales.filter(sale => sale.laptopId === purchase.laptopId);
    const soldQuantity = relatedSales.reduce((qty, sale) => qty + sale.quantity, 0);
    return sum + (soldQuantity * purchase.unitPrice);
  }, 0);

  const lowStockItems = laptops.filter(laptop => laptop.quantity <= laptop.minStockLevel);

  const stats = [
    {
      title: 'Total Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString()}`,
      icon: FiPackage,
      color: 'primary',
      change: '+12%',
    },
    {
      title: 'Total Purchases',
      value: `₹${totalPurchases.toLocaleString()}`,
      icon: FiShoppingCart,
      color: 'blue',
      change: '+8%',
    },
    {
      title: 'Total Sales',
      value: `₹${totalSales.toLocaleString()}`,
      icon: FiTrendingUp,
      color: 'success',
      change: '+15%',
    },
    {
      title: 'Total Profit',
      value: `₹${totalProfit.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'green',
      change: '+22%',
    },
  ];

  const recentTransactions = [
    ...sales.slice(-3).map(sale => ({
      ...sale,
      type: 'sale',
      laptop: laptops.find(l => l.id === sale.laptopId),
    })),
    ...purchases.slice(-2).map(purchase => ({
      ...purchase,
      type: 'purchase',
      laptop: laptops.find(l => l.id === purchase.laptopId),
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your laptop stock management system</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`text-xl text-${stat.color}-600`} />
              </div>
              <span className="text-sm font-medium text-success-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <SafeIcon icon={FiAlertTriangle} className="text-orange-500 mr-2" />
              Low Stock Alert
            </h2>
            <Link 
              to="/inventory"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
            >
              View All <SafeIcon icon={FiArrowRight} className="ml-1" />
            </Link>
          </div>
          
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((laptop) => (
                <div key={laptop.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{laptop.brand} {laptop.model}</p>
                    <p className="text-sm text-gray-600">Only {laptop.quantity} left</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Low Stock
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={FiPackage} className="text-4xl mx-auto mb-2 opacity-50" />
              <p>All items are well stocked!</p>
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link 
              to="/sales"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
            >
              View All <SafeIcon icon={FiArrowRight} className="ml-1" />
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'sale' ? 'bg-success-100' : 'bg-blue-100'
                    }`}>
                      <SafeIcon 
                        icon={transaction.type === 'sale' ? FiTrendingUp : FiShoppingCart} 
                        className={`text-sm ${
                          transaction.type === 'sale' ? 'text-success-600' : 'text-blue-600'
                        }`} 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.laptop?.brand} {transaction.laptop?.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.type === 'sale' ? 'Sold to' : 'Purchased from'} {transaction.customer || transaction.supplier}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'sale' ? 'text-success-600' : 'text-blue-600'
                    }`}>
                      ₹{transaction.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={FiTrendingUp} className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No recent transactions</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;