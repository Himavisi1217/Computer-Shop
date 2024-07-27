// src/ProductList.js
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const SUPABASE_URL = 'https://pulfalwtedkoxiatwaof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bGZhbHd0ZWRrb3hpYXR3YW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwMDQyOTUsImV4cCI6MjAzNzU4MDI5NX0.hZzrMZhDoKyCkNGEM5DJrxZGQtcXTguxl8e_CTnu6Bw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError('Error fetching products: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
        <nav>
          <Link to="/">Add Product</Link>
          <Link to="/products">View Products</Link>
        </nav>
      <h1>Product List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Stock</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.product_name}</td>
              <td>LKR {product.price.toFixed(2)}</td>
              <td>{product.product_description}</td>
              <td>{product.stock}</td>
              <td>
                <img
                  src={product.photo}
                  alt={product.product_name}
                  style={{ width: '100px', height: 'auto' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;