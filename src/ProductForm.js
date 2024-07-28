import React, { useState } from 'react';
import { storage } from './firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import './ProductForm.css'; // Import ProductForm CSS

// Initialize Supabase client
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

const categoryFields = {
  Laptops: ['Brand', 'Model', 'Processor', 'RAM', 'Storage', 'GPU', 'Price', 'Additional Details'],
  Desktops: ['Brand', 'Model', 'Processor', 'RAM', 'Storage', 'GPU', 'Price', 'Additional Details'],
  Monitors: ['Brand', 'Model', 'Screen Size', 'Resolution', 'Price'],
  'Keyboards/Mouse': ['Brand', 'Model', 'Type', 'Price'],
  Printers: ['Brand', 'Model', 'Type', 'Price'],
  Scanners: ['Brand', 'Model', 'Type', 'Price'],
  CPU: ['Brand', 'Model', 'Core Count', 'Price'],
  GPU: ['Brand', 'Model', 'Memory Size', 'Price'],
  RAM: ['Brand', 'Type', 'Capacity', 'Price'],
  Storage: ['Brand', 'Type', 'Capacity', 'Price'],
  'Power Supply': ['Brand', 'Model', 'Wattage', 'Price'],
  Motherboards: ['Brand', 'Model', 'Form Factor', 'Price'],
  Coolers: ['Brand', 'Model', 'Type', 'Price'],
  Casings: ['Brand', 'Model', 'Form Factor Compatibility', 'Price'],
  Other: ['Brand', 'Model', 'Description', 'Price'],
};


const ProductForm = () => {
  const [category, setCategory] = useState(categories[0]);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (!photo) {
      setError('Please upload a photo.');
      setLoading(false);
      return;
    }
  
    try {
      // Upload photo to Firebase Storage
      const photoRef = ref(storage, `products/${Date.now()}-${photo.name}`);
      await uploadBytes(photoRef, photo);
      const photoUrl = await getDownloadURL(photoRef);
  
      // Prepare data for insertion
      const data = {
        ...formData,
        price: parseFloat(formData.price.replace(/[^0-9.-]+/g, "")),
        photo: photoUrl, // Save the photo URL from Firebase
      };
  
      // Determine table name
      const tableName = category.toLowerCase().replace('/', '_').replace(' ', '_');
      console.log('Inserting into table:', tableName);
      console.log('Data:', data);
  
      // Insert product data into Supabase
      const { error } = await supabase
        .from(tableName) // Use category name as table name, with '/' replaced by '_'
        .insert([data]);
  
      if (error) {
        throw error;
      }
  
      alert('Product added successfully!');
      setFormData({});
      setCategory(categories[0]);
      setPhoto(null);
    } catch (err) {
      setError('Error adding product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container">
      <nav>
        <Link to="/add-product">Add Product</Link>
        <Link to="/products">View Products</Link>
      </nav>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {categoryFields[category].map((field) => (
          <div key={field}>
            <label htmlFor={field.toLowerCase()}>{field}:</label>
            {field === 'Additional Details' ? (
              <textarea
                id={field.toLowerCase().replace(' ', '_')}
                name={field.toLowerCase().replace(' ', '_')}
                value={formData[field.toLowerCase().replace(' ', '_')] || ''}
                onChange={handleInputChange}
                required
              ></textarea>
            ) : (
              <input
                type="text"
                id={field.toLowerCase().replace(' ', '_')}
                name={field.toLowerCase().replace(' ', '_')}
                value={formData[field.toLowerCase().replace(' ', '_')] || ''}
                onChange={handleInputChange}
                required
              />
            )}
          </div>
        ))}

        <label htmlFor="photo">Photo:</label>
        <input
          type="file"
          id="photo"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ProductForm;
