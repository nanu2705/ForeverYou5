import React, { useState } from 'react'
import MyContext from './MyContext';
import axios from 'axios';

const MyContextProvider = ({children}) => {



     const apiUrl = 'http://localhost:3034' ;

     //for home start

     const [activeTab, setActiveTab] = useState("addProduct");

     //for home end

     //cart admin start

    const [allCarts, setAllCarts] = useState([]);
    const [loading, setLoading] = useState(true);

     const fetchAllCarts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/all-carts`);
      setAllCarts(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all user carts:", error);
      setLoading(false);
    }
  };

 const handleDeleteCartItem = async (email, categoryid, productid, size) => {
    try {
      await axios.delete(`${apiUrl}/admin/cart/${email}/${categoryid}/${productid}/${size}`);
      fetchAllCarts(); // Refresh data
    } catch (error) {
      console.error("❌ Failed to delete product from cart", error);
    }
  };
     
      //cart admin end


   //topcategory admin start

  const [title, setTitle] = useState('');
  const [categoriesText, setCategoriesText] = useState('');
  const [img, setImg] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategoriesText, setEditCategoriesText] = useState('');
  const [editImage, setEditImage] = useState(null);

   //topcategory admin end

   //promo admin start

   const [banners, setBanners] = useState([]);
   //promo admin end

   //news admin start

    const [emails, setEmails] = useState([]);

    const fetchEmails = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/newsletter`);
      setEmails(res.data.data);
    } catch (error) {
      console.error("Error fetching newsletter emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subscriber?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/api/admin/newsletter/${id}`);
      setEmails(emails.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber.");
    }
  };

   //news admin end 

   //contact admin start

    const [contacts, setContacts] = useState([]);

     const fetchContacts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/contacts`);
      setContacts(res.data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this contact?");
    if (!confirm) return;

    try {
      await axios.delete(`${apiUrl}/api/admin/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error("Failed to delete contact", err);
      alert("Error deleting contact");
    }
  };

   //contact admin end 

   //product admin start

    const [products, setProducts] = useState([]);
  const [descriptionText, setDescriptionText] = useState("");
  const [sideImageFiles, setSideImageFiles] = useState([null, null, null]);

  //product admin end


  return (
    <div>
      
      <MyContext.Provider value={{apiUrl,activeTab, setActiveTab,
          allCarts, setAllCarts,loading, setLoading,fetchAllCarts,handleDeleteCartItem,
          title, setTitle,categoriesText, setCategoriesText,img, setImg,topCategories, setTopCategories,
          editingId, setEditingId,editTitle, setEditTitle,editCategoriesText, setEditCategoriesText,editImage, setEditImage,
          banners, setBanners,emails, setEmails,fetchEmails,deleteSubscriber,
          contacts, setContacts,fetchContacts,handleDelete,products, setProducts,
          descriptionText, setDescriptionText,sideImageFiles, setSideImageFiles
      }}>

        {children}
      </MyContext.Provider>
    </div>
  )
}

export default MyContextProvider
