import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent, Button, Box } from "@mui/material";
import axios from "../services/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [id]);

  const addToWishlist = async () => {
    try {
      await axios.post("/wishlist/", { product_id: product.id });
      alert("Added to Wishlist");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add to Wishlist.");
    }
  };

  const addToCart = async () => {
    try {
      await axios.post("/cart/", { product_id: product.id, quantity: 1 });
      alert("Added to Cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to Cart.");
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container>
      {error && <Typography color="error">{error}</Typography>}
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={`http://127.0.0.1:8000${product.image}`}
          alt={product.title}
        />
        <CardContent>
          <Typography variant="h4">{product.title}</Typography>
          <Typography>${product.price}</Typography>
          <Typography>{product.description}</Typography>
        </CardContent>
        <Box>
          <Button onClick={addToCart} variant="contained" color="primary">
            Add to Cart
          </Button>
          <Button onClick={addToWishlist} variant="outlined" color="secondary">
            Add to Wishlist
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ProductDetail;
