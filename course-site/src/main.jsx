import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminPanel from "./AdminPanel.jsx";
import "./index.css";

// Hash-based route so this works on a static host with no server rewrites.
const isAdmin = window.location.hash === "#admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? <AdminPanel /> : <App />}
  </React.StrictMode>
);
