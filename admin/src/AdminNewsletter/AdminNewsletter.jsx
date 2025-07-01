import React, { useContext, useEffect } from "react";
import "./AdminNewsletter.scss";
import MyContext from "../Context/MyContext";

const AdminNewsletter = () => {
  const { loading, emails, fetchEmails, deleteSubscriber } = useContext(MyContext);

  useEffect(() => {
    fetchEmails();
  },);

  return (
    <div className="admin-newsletter">
      <h2>Newsletter Subscribers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : emails.length === 0 ? (
        <p>No newsletter subscribers yet.</p>
      ) : (
        <div className="newsletter-list">
          {emails.map((emailObj) => (
            <div className="newsletter-card" key={emailObj._id}>
              <p>{emailObj.email}</p>
              <button
                className="delete-btn"
                onClick={() => deleteSubscriber(emailObj._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
