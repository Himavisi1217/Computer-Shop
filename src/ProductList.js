import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import './ProductList.css'; // Import ProductList CSS

const SUPABASE_URL = 'https://pulfalwtedkoxiatwaof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bGZhbHd0ZWRrb3hpYXR3YW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwMDQyOTUsImV4cCI6MjAzNzU4MDI5NX0.hZzrMZhDoKyCkNGEM5DJrxZGQtcXTguxl8e_CTnu6Bw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const categories = [
  'Laptops',
  'Desktops',
  'Monitors',
  'Keyboards/Mouse',
  'Printers',
  'Scanners',
  'CPU',
  'GPU',
  'RAM',
  'Storage',
  'Power Supply',
  'Motherboards',
  'Coolers',
  'Casings',
  'Other',
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', selectedCategory);
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError('Error fetching products: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="app">
      <nav>
        <Link to="/add-product">Add Product</Link>
        <Link to="/products">View Products</Link>
      </nav>
      <div className="content">
        <div className="sidebar">
          <h2>Categories</h2>
          <ul>
            {categories.map((cat) => (
              <li
                key={cat}
                className={cat === selectedCategory ? 'selected' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          <h1>{selectedCategory} Products</h1>
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
                <tr key={product.product_id}>
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
      </div>
    </div>
  );
};

export default ProductList;
