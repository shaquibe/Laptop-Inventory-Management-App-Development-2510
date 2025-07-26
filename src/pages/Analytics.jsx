import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../common/SafeIcon';
import { useLaptop } from '../context/LaptopContext';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPercent } = FiIcons;

const Analytics = () => {
  const { laptops, purchases, sales } = useLaptop();

  // Calculate key metrics
  const totalInventoryValue = laptops.reduce((sum, laptop) => sum + (laptop.quantity * laptop.purchasePrice), 0);
  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPurchaseValue = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalProfit = sales.reduce((sum, sale) => {
    const laptop = laptops.find(l => l.id === sale.laptopId);
    if (laptop) {
      return sum + ((sale.unitPrice - laptop.purchasePrice) * sale.quantity);
    }
    return sum;
  }, 0);

  const profitMargin = totalSalesValue > 0 ? (totalProfit / totalSalesValue) * 100 : 0;

  // Generate monthly data for the last 6 months
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const monthlyData = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= monthStart && saleDate <= monthEnd;
    });
    
    const monthPurchases = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });

    const salesAmount = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const purchasesAmount = monthPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const profit = monthSales.reduce((sum, sale) => {
      const laptop = laptops.find(l => l.id === sale.laptopId);
      if (laptop) {
        return sum + ((sale.unitPrice - laptop.purchasePrice) * sale.quantity);
      }
      return sum;
    }, 0);

    return {
      month: format(month, 'MMM yyyy'),
      sales: salesAmount,
      purchases: purchasesAmount,
      profit: profit,
    };
  });

  // Sales vs Purchases Chart
  const salesPurchasesOption = {
    title: {
      text: 'Sales vs Purchases',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          result += `${param.seriesName}: ₹${param.value.toLocaleString()}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Sales', 'Purchases'],
      top: 30,
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map(d => d.month),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return '₹' + (value / 1000) + 'K';
        }
      }
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: monthlyData.map(d => d.sales),
        itemStyle: { color: '#10b981' }
      },
      {
        name: 'Purchases',
        type: 'bar',
        data: monthlyData.map(d => d.purchases),
        itemStyle: { color: '#3b82f6' }
      }
    ]
  };

  // Profit Trend Chart
  const profitTrendOption = {
    title: {
      text: 'Profit Trend',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return `${params[0].axisValue}<br/>Profit: ₹${params[0].value.toLocaleString()}`;
      }
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map(d => d.month),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return '₹' + (value / 1000) + 'K';
        }
      }
    },
    series: [
      {
        name: 'Profit',
        type: 'line',
        data: monthlyData.map(d => d.profit),
        smooth: true,
        itemStyle: { color: '#f59e0b' },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.1)' }
            ]
          }
        }
      }
    ]
  };

  // Brand Distribution
  const brandData = laptops.reduce((acc, laptop) => {
    acc[laptop.brand] = (acc[laptop.brand] || 0) + laptop.quantity;
    return acc;
  }, {});

  const brandDistributionOption = {
    title: {
      text: 'Inventory by Brand',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Inventory',
        type: 'pie',
        radius: '60%',
        data: Object.entries(brandData).map(([brand, quantity]) => ({
          value: quantity,
          name: brand
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">Comprehensive insights into your laptop business performance</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="text-xl text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalInventoryValue.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Inventory Value</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-success-600" />
            </div>
            <span className="text-sm font-medium text-success-600">Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalSalesValue.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Sales</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="text-xl text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Profit</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalProfit.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Profit</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiPercent} className="text-xl text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">Margin</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{profitMargin.toFixed(1)}%</h3>
          <p className="text-gray-600 text-sm">Profit Margin</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <ReactECharts option={salesPurchasesOption} style={{ height: '400px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <ReactECharts option={profitTrendOption} style={{ height: '400px' }} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <ReactECharts option={brandDistributionOption} style={{ height: '400px' }} />
        </motion.div>

        {/* Top Performing Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Models</h3>
          <div className="space-y-4">
            {laptops
              .map(laptop => {
                const soldQuantity = sales
                  .filter(sale => sale.laptopId === laptop.id)
                  .reduce((sum, sale) => sum + sale.quantity, 0);
                const revenue = sales
                  .filter(sale => sale.laptopId === laptop.id)
                  .reduce((sum, sale) => sum + sale.totalAmount, 0);
                return { ...laptop, soldQuantity, revenue };
              })
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((laptop, index) => (
                <div key={laptop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{laptop.brand} {laptop.model}</p>
                      <p className="text-sm text-gray-600">{laptop.soldQuantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{laptop.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;