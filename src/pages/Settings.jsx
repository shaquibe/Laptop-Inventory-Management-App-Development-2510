import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiUpload, FiTrash2, FiDatabase, FiSettings, FiUser, FiMail, FiPhone } = FiIcons;

const Settings = () => {
  const { laptops, purchases, sales } = useLaptop();
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Laptop Store Pro',
    ownerName: 'John Doe',
    email: 'john@laptopstore.com',
    phone: '+91 9876543210',
    address: '123 Business Street, Mumbai, Maharashtra',
  });

  const handleExportData = () => {
    const data = {
      laptops,
      purchases,
      sales,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laptop-stock-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem('laptopStockData', JSON.stringify({
          laptops: data.laptops || [],
          purchases: data.purchases || [],
          sales: data.sales || [],
        }));
        toast.success('Data imported successfully! Please refresh the page.');
      } catch (error) {
        toast.error('Invalid file format!');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('laptopStockData');
      toast.success('All data cleared! Please refresh the page.');
    }
  };

  const handleBusinessInfoChange = (e) => {
    setBusinessInfo({
      ...businessInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveBusinessInfo = () => {
    localStorage.setItem('businessInfo', JSON.stringify(businessInfo));
    toast.success('Business information saved!');
  };

  // Load business info from localStorage
  React.useEffect(() => {
    const savedBusinessInfo = localStorage.getItem('businessInfo');
    if (savedBusinessInfo) {
      setBusinessInfo(JSON.parse(savedBusinessInfo));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your application settings and business information</p>
      </motion.div>

      <div className="space-y-8">
        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUser} className="text-xl text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={businessInfo.businessName}
                onChange={handleBusinessInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                value={businessInfo.ownerName}
                onChange={handleBusinessInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={businessInfo.email}
                onChange={handleBusinessInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={businessInfo.phone}
                onChange={handleBusinessInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={businessInfo.address}
                onChange={handleBusinessInfoChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveBusinessInfo}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Business Information
            </button>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDatabase} className="text-xl text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="text-green-600" />
              <span className="font-medium text-green-700">Export Data</span>
            </button>

            <label className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
              <SafeIcon icon={FiUpload} className="text-blue-600" />
              <span className="font-medium text-blue-700">Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearData}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="text-red-600" />
              <span className="font-medium text-red-700">Clear All Data</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Data Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Laptops:</span>
                <span className="ml-2 font-semibold">{laptops.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Purchases:</span>
                <span className="ml-2 font-semibold">{purchases.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Sales:</span>
                <span className="ml-2 font-semibold">{sales.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Application Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSettings} className="text-xl text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Application Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Features</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Laptop inventory management</li>
                <li>• Purchase tracking</li>
                <li>• Sales recording</li>
                <li>• Profit analytics</li>
                <li>• Data export/import</li>
                <li>• Responsive design</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Technology Stack</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• React 18</li>
                <li>• Tailwind CSS</li>
                <li>• Framer Motion</li>
                <li>• ECharts</li>
                <li>• Local Storage</li>
                <li>• Progressive Web App</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              <strong>Version:</strong> 1.0.0 | 
              <strong className="ml-4">Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;