import React from "react";
import ProductList from "./ProductList";

const HomePage = ({ products, onAddToCart }) => {
  return (
    <div className="home">
      {/* תצוגת באנר עם תמונה */}
      <img
        src="https://www.avidorhc.co.il/wp-content/uploads/2020/07/המדריך-השלם-לבחירת-נעלי-נוחות.jpg"
        alt="Banner"
      />
      <div className="home-text">
        <h1>ברוכים הבאים</h1>
        <p>גלה את קולקציית הנעליים, הסנדלים, המגפיים ועוד!</p>
      </div>
      <div className="products">
        {/* הצגת רשימת מוצרים - העברת מוצרים ופונקציה להוספה לעגלה */}
        <ProductList products={products} onAddToCart={onAddToCart} />
      </div>
    </div>
  );
};

export default HomePage;
