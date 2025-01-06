import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    maxPrice: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for better user experience

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const API_BASE_URL = "http://127.0.0.1:8000/api/";
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}products/`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          params: {
            search: filters.search,
            price: filters.maxPrice,
            category: filters.category,
          },
        });

        setProducts(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      maxPrice: "",
      category: "",
    });
  };
  const addToCart = async (productId) => {
    try {
      const API_BASE_URL = "http://127.0.0.1:8000/api/";
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      const response = await axios.post(
        `${API_BASE_URL}cart/`,
        { product_id: productId },
        { headers }
      );
  
      alert("Product added to cart!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      if (error.response?.status === 403) {
        alert("Authentication failed. Please log in again.");
      } else {
        alert("Failed to add product to cart. Please try again.");
      }
    }
  };
  
  

  return (
    <div className="product-list-container">
      {/* Filter Section */}
      <div className="filter-bar">
        <input
          type="text"
          name="search"
          placeholder="🔍 Search products"
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="💰 Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">📦 All Categories</option>
          <option value="Electronics">📱 Electronics</option>
          <option value="Jewellery">💎 Jewellery</option>
          <option value="Furniture">🛋️ Furniture</option>
        </select>
        <button onClick={clearFilters} className="clear-filters-button">
          Reset Filters
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-message">Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="image-container">
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.title}
                    className="product-image"
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">₹{product.price.toLocaleString()}</p>
                  <p className="product-category">{product.category}</p>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products-message">No products available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
