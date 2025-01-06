import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart"; // Assuming a Cart component exists

const App = () => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Handle login
  const handleLogin = (user) => {
    setUser(user); // Set user state after successful login
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("user"); // Remove user data
    setUser(null); // Clear user state
    localStorage.removeItem("cart"); // Clear cart data on logout
  };

  return (
    <Router>
      <div>
        <Navbar user={user} setUser={setUser} onLogout={handleLogout} />
        <Routes>
          {/* Home route */}
          <Route
            path="/"
            element={
              user ? (
                <ProductList />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Login route */}
          <Route
            path="/login"
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Register route */}
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" replace />}
          />

          {/* Cart route */}
          <Route
            path="/cart"
            element={
              user ? (
                <Cart />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 route */}
          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                404 - Page Not Found
              </h2>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
