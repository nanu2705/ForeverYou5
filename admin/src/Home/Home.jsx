import React, {  useContext } from "react";
import axios from "axios";
import AddProductForm from "../AddProductForm/AddProductForm";
import AdminWishlist from "../AdminWishlist/AdminWishlist";
import AllCartsAdmin from "../AllCartsAdmin/AllCartsAdmin";
import AdminPromoManager from "../AdminPromoManager/AdminPromoManager";
import "./Home.scss";
import AdminContactList from "../AdminContactList/AdminContactList";
import AdminNewsletter from "../AdminNewsletter/AdminNewsletter";
import AdminTopCategory from "../AdminTopCategory/AdminTopCategory";
import MyContext from "../Context/MyContext";
import AdminSlider from "../AdminSlider/AdminSlider";
import AdminThankYou from "../AdminThankYou/AdminThankYou";



const Home = () => {

  const {apiUrl,activeTab, setActiveTab} =useContext(MyContext)
  
  const handleResetUsers = async () => {
    const confirmReset = window.confirm("Are you sure you want to delete ALL users and their data?");
    if (!confirmReset) return;

    try {
      const res = await axios.delete(`${apiUrl}/admin/delete-all-users`);
      alert(res.data.message || "All users deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete users. See console for details.");
    }
  };

  return (
    <div className="admin-container">
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul className="sidebar-list">
          <li className={activeTab === "addProduct" ? "active" : ""} onClick={() => setActiveTab("addProduct")}>
            Add Product
          </li>
          <li className={activeTab === "category" ? "active" : ""} onClick={() => setActiveTab("category")}>
            Add Top Category
          </li>
           <li className={activeTab === "slider" ? "active" : ""} onClick={() => setActiveTab("slider")}>
            Slider
          </li>
          <li className={activeTab === "promo" ? "active" : ""} onClick={() => setActiveTab("promo")}>
            Promo
          </li>
          <li className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>
            Wishlist
          </li>
          <li className={activeTab === "cart" ? "active" : ""} onClick={() => setActiveTab("cart")}>
            Cart
          </li>
          <li className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>
            Contact Submissions
          </li>
           <li className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>
            Newsletter Subscribers
          </li>
           <li className={activeTab === "thanks" ? "active" : ""} onClick={() => setActiveTab("thanks")}>
            Thanks Giving
          </li>

         
        </ul>

        <button className="reset-button" onClick={handleResetUsers}>
          🗑️ Reset All Users
        </button>
      </nav>

      <main className="content">
        {activeTab === "addProduct" && <AddProductForm />}
        {activeTab === "category" && <AdminTopCategory/>}
        {activeTab === "wishlist" && <AdminWishlist />}
        {activeTab === "cart" && <AllCartsAdmin />}
        {activeTab === "promo" && <AdminPromoManager />}
        {activeTab === "contact" && <AdminContactList />}
        {activeTab === "news" && <AdminNewsletter/>}
        {activeTab === "slider" && <AdminSlider/>}
        {activeTab === "thanks" && <AdminThankYou/>}


      </main>
    </div>
  );
};

export default Home;
