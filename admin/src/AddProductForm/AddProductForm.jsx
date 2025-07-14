import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./AddProductForm.scss";
import { useFormik } from "formik";
import MyContext from "../Context/MyContext";

const AddProductForm = () => {
  const {
    apiUrl,
    products,
    setProducts,
    descriptionText,
    setDescriptionText,
    sideImageFiles,
    setSideImageFiles,
  } = useContext(MyContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState('');
  const [editProductId, setEditProductId] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/data`);
      if (res.data.success && Array.isArray(res.data.data)) {
        const allProducts = res.data.data.flatMap((cat) =>
          cat.products.map((prod) => ({
            ...prod,
            category: cat.category,
          }))
        );
        setProducts(allProducts);
      }
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (category, id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${apiUrl}/api/data/${category}/${id}`);
        alert("🗑️ Deleted successfully");
        fetchData();
      } catch (error) {
        alert("❌ Error deleting product");
      }
    }
  };

  const handleEdit = (product) => {
    formik.setValues({
      name: product.productname || '',
      price: product.productprice || '',
      oldprice: product.productoldprice || '',
      category: product.category || '',
      title: product.title || '',
      productbrand: product.productbrand || '',
      review: product.review || 0,
      tomorrow: product.tomorrow || false,
      sizes: product.sizes_product
        ? Object.fromEntries(
            Object.keys(formik.values.sizes).map((size) => [
              size,
              product.sizes_product.some((s) => s.size === size),
            ])
          )
        : {},
      description: [],
      images: [],
      category_img: null,
    });

    setDescriptionText(
      Array.isArray(product.description)
        ? product.description.map((d) => d.text).join('\n')
        : ''
    );

    setSideImageFiles([null, null, null, null]);
    setIsEditing(true);
    setEditCategory(product.category);
    setEditProductId(product.id);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      oldprice: "",
      category: "",
      title: "",
      productbrand: "",
      sizes: {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false,
        Unstitched: false,
        2.2: false,
        2.4: false,
        2.6: false,
        2.8: false,
      },
      description: [],
      images: [],
      category_img: null,
      review: 0,
      tomorrow: false,
    },

    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("oldprice", values.oldprice);
      formData.append("category", values.category);
      formData.append("title", values.title);
      formData.append("productbrand", values.productbrand);
      formData.append("review", values.review);
      formData.append("tomorrow", values.tomorrow);

      const formattedDescription = descriptionText
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => ({ text: line.trim() }));
      formData.append("description", JSON.stringify(formattedDescription));

      const selectedSizes = Object.keys(values.sizes)
        .filter((size) => values.sizes[size])
        .map((size) => ({ size }));
      formData.append("sizes_product", JSON.stringify(selectedSizes));

      for (let file of values.images) {
        formData.append("images", file);
      }

      sideImageFiles.forEach((file) => {
        if (file) formData.append("side_images", file);
      });

      if (values.category_img) {
        formData.append("category_img", values.category_img);
      }

      try {
        if (isEditing) {
          await axios.put(`${apiUrl}/api/data/${editCategory}/${editProductId}`, formData);
          alert("✅ Product Updated Successfully!");
        } else {
          await axios.post(`${apiUrl}/api/data`, formData);
          alert("✅ Product Added Successfully!");
        }

        resetForm();
        setDescriptionText("");
        setSideImageFiles([null, null, null, null]);
        setIsEditing(false);
        setEditCategory('');
        setEditProductId('');
        fetchData();
      } catch (error) {
        console.error("❌ Error submitting product:", error);
        alert("Error submitting product");
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue("images", e.currentTarget.files);
  };

  const handleSideImageChange = (index, e) => {
    const file = e.currentTarget.files[0];
    const updatedFiles = [...sideImageFiles];
    updatedFiles[index] = file;
    setSideImageFiles(updatedFiles);
  };

  const handleCategoryImgChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue("category_img", file);
  };

  const handleSizeChange = (e) => {
    formik.setFieldValue("sizes", {
      ...formik.values.sizes,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className="add-product-container">
      <form className="admin-form" onSubmit={formik.handleSubmit}>
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

        <input name="name" type="text" placeholder="Product Name" value={formik.values.name} onChange={formik.handleChange} />
        <input name="productbrand" type="text" placeholder="Brand" value={formik.values.productbrand} onChange={formik.handleChange} />
        <input name="price" type="number" placeholder="Price" value={formik.values.price} onChange={formik.handleChange} />
        <input name="oldprice" type="number" placeholder="Old Price" value={formik.values.oldprice} onChange={formik.handleChange} />
        <input name="category" type="text" placeholder="Category" value={formik.values.category} onChange={formik.handleChange} />
        <input name="title" type="text" placeholder="Top Category (e.g. women, men)" value={formik.values.title} onChange={formik.handleChange} />

        <label>Category Image:</label>
        <input type="file" name="category_img" accept="image/*" onChange={handleCategoryImgChange} />

        <label>Sizes:</label>
        <div className="sizes">
          {Object.keys(formik.values.sizes).map((size) => (
            <label key={size}>
              <input type="checkbox" name={size} checked={formik.values.sizes[size]} onChange={handleSizeChange} />
              {size}
            </label>
          ))}
        </div>

        <label>Product Description (one point per line):</label>
        <textarea name="description" value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)}></textarea>

        <label>Review:</label>
        <input type="number" name="review" min="0" max="5" step="0.1" value={formik.values.review} onChange={formik.handleChange} />

        <label>
          <input type="checkbox" name="tomorrow" checked={formik.values.tomorrow} onChange={formik.handleChange} />
          Available for Tomorrow Delivery
        </label>

        <label>Main Images:</label>
        <input type="file" name="images" multiple onChange={handleFileChange} />

        <label>Side Images:</label>
        {[0, 1, 2, 3].map((index) => (
          <input key={index} type="file" onChange={(e) => handleSideImageChange(index, e)} />
        ))}

        <button type="submit">{isEditing ? 'Update Product' : 'Submit'}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              formik.resetForm();
              setDescriptionText('');
              setSideImageFiles([null, null, null, null]);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="product-list">
        <h2>Manage Products</h2>
        {products.length === 0 && <p>No products available</p>}
        {products.length > 0 &&
          products
            .sort((a, b) => b.id - a.id)
            .slice(0, 10)
            .map((prod) => (
              <div key={prod.id} className="product-card">
                <img src={prod.productimg} alt={prod.productname} width={80} />
                <p>{prod.productbrand}</p>
                <p><b>{prod.productname}</b> - ₹{prod.productprice}</p>
                <p>Category: {prod.category}</p>
                <ul className="desc-preview">
                  {Array.isArray(prod.description) &&
                    prod.description.map((d, idx) => <li key={idx}>{d.text}</li>)}
                </ul>
                <button onClick={() => handleEdit(prod)}>Edit</button>
                <button onClick={() => handleDelete(prod.category, prod.id)}>Delete</button>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AddProductForm;
