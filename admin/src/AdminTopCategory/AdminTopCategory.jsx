import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import './AdminTopCategory.scss';
import MyContext from '../Context/MyContext';

const AdminTopCategory = () => {

  const{apiUrl,title, setTitle,categoriesText, setCategoriesText,img, setImg,topCategories, setTopCategories,
        editingId, setEditingId,editTitle, setEditTitle,editCategoriesText, setEditCategoriesText,editImage, setEditImage} =useContext(MyContext)
  

  const fetchCategories = async () => {
    const res = await axios.get(`${apiUrl}/api/top-categories`);
    setTopCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  },);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('categories', JSON.stringify(categoriesText.split(',').map(c => c.trim())));
    formData.append('image', img);

    await axios.post(`${apiUrl}/api/top-categories`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setTitle('');
    setCategoriesText('');
    setImg(null);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/api/top-categories/${id}`);
    fetchCategories();
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditTitle(cat.title);
    setEditCategoriesText(cat.categories.join(', '));
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditCategoriesText('');
    setEditImage(null);
  };

  const handleEditSubmit = async (id) => {
    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('categories', JSON.stringify(editCategoriesText.split(',').map(c => c.trim())));
    if (editImage) {
      formData.append('image', editImage);
    }

    await axios.put(`${apiUrl}/api/top-categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    cancelEdit();
    fetchCategories();
  };

  return (
    <div className="admin-top-category">
      <h2>Manage Top Categories</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Title (e.g. Men)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categories (comma separated: shirts, Sports-Wear)"
          value={categoriesText}
          onChange={(e) => setCategoriesText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <button type="submit">Add Category</button>
      </form>

      <div className="category-list">
        {topCategories?.map((cat) => (
          <div className="category-item" key={cat.id}>
            <img src={cat.img} alt={cat.title} />

            {editingId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Categories (comma separated)"
                  value={editCategoriesText}
                  onChange={(e) => setEditCategoriesText(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])}
                />
                <div className="btn-group">
                  <button onClick={() => handleEditSubmit(cat.id)}>Save</button>
                  <button onClick={cancelEdit} className="cancel">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{cat.title}</strong></p>
                <small>{cat.categories?.join(', ')}</small>
                <div className="btn-group">
                  <button onClick={() => startEdit(cat)}>Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="delete">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTopCategory;
