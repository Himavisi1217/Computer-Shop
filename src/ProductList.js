import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { storage } from './firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProductList.css'; // Scoped CSS for this component only

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
  Laptops: ['brand', 'model', 'processor', 'ram', 'storage', 'gpu', 'price', 'additional_details'],
  Desktops: ['brand', 'model', 'processor', 'ram', 'storage', 'gpu', 'price', 'additional_details'],
  Monitors: ['brand', 'model', 'screen_size', 'resolution', 'price'],
  'Keyboards/Mouse': ['brand', 'model', 'type', 'price'],
  Printers: ['brand', 'model', 'type', 'price'],
  Scanners: ['brand', 'model', 'type', 'price'],
  CPU: ['brand', 'model', 'core_count', 'price'],
  GPU: ['brand', 'model', 'memory_size', 'price'],
  RAM: ['brand', 'type', 'capacity', 'price'],
  Storage: ['brand', 'type', 'capacity', 'price'],
  'Power Supply': ['brand', 'model', 'wattage', 'price'],
  Motherboards: ['brand', 'model', 'form_factor', 'price'],
  Coolers: ['brand', 'model', 'type', 'price'],
  Casings: ['brand', 'model', 'form_factor_compatibility', 'price'],
  Other: ['brand', 'model', 'description', 'price'],
};

const ProductList = () => {
  const [products, setProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let newProducts = {};
      for (const category of categories) {
        const tableName = category.toLowerCase().replace('/', '_').replace(' ', '_'); // Ensure proper naming
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) {
          console.error(`Error fetching ${category}:`, error);
        } else {
          newProducts[category] = data;
        }
      }
      setProducts(newProducts);
    };

    fetchData();
  }, []);

  const handleEdit = (product, category) => {
    setEditingProduct({ ...product, category });
    setFormData({ ...product });
  };

  const handleDelete = async (product, category) => {
    const { id } = product;
    const tableName = category.toLowerCase().replace('/', '_').replace(' ', '_');
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      console.error(`Error deleting product:`, error);
    } else {
      setProducts((prevProducts) => ({
        ...prevProducts,
        [category]: prevProducts[category].filter((item) => item.id !== id),
      }));
    }
  };

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

    try {
      let photoUrl = formData.photo;
      if (photo) {
        const photoRef = ref(storage, `products/${Date.now()}-${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      const updatedData = {
        ...formData,
        price: parseFloat(formData.price.replace(/[^0-9.-]+/g, "")),
        photo: photoUrl,
      };

      const tableName = editingProduct.category.toLowerCase().replace('/', '_').replace(' ', '_');
      const { error } = await supabase
        .from(tableName)
        .update(updatedData)
        .eq('id', editingProduct.id);

      if (error) {
        throw error;
      }

      setProducts((prevProducts) => ({
        ...prevProducts,
        [editingProduct.category]: prevProducts[editingProduct.category].map((item) =>
          item.id === editingProduct.id ? updatedData : item
        ),
      }));

      alert('Product updated successfully!');
      setEditingProduct(null);
      setFormData({});
      setPhoto(null);
    } catch (err) {
      setError('Error updating product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-list-container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category} onClick={() => setSelectedCategory(category)}>
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className="product-content">
        <h1>{selectedCategory} Products</h1>
        {products[selectedCategory]?.length > 0 ? (
          <table className="product-table">
            <thead>
              <tr>
                {categoryFields[selectedCategory].map((field) => (
                  <th key={field}>{field}</th>
                ))}
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products[selectedCategory].map((product) => (
                <tr key={product.id}>
                  {categoryFields[selectedCategory].map((field) => (
                    <td key={field}>{product[field]}</td>
                  ))}
                  <td><img src={product.photo} alt={product.model} className="product-photo" /></td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(product, selectedCategory)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(product, selectedCategory)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found in this category.</p>
        )}

        {editingProduct && (
          <div className="edit-form">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
              {categoryFields[editingProduct.category].map((field) => (
                <div key={field}>
                  <label htmlFor={field}>{field}:</label>
                  {field === 'additional_details' || field === 'description' ? (
                    <textarea
                      id={field}
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  ) : (
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      required
                    />
                  )}
                </div>
              ))}
              <label htmlFor="photo">Photo:</label>
              <input type="file" id="photo" onChange={(e) => setPhoto(e.target.files[0])} />
              <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
