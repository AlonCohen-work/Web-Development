import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]); // משתנה מצב עבור רשימת המוצרים
  const [error, setError] = useState(null); // משתנה מצב עבור הודעות שגיאה

  useEffect(() => {
    // פונקציה לשליפת מוצרים מהשרת כאשר הקומפוננטה נטענת
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products"); // קריאה ל-API לקבלת המוצרים
        setProducts(response.data.products || []); // עדכון רשימת המוצרים שנשלפה מהשרת
      } catch (err) {
        setError("Error fetching products"); // אם יש שגיאה, עדכון משתנה השגיאה
        console.error(err); // הדפסת השגיאה בקונסול
      }
    };

    fetchProducts(); // קריאה לפונקציה לשליפת המוצרים
  }, []); // מערך תלות ריק - משמעותו שהפונקציה תרוץ רק פעם אחת לאחר הרינדור הראשוני

  // הצגת הודעת שגיאה במידה וישנה שגיאה
  if (error) {
    return <p>{error}</p>;
  }

  // הצגת הודעה "אין מוצרים זמינים" אם רשימת המוצרים ריקה
  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          {/* הצגת תמונת המוצר */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
          {/* הצגת שם המוצר */}
          <h2 className="product-name">{product.name}</h2>
          {/* הצגת תיאור המוצר */}
          <p className="product-description">{product.description}</p>
          {/* הצגת מחיר המוצר */}
          <span className="product-price">{product.price} ש"ח</span>
          {/* כפתור להוספת המוצר לעגלת הקניות */}
          <button
            aria-label={`Add ${product.name} to cart`}
            className="add-to-cart-button"
            onClick={() => onAddToCart(product)}
          >
            הוסף לסל
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
