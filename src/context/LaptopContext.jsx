import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const LaptopContext = createContext();

const initialState = {
  laptops: [],
  purchases: [],
  sales: [],
  loading: false,
  error: null,
};

// Sample data for demonstration
const sampleData = {
  laptops: [
    {
      id: '1',
      brand: 'Dell',
      model: 'XPS 13',
      specifications: 'Intel i7, 16GB RAM, 512GB SSD',
      purchasePrice: 65000,
      sellingPrice: 75000,
      quantity: 5,
      minStockLevel: 2,
      dateAdded: new Date().toISOString(),
    },
    {
      id: '2',
      brand: 'HP',
      model: 'Pavilion 15',
      specifications: 'Intel i5, 8GB RAM, 256GB SSD',
      purchasePrice: 45000,
      sellingPrice: 52000,
      quantity: 8,
      minStockLevel: 3,
      dateAdded: new Date().toISOString(),
    },
    {
      id: '3',
      brand: 'Lenovo',
      model: 'ThinkPad X1',
      specifications: 'Intel i7, 32GB RAM, 1TB SSD',
      purchasePrice: 85000,
      sellingPrice: 95000,
      quantity: 3,
      minStockLevel: 1,
      dateAdded: new Date().toISOString(),
    },
  ],
  purchases: [
    {
      id: '1',
      laptopId: '1',
      quantity: 5,
      unitPrice: 65000,
      totalAmount: 325000,
      supplier: 'Tech Distributors',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      laptopId: '2',
      quantity: 8,
      unitPrice: 45000,
      totalAmount: 360000,
      supplier: 'Laptop World',
      date: new Date().toISOString(),
    },
  ],
  sales: [
    {
      id: '1',
      laptopId: '1',
      quantity: 2,
      unitPrice: 75000,
      totalAmount: 150000,
      customer: 'John Doe',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      laptopId: '2',
      quantity: 1,
      unitPrice: 52000,
      totalAmount: 52000,
      customer: 'Jane Smith',
      date: new Date().toISOString(),
    },
  ],
};

function laptopReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload, loading: false };
    
    case 'ADD_LAPTOP':
      return {
        ...state,
        laptops: [...state.laptops, { ...action.payload, id: uuidv4() }],
      };
    
    case 'UPDATE_LAPTOP':
      return {
        ...state,
        laptops: state.laptops.map(laptop =>
          laptop.id === action.payload.id ? action.payload : laptop
        ),
      };
    
    case 'DELETE_LAPTOP':
      return {
        ...state,
        laptops: state.laptops.filter(laptop => laptop.id !== action.payload),
      };
    
    case 'ADD_PURCHASE':
      const newPurchase = { ...action.payload, id: uuidv4() };
      const updatedLaptopsAfterPurchase = state.laptops.map(laptop =>
        laptop.id === action.payload.laptopId
          ? { ...laptop, quantity: laptop.quantity + action.payload.quantity }
          : laptop
      );
      return {
        ...state,
        purchases: [...state.purchases, newPurchase],
        laptops: updatedLaptopsAfterPurchase,
      };
    
    case 'ADD_SALE':
      const newSale = { ...action.payload, id: uuidv4() };
      const updatedLaptopsAfterSale = state.laptops.map(laptop =>
        laptop.id === action.payload.laptopId
          ? { ...laptop, quantity: laptop.quantity - action.payload.quantity }
          : laptop
      );
      return {
        ...state,
        sales: [...state.sales, newSale],
        laptops: updatedLaptopsAfterSale,
      };
    
    default:
      return state;
  }
}

export const LaptopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(laptopReducer, initialState);

  useEffect(() => {
    // Load data from localStorage or initialize with sample data
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('laptopStockData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          dispatch({ type: 'LOAD_DATA', payload: parsedData });
        } else {
          dispatch({ type: 'LOAD_DATA', payload: sampleData });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'LOAD_DATA', payload: sampleData });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    if (state.laptops.length > 0) {
      localStorage.setItem('laptopStockData', JSON.stringify({
        laptops: state.laptops,
        purchases: state.purchases,
        sales: state.sales,
      }));
    }
  }, [state.laptops, state.purchases, state.sales]);

  const addLaptop = (laptop) => {
    dispatch({ type: 'ADD_LAPTOP', payload: laptop });
    toast.success('Laptop added successfully!');
  };

  const updateLaptop = (laptop) => {
    dispatch({ type: 'UPDATE_LAPTOP', payload: laptop });
    toast.success('Laptop updated successfully!');
  };

  const deleteLaptop = (id) => {
    dispatch({ type: 'DELETE_LAPTOP', payload: id });
    toast.success('Laptop deleted successfully!');
  };

  const addPurchase = (purchase) => {
    dispatch({ type: 'ADD_PURCHASE', payload: purchase });
    toast.success('Purchase recorded successfully!');
  };

  const addSale = (sale) => {
    const laptop = state.laptops.find(l => l.id === sale.laptopId);
    if (!laptop || laptop.quantity < sale.quantity) {
      toast.error('Insufficient stock!');
      return false;
    }
    dispatch({ type: 'ADD_SALE', payload: sale });
    toast.success('Sale recorded successfully!');
    return true;
  };

  const value = {
    ...state,
    addLaptop,
    updateLaptop,
    deleteLaptop,
    addPurchase,
    addSale,
  };

  return (
    <LaptopContext.Provider value={value}>
      {children}
    </LaptopContext.Provider>
  );
};

export const useLaptop = () => {
  const context = useContext(LaptopContext);
  if (!context) {
    throw new Error('useLaptop must be used within a LaptopProvider');
  }
  return context;
};