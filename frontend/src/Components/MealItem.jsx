import { useContext, useState } from "react";
import Buttons from "./UI/Buttons";
import CartContext from "./Store/CartContext";
import AddVariantModal from "./AddVariantModal";
import VariantsDialog from "./VariantsDialog";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
} from "./ServerRequests";
import { Button } from "../UI/Buttons";

import "../index.css";

export default function ProductItems({
  product,
  isAdmin,
  onEdit,
  isLoggedIn,
  setCurrentPage,
  onAddVariant,
}) {
  const cartContxt = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectColor, setSelectColor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userId = userDetails?.userId;

  function handleAddMeal() {
    const matchingVariant = product.productVariants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectColor
    );

    if (!matchingVariant) {
      alert("Please select a valid size and color combination.");
      return;
    }

    cartContxt.addItems({
      ...product,
      size: matchingVariant.size,
      color: matchingVariant.color,
      price: matchingVariant.price,
    });

    alert("Product Added to Cart");
  }

  function handleWishlistToggle() {
    if (isInWishlist) {
      removeFromWishlist(product.id, userId);
      setIsInWishlist(false);
      alert("Removed from Wishlist");
    } else {
      addToWishlist(product.id, userId);
      setIsInWishlist(true);
      alert("Added to Wishlist");
    }
  }

  function handleDelete() {
    try {
      let val = confirm("Are you sure you want to delete?");
      if (!val) return;
      deleteProduct(product.id);
      alert("Deleted Product Successfully!");
      window.location.reload();
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  return (
    <>
      <li className="meal-item">
        <article>
          <img src={`${product.imageUrl}`} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p className="meal-item-description">{product.description}</p>
           Total Stock: <p >{product.totalStock}</p>


            <Button
              variant="outlined"
              onClick={() => setShowVariants(true)}
              sx={{ mr: 2 }}
            >
              View Variants
            </Button>

            {Array.isArray(product.productVariants) &&
              product.productVariants.length > 0 && !isAdmin && (
                <>

                  <div className="price-and-options">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="dropdown"
                    >
                      <option value="">Select Size</option>
                      {[...new Set(
                        product.productVariants.map((variant) => variant.size)
                      )].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectColor}
                      onChange={(e) => setSelectColor(e.target.value)}
                      className="dropdown"
                    >
                      <option value="">Select Color</option>
                      {[...new Set(
                        product.productVariants.map((variant) => variant.color)
                      )].map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
          </div>

          <p className="meal-item-actions">
            {!isAdmin && (
              <Buttons onClick={handleAddMeal}>
                {product.stock <= 0 ? "Out of Stock" : "+ Add to Cart"}
              </Buttons>
            )}
            {isAdmin && (
              <div className="admin-actions">
                <EditIcon
                  sx={{ color: "#ffc404" }}
                  onClick={() => onEdit(product)}
                />
                <button
                  onClick={() => setShowModal(true)}
                  className="add-variant-button"
                >
                  Add Variant
                </button>
              </div>
            )}
            {isLoggedIn && !isAdmin && (
              <button
                onClick={handleWishlistToggle}
                className="wishlist-button"
              >
                <FavoriteIcon
                  sx={{ color: isInWishlist ? "red" : "gray" }}
                />
              </button>
            )}
          </p>
        </article>
      </li>

      {showModal && (
        <AddVariantModal
          product={product}
          onClose={() => setShowModal(false)}
          onAddVariant={onAddVariant}
        />
      )}

      {showVariants && (
        <VariantsDialog
          product={product}
          onClose={() => setShowVariants(false)}
        />
      )}
    </>
  );
}
