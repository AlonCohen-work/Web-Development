import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // עוטפים את כל האפליקציה כאן
import App from "./App";
import "./styles.css"; // Import your CSS styles

// פונקציה המשמשת לרנדר את הרכיב ריאקט לתוך אלמנט html
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
