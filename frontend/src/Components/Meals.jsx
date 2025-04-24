import React, { useState } from "react";
import {
  Grid, Card, CardMedia, CardContent, Typography, Dialog
} from "@mui/material";
import ProductDetails from "./ProductDetails";

export default function Meals({ isAdmin, isLoggedIn, setCurrentPage, products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!products.length) {
    return <p className="center">No products found.</p>;
  }

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 2, padding: "20px" }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              onClick={() => setSelectedProduct(product)}
              sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}
            >
              <CardMedia component="img" height="200" image={product.imageUrl} alt={product.name} />
              <CardContent>
                <Typography variant="subtitle1" align="center" fontWeight="bold">
                  {product.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} maxWidth="md" fullWidth>
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            isLoggedIn={isLoggedIn}
            setCurrentPage={setCurrentPage}
            isAdmin={isAdmin}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Dialog>
    </>
  );
}
