// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Login from './Login';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<PrivateRoute element={<ProductList />} />} />
        <Route path="/add-product" element={<PrivateRoute element={<ProductForm />} />} />
      </Routes>
    </Router>
  );
};

export default App;
