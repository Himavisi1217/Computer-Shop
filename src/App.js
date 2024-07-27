// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import './App.css';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<ProductForm />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
    </Router>
  );
};

export default App;