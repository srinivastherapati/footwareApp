import React, { useState,useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { addProduct, updateProduct } from "./ServerRequests";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddProductMOdal({ open, onClose, currentProduct, isAdd }) {
  const [name, setName] = useState(currentProduct?.name || "");
  const [modal, setModal] = useState(currentProduct?.modal || "");
  const [brand, setBrand] = useState(currentProduct?.brand || "");
  const [typeOfWear, setTypeOfWear] = useState(
    currentProduct?.typeOfWear || "");
  const [imageUrl, setImageUrl] = useState(currentProduct?.imageUrl || "");
  const [description, setDescription] = useState(
    currentProduct?.description || ""
  );
  const[category, setCategory] = useState(currentProduct?.category || "");
  const [productVariants, setVariants] = useState({
    size: currentProduct?.productVariants?.size || "",
    color: currentProduct?.productVariants?.color || "",
    price:currentProduct?.productVariants?.price || 0,
    stock:currentProduct?.productVariants?.stock || 1,
  });

  const [Allcategories, setCategories] = useState([]);

  

  const categories = ["MEN", "WOMEN", "GIRLS", "BOYS", "KIDS"];
const types = ["SNEAKERS", "RUNNING", "CASUAL","SPORTS", "FORMAL", "LOAFERS", "BOOTS"];

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories.map((c) => c.name));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  fetchCategories();
}, []);

  const handleVariantChange = (key, value) => {
    setVariants((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const variantsArray = [
      {
        size: productVariants.size,
        color: productVariants.color, 
        price:productVariants.price,
        stock:productVariants.stock
      },
    ];
    const productData = {
      name,
      imageUrl,
      description,
      brand,
      modal,
      typeOfWear,
      category:category.toUpperCase(),
      productVariants: variantsArray,
    };

    try {
      if (!isAdd) {
        const response = await updateProduct(currentProduct.id, productData);
        if (response) {
          alert("Updated Product Successfully!");
          window.location.reload();
        }
      } else {
        const response = await addProduct(productData);
        if (response) {
          alert("Added Product Successfully!");
          window.location.reload();
        }
      }
      onClose();
    } catch (err) {
      alert("Failed to submit product: " + err.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-product-modal-title"
      aria-describedby="add-product-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="add-product-modal-title" variant="h6" component="h2">
          {!isAdd ? "Edit Product" : "Add New Product"}
        </Typography>
        <form>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
           <TextField
    label="Brand"
    fullWidth
    margin="normal"
    value={brand}
    onChange={(e) => setBrand(e.target.value)}
    required
  />
  <TextField
    label="Modal"
    fullWidth
    margin="normal"
    value={modal}
    onChange={(e) => setModal(e.target.value)}
    required
  />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
         <TextField
        select
        label="Gender"
        fullWidth
        margin="normal"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
      select
      label="Category"
      fullWidth
      margin="normal"
      value={typeOfWear}
      onChange={(e) => setTypeOfWear(e.target.value)}
      required
    >
      {Allcategories.map((category) => (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      ))}
    </TextField>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
            onClick={handleSubmit}
          >
            {!isAdd ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
