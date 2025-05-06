import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import {
  cancelOrder,
  getCustomerOrders,
  updateProductRating,
} from "./ServerRequests.jsx";
import "./CustomerOrders.css";
import Buttons from "./UI/Buttons.jsx";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({});
  const userData = JSON.parse(localStorage.getItem("userDetails"));
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
const [returnReason, setReturnReason] = useState("");
const [selectedOrderId, setSelectedOrderId] = useState(null);


  const handleCancelOrder = useCallback(async (id, status) => {
    if (["READY", "READY FOR PICKUP", "DELIVERED"].includes(status)) {
      alert("Order cannot be canceled");
      return;
    }

    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const response = await cancelOrder(id,"CANCELLED BY USER");
      if (response.status === "ok") {
        alert("Order Cancelled, waiting for admin approval");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === id ? { ...order, status: "CANCELLED BY USER" } : order
          )
        );
      } else {
        alert("Failed to cancel order: " + response.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }, []);

  const isEligibleForReturn = (order) => {
    const deliveryDate = new Date(order.orderDate);
    const today = new Date();
    const diffDays = Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24));
    return order.status === "DELIVERED" && diffDays <= 30;
  };
  

  const handleReturnOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setReturnDialogOpen(true);
  };
  
  const handleReturnSubmit = async () => {
    if (!returnReason.trim()) {
      alert("Please enter a reason for the return.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/orders/update-status/${selectedOrderId}/RETURNED`, {
        method: "PUT",
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update order status");
      }
  
      const result = await response.json(); // or use response.json() if your backend returns JSON
      alert(result); // e.g., "Order status updated to RETURNED"
  
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrderId
            ? { ...order, status: "RETURNED" }
            : order
        )
      );
  
      // Cleanup
      setReturnDialogOpen(false);
      setReturnReason("");
      setSelectedOrderId(null);
    } catch (error) {
      alert(`Return failed: ${error.message}`);
    }
  };
  
  
  

  useEffect(() => {
    getCustomerOrders(userData.userId)
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch past orders.");
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleRatingChange = (productId, rating) => {
    try {
      updateProductRating(userData.userId, productId, rating);
      alert("Rating updated successfully");
    } catch (error) {
      alert("Error: " + error);
    }
    setRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const renderStars = (productId) => {
    const currentRating = ratings[productId] || 0;
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((value) => (
          <IconButton
            key={value}
            onClick={() => handleRatingChange(productId, value)}
            size="small"
            style={{ color: value <= currentRating ? "#FFD700" : "#ccc" }}
          >
            {value <= currentRating ? <Star /> : <StarBorder />}
          </IconButton>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders at this time.</Typography>
      ) : (
        orders.map((order) => (
          <Paper key={order.orderId} elevation={3} sx={{ p: 2, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">
                  <strong>Total Amount:</strong> ${order.totalPayment.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">
                  <strong>Status:</strong> {order.status}
                </Typography>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Order Items:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate Product</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantityBought}</TableCell>
                      <TableCell>{renderStars(product.productId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box mt={2}>
            {order.status === "RETURNED" ? (
  <Typography variant="body2" color="primary">
    Returned
  </Typography>
) : ["PLACED", "READY", "READY FOR PICKUP", "PREPARING"].includes(order.status) ? (
  <Buttons onClick={() => handleCancelOrder(order.orderId, order.status)}>
    Cancel Order
  </Buttons>
) : isEligibleForReturn(order) ? (
  <Buttons onClick={() => handleReturnOrderClick(order.orderId)}>
    Return Order
  </Buttons>
) : (
  <Typography variant="body2" color="textSecondary">
    Cannot Cancel / Return
  </Typography>
)}


            </Box>
          </Paper>
        ))
      )}

<Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Return Order</DialogTitle>
  <DialogContent>
    <Typography variant="body1" gutterBottom>
      Please let us know the reason for your return:
    </Typography>
    <TextField
      autoFocus
      margin="dense"
      label="Reason for Return"
      type="text"
      fullWidth
      multiline
      minRows={3}
      value={returnReason}
      onChange={(e) => setReturnReason(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setReturnDialogOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleReturnSubmit} variant="contained" color="primary">
      Submit Return
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default CustomerOrders;
