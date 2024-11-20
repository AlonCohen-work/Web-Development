// קובץ המציג את העגלה של הלקוח ומאפשר לבצע פעולות כמו עדכון מוצרים והסרה
import React from "react";
import { useNavigate } from "react-router-dom"; // משמש לניווט בין דפי האפליקציה

const Cart = ({ items, onClose, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate(); //אתחול הפרופס

  // פונקציה המתבצעת כאשר המשתמש משנה את כמות המוצר בעגלה
  // הפונקציה ממירה את הערך של הכמות למספר שלם ומעדכנת את הכמות
  const updateItemTotalPrice = (event, productId) => {
    const quantity = parseInt(event.target.value);
    onUpdateQuantity(productId, quantity);
  };

  // פונקציה המחשבת את הסכום הכולל לתשלום עבור הפריטים בעגלה
  const calculateTotalPrice = () => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // פונקציה המתבצעת כאשר המשתמש לוחץ על רכישה אם יש פריטים בעגלה
  // היא מנווטת לדף תשלום אם העגלה ריקה היא מציגה הודעה
  const handleCheckout = () => {
    if (items.length > 0) {
      navigate("/checkout");
    } else {
      alert("העגלה ריקה, לא ניתן לבצע רכישה");
    }
  };

  // הקוד שמגדיר איך תראה העגלה , מציג את הפריטיםם בעגלה ומאפשר לשנות כמות
  // להציג את המחיר הכולל וללחוץ על כפתור לרכישה
  return (
    <div id="cart" className="cart show">
      <button id="close-cart-button" onClick={onClose}>
        X
      </button>
      <div id="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item._id}>
            <img src={item.imageUrl} alt={item.name} />
            <span>{item.name}</span>
            <span className="price">₪{item.price}</span>
            <input
              className="quantity"
              type="number"
              value={item.quantity}
              min="1"
              onChange={(event) => updateItemTotalPrice(event, item._id)}
            />
            <span className="total-price">
              ₪{(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              className="remove-from-cart"
              onClick={() => onRemoveItem(item._id)}
            >
              הסר
            </button>
          </div>
        ))}
      </div>
      <div id="total-price"> סה"כ לתשלום ₪{calculateTotalPrice()}</div>
      <button id="checkout-button" onClick={handleCheckout}>
        לרכישה
      </button>
    </div>
  );
};

export default Cart;
