import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Checkout = ({ items, onOrderSuccess, onOrderFailure }) => {
  // שימוש ב-useState כדי לנהל את נתוני הטופס
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shipping: "free", // ערך ברירת המחדל למשלוח
  });

  const navigate = useNavigate(); // לשימוש בניווט לעמוד אחר לאחר ביצוע ההזמנה

  // חישוב המחיר הכולל של כל המוצרים בעגלה
  const calculateTotalPrice = () => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // חישוב עלות המשלוח בהתאם לסוג המשלוח שנבחר
  const calculateShippingCost = () => {
    return form.shipping === "paid" ? 100 : 0;
  };

  // עדכון ערכי השדות בטופס
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // טיפול בשליחת הטופס
  const handleSubmit = (e) => {
    e.preventDefault(); // מניעת טעינה מחדש של הדף

    // בדיקה אם העגלה ריקה או אם כמות של פריט בעגלה קטנה מ-1
    if (!items.length || items.some((item) => item.quantity < 1)) {
      onOrderFailure("העגלה ריקה או מכילה פריטים בכמות פחותה מ-1.");
      return;
    }
    // בדיקה שכל השדות מלאים ושהאימייל תקין
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !validateEmail(form.email)
    ) {
      onOrderFailure("נא למלא את כל השדות עם פרטים תקינים.");
      return;
    }

    // חישוב סך כל המחיר כולל המשלוח
    const totalPrice = (
      parseFloat(calculateTotalPrice()) + calculateShippingCost()
    ).toFixed(2);
    const orderDetails = {
      items,
      ...form, // שילוב פרטי הטופס בהזמנה
      totalPrice,
      shippingCost: calculateShippingCost(),
    };

    // שליחת הנתונים לשרת דרך API
    fetch("/submitpage.php", {
      // תיקון הכתובת ל-API שלך
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        onOrderSuccess(data.orderNumber); // הצלחה בהזמנה, קריאה לפונקציה לטיפול בהצלחה
        localStorage.removeItem("cartItems"); // ניקוי העגלה לאחר ההזמנה
        navigate("/"); // מעבר לדף הבית
        window.location.reload(); // רענון הדף
      })
      .catch((error) => {
        onOrderFailure(error.message); // במקרה של שגיאה, קריאה לפונקציה לטיפול בשגיאה
      });
  };

  // פונקציה לבדיקת תקינות האימייל
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div>
        {items.map((item) => (
          <div className="checkout-item" key={item._id}>
            <img src={item.imageUrl} alt={item.name} />
            <span>{item.name}</span>
            <span>כמות: {item.quantity}</span>
            <span>₪{item.price}</span>
            <span>סה"כ: ₪{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div>
        <label>אפשרויות משלוח:</label>
        <select
          name="shipping"
          value={form.shipping}
          onChange={handleInputChange}
        >
          <option value="free">משלוח חינם (14 יום)</option>
          <option value="paid">משלוח מהיר (3 ימים)</option>
        </select>
      </div>
      <div className="total-price">סה"כ לתשלום: ₪{calculateTotalPrice()}</div>
      <div className="shipping-cost">
        עלות משלוח: ₪{calculateShippingCost()}
      </div>
      <div className="grand-total">
        סך הכל לתשלום: ₪
        {(parseFloat(calculateTotalPrice()) + calculateShippingCost()).toFixed(
          2
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>שם:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>אימייל:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>טלפון:</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>כתובת למשלוח:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">בצע הזמנה</button>
      </form>
    </div>
  );
};

Checkout.propTypes = {
  items: PropTypes.array.isRequired, // דרישת סוג לארבעת הפרופס
  onOrderSuccess: PropTypes.func.isRequired,
  onOrderFailure: PropTypes.func.isRequired,
};

export default Checkout;
