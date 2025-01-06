import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axiosInstance from "../utils/axiosInstance";
import "../assets/Navbar.css"; 

const Navbar = ({ user, setUser }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const fetchCartItemCount = async () => {
    try {
      const response = await axiosInstance.get("cart/");
      setCartItemCount(response.data.length);
    } catch (err) {
      console.error("Failed to fetch cart items count:", err);
    }
  };
  

  useEffect(() => {
    if (user) {
      fetchCartItemCount();
    }
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          OLX<span className="logo-highlight"></span>
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-greeting">
              Welcome, <strong>{user?.username || "User"}</strong>
            </span>
            <Link to="/cart" className="navbar-cart">
              <i className="fa fa-shopping-cart"></i>
              <span>Cart</span>
              <span className="cart-badge">{cartItemCount}</span>
            </Link>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </>
        ) : (
          <>
          </>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

export default Navbar;
