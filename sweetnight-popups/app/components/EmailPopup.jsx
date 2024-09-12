import React, { useState } from "react";
import "./EmailPopup.css";

function EmailPopup() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email submitted: ${email}`);
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup">
          <h2>注册接收电子邮件和独家优惠</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    )
  );
}

export default EmailPopup;
