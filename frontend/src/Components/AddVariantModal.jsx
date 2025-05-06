import React, { useState } from "react";
import { addProduct } from "./ServerRequests";

export default function AddVariantModal({ product, onClose }) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [attributes, setAttributes] = useState({});
  const [attributeKey, setAttributeKey] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const productName = product.name;

  const handleAddAttribute = () => {
    if (attributeKey && attributeValue) {
      setAttributes((prev) => ({ ...prev, [attributeKey]: attributeValue }));
      setAttributeKey("");
      setAttributeValue("");
    }
  };

  const handleAddVariant = async () => {
    if (!size || !color || !price || !stock ) {
      alert("Please fill in all fields!");
      return;
    }

    const newVariant = {
      name: product.name,
      description: product.description,
      productId: product.id,
      imageUrl: product.imageUrl,
      category: product.category,
      typeofWear: product.typeOfWear,
      brand: product.brand, 
      modal: product.modal,
      productVariants: [
        {
          size,
          color,
          productName,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          attributes,
        },
      ],
    };
    console.log(newVariant);

    try {
      const response = await addProduct(newVariant);
      if (response) {
        alert("Added Product variant Successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Variant for {product.name}</h2>
        <div className="space-y-4">
  <div>
    <label className="block font-medium mb-1">Size (UK / US)</label>
    <select
      value={size}
      onChange={(e) => setSize(e.target.value)}
      className="w-full border rounded-lg px-3 py-2"
    >
      <option value="">Select Size</option>
      {["6", "7", "8", "9", "10", "11", "12"].map((ukSize) => {
        const usSize = parseInt(ukSize, 10) + 1; // Convert UK size to US size
        const label = `UK ${ukSize} / US ${usSize}`; // Create the display label

        // Combine both UK and US sizes as the option value
        const sizeValue = `UK ${ukSize} / US ${usSize}`;

        return (
          <option
            key={ukSize}
            value={sizeValue} // Use the combined value as the option value
            disabled={product.productVariants.some(
              (variant) => variant.size === ukSize
            )}
          >
            {label}
          </option>
        );
      })}
    </select>
  </div>
  <div>
  <label className="block font-medium mb-1">Color</label>
  <select
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="w-full border rounded-lg px-3 py-2"
    required
  >
    <option value="">Select a color</option>
    <option value="Black">Black</option>
    <option value="White">White</option>
    <option value="Red">Red</option>
    <option value="Blue">Blue</option>
    <option value="Green">Green</option>
    <option value="Yellow">Yellow</option>
  </select>
</div>
          <div>
            <label className="block font-medium mb-1">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter stock"
            />
          </div>
          </div>
        
        <label>
          Attribute Key:
          <input
            type="text"
            value={attributeKey}
            onChange={(e) => setAttributeKey(e.target.value)}
            placeholder="Enter attribute name"
          />
        </label>
        <label>
          Attribute Value:
          <input
            type="text"
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
            placeholder="Enter attribute value"
          />
        </label>
        <button onClick={handleAddAttribute}>Add Attribute</button>
        <div className="modal-actions">
          <button onClick={handleAddVariant}>Add Variant</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
