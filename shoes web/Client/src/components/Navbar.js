// קובץ המייצג תפריט ניווט באפליקציה
import React from "react";
import { useLocation } from "react-router-dom";
import downloadImg from "../images/download.png";

// הגדרת הניווט המקבל שלושה פרופס, מספר הפריטים שנמצא בעגלה, מערך של הפריטים
// פונקציה שמופעלת כאשר המשתמש לוחץ על האייקון עגלת קניות
const Navbar = ({ cartItemCount, cartItems, onCartClick }) => {
  const location = useLocation();

  // פונקציה המחשבת את המחיר הכולל של כל הפריטים בעגלה
  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // משתנה שבודק האם המשתמש נמצא כרגע בעמוד הרכישה
  const isCheckoutPage = location.pathname === "/checkout";

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img
            src="https://thekitsclub7.com/wp-content/uploads/2020/12/AJ1-HIGH-BLACK-TOE-web-08.jpg"
            alt="Logo"
          />
        </div>

        <ul className="nav-links">
          <li>
            <a href="/">עמוד הבית</a>
          </li>
          <li>
            <div
              className={`cart-icon-wrapper ${
                isCheckoutPage ? "disabled" : ""
              }`}
              onClick={isCheckoutPage ? null : onCartClick}
            >
              <img id="cart-button" src={downloadImg} alt="עגלת קניות" />
              <span className="cart-item-count">{cartItemCount}</span>
              <span className="cart-total-price">₪{calculateTotalPrice()}</span>
            </div>
          </li>
        </ul>
      </nav>
      <div className="header-spacing">
        <h1 className="page-header"> ברוכים הבאים לחנות שלנו "לך לך"</h1>
      </div>
    </>
  );
};

export default Navbar;
