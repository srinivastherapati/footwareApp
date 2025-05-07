import React, { useState, useContext } from "react";
import { Box, Typography, Button, Select, MenuItem, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartContext from "./Store/CartContext";
import AddVariantModal from "./AddVariantModal";
import VariantsDialog from "./VariantsDialog";

export default function ProductDetails({ product, isLoggedIn, onClose, isAdmin }) {
  const cartContext = useContext(CartContext);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const handleAddToCart = () => {
    const variant = product.productVariants.find(
      (v) => v.size === size && v.color === color
    );
    if (!variant) {
      alert("Please select size and color.");
      return;
    }
    cartContext.addItems({ ...product, ...variant });
    alert("Added to cart!");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
      <Typography variant="h5" sx={{ mt: 2 }}>
        {product.name}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {product.description}
      </Typography>

      <Box sx={{ mt: 3 }}>
        {isAdmin ? (
          <>
            <Button variant="outlined" onClick={() => setShowVariants(true)} sx={{ mr: 2 }}>
              View Variants
            </Button>
            <Button variant="contained" onClick={() => setShowModal(true)}>
              Add Variant
            </Button>
          </>
        ) : (
          <>
  <Typography variant="subtitle1">Select Size</Typography>
  <Select fullWidth value={size} onChange={(e) => setSize(e.target.value)}>
    <MenuItem value="">Select Size</MenuItem>
    {[...new Set(product.productVariants
      .filter((v) => v.stock > 0)
      .map((v) => v.size))].map((size) => (
      <MenuItem key={size} value={size}>
        {size}
      </MenuItem>
    ))}
  </Select>

  <Typography variant="subtitle1" sx={{ mt: 2 }}>
    Select Color
  </Typography>
  <Select fullWidth value={color} onChange={(e) => setColor(e.target.value)}>
    <MenuItem value="">Select Color</MenuItem>
    {[...new Set(product.productVariants
      .filter((v) => v.stock > 0 && v.size === size)
      .map((v) => v.color))].map((color) => (
      <MenuItem key={color} value={color}>
        {color}
      </MenuItem>
    ))}
  </Select>

  {/* Show price when size and color are selected */}
  {size && color && (
    <Typography variant="h6" sx={{ mt: 2 }}>
      Price: $
      {
        product.productVariants.find(
          (v) => v.size === size && v.color === color && v.stock > 0
        )?.price ?? "N/A"
      }
    </Typography>
  )}

  <Button
    variant="contained"
    fullWidth
    sx={{ mt: 3 }}
    onClick={handleAddToCart}
    disabled={
      !product.productVariants.find(
        (v) => v.size === size && v.color === color && v.stock > 0
      )
    }
  >
    Add to Cart
  </Button>
</>

        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        {isLoggedIn && !isAdmin && (
          <IconButton>
            <FavoriteIcon sx={{ color: "red" }} />
          </IconButton>
        )}
        <Button onClick={onClose}>Close</Button>
      </Box>

      {showModal && (
        <AddVariantModal
          product={product}
          onClose={() => setShowModal(false)}
          // Assuming you have a function to handle variant addition
          onAddVariant={(variant) => {
            console.log("Variant added", variant);
            setShowModal(false);
          }}
        />
      )}

      {showVariants && (
        <VariantsDialog product={product} onClose={() => setShowVariants(false)} />
      )}
    </Box>
  );
}
