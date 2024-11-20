// הקובץ הראשי באפליקציה הוא כולל את הטיפול בכל הרכיבים וניהול המוצרים
import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import axios from "axios";

//app הגדרת הסטייט של הרכיב
function App() {
  const [products, setProducts] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // משמש כדי לבדוק את המיקום הנוכחי של המשתמש באפליקציה
  const location = useLocation();

  // משמש לטעינת מוצרים מהשרת כאשר האפליקציה נטענת התוצאה נשמרת ב products
  useEffect(() => {
    axios
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // בכל פעם שכרטיס ההזמנה משתנה הפריטים נשמרים מחדש ב
  // localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // הופכת את מצב התצוגה של עגלת הקניות רק אם המשתמש לא נמצא בעמוד הרכישה
  const toggleCartVisibility = () => {
    if (location.pathname !== "/checkout") {
      setCartVisible((prevState) => !prevState);
    }
  };

  // מוסיפה מוצר לעגלה אם המוצר כבר קיים בעגלה היא מעדכנת את הכמות ואם לא
  // היא מוסיפה אותו
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // מעדכנת את כמות הפריטים בעגלה עבור מוצר ספציפי , הכמות לא יכולה להיות פחות מ1
  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(quantity, 1) }
          : item
      )
    );
  };

  // מסירה מוצר מהעגלה לפי ה
  // productId שלו
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  // פונקציה לטיפול בהזמנה מוצלחת או כושלת בהתאם לביצוע הזמנה
  const handleOrderSuccess = (orderNumber) => {
    alert(`ההזמנה בוצעה בהצלחה! מספר הזמנה: ${orderNumber}`);
  };

  const handleOrderFailure = (errorMessage) => {
    alert(`שגיאה בהזמנה: ${errorMessage}`);
  };

  return (
    <>
      <Navbar
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        cartItems={cartItems}
        onCartClick={toggleCartVisibility}
        isCartDisabled={location.pathname === "/checkout"}
      />

      {cartVisible && location.pathname !== "/checkout" && (
        <Cart
          items={cartItems}
          onClose={() => setCartVisible(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage products={products} onAddToCart={addToCart} />}
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              items={cartItems}
              onOrderSuccess={handleOrderSuccess}
              onOrderFailure={handleOrderFailure}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
