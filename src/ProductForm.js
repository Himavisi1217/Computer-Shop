// src/ProductForm.js
import React, { useState } from 'react';
import { storage } from './firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

// Initialize Supabase client
const SUPABASE_URL = 'https://pulfalwtedkoxiatwaof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bGZhbHd0ZWRrb3hpYXR3YW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwMDQyOTUsImV4cCI6MjAzNzU4MDI5NX0.hZzrMZhDoKyCkNGEM5DJrxZGQtcXTguxl8e_CTnu6Bw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      // Insert product data into Supabase
      const { error } = await supabase
        .from('products')
        .insert([
          {
            product_name: name,
            price: parseFloat(price.replace(/[^0-9.-]+/g,"")),
            product_description: description,
            stock: parseInt(stock),
            photo: photoUrl // Save the photo URL from Firebase
          }
        ]);

      if (error) {
        throw error;
      }

      alert('Product added successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setStock('');
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
        <Link to="/">Add Product</Link>
        <Link to="/products">View Products</Link>
      </nav>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="price">Price (LKR):</label>
        <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <label htmlFor="stock">Stock:</label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

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
