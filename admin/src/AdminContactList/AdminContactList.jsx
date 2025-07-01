import React, { useContext, useEffect } from "react";
import "./AdminContactList.scss";
import MyContext from "../Context/MyContext";

const AdminContactList = () => {
  const {
    loading,
    contacts,
    fetchContacts,
    handleDelete,
  } = useContext(MyContext);

  useEffect(() => {
    fetchContacts();
  }, );

  return (
    <div className="admin-contact-list">
      <h2>Contact Submissions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts submitted yet.</p>
      ) : (
        <div className="contact-grid">
          {contacts.map((c) => (
            <div className="contact-card" key={c._id}>
              <div className="contact-details">
                <h3>{c.name}</h3>
                <p><strong>Email:</strong> {c.email}</p>
                <p><strong>Mobile:</strong> {c.mobile}</p>
                <p className="message"><strong>Message:</strong> {c.message}</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(c._id)}>
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContactList;
