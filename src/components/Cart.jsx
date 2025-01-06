import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Simulating API fetch from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
        calculateTotal(savedCart);
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
        setError("Unable to fetch cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  };

  // Remove item from the cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {error && <p className="error-message">{error}</p>}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-summary">
            <p>Total Items: {cart.length}</p>
            <p>Total Price: ₹{totalPrice.toLocaleString()}</p>
          </div>
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={product.image || "https://via.placeholder.com/100"}
                  alt={product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>₹{product.price.toFixed(2)}</p>
                  <button
                    className="remove-from-cart"
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Link to="/" className="continue-shopping">
        Continue Shopping
      </Link>
    </div>
  );
};

export default Cart;
