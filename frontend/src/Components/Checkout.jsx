import { useContext, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

import CartContext from "./Store/CartContext";
import UserProgressContext from "./Store/UserProgressContext";
import { API_BASE_URL } from "./ServerRequests";
import Modal from "./UI/Modal";
import ErrorPage from "./ErrorPage";

export default function Checkout() {
  const crtCntxt = useContext(CartContext);
  const userPrgrs = useContext(UserProgressContext);
  const userId = JSON.parse(localStorage.getItem("userDetails")).userId;

  const [isOrderPlaced, setIsOrderPlaced] = useState({ status: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [useShippingAddress, setUseShippingAddress] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);


  const cartTotal = crtCntxt.items.reduce((total, item) => total + item.quantity * item.price, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    try {
      const response = await axios.post(
        `${API_BASE_URL}orders/place/${userId}`,
        {
          order: {
            items: crtCntxt.items,
            customer: customerData,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setIsOrderPlaced({ status: true, message: response.data.message });
        crtCntxt.clearCart();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    setIsOrderPlaced({ status: false, message: "" });
    userPrgrs.hideCheckout();
  };

  if (error) {
    return <ErrorPage title="Failed to place order" message={error} />;
  }

  if (isOrderPlaced.status) {
    return (
      <Modal open={userPrgrs.progress === "checkout"}>
        <Typography variant="h5">Success!</Typography>
        <Typography>Your Order Placed Successfully</Typography>
        {isOrderPlaced.message && <Typography>{isOrderPlaced.message}</Typography>}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleFinish}>Okay</Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={userPrgrs.progress === "checkout"}>
      <form onSubmit={handleSubmit}>
        <Card sx={{ p: 3, maxWidth: 700, margin: "auto" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Checkout
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Total Amount: ${Math.round(cartTotal * 100) / 100}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* <Typography variant="h6">Shipping Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField name="name" label="Full Name" fullWidth required /></Grid>
              <Grid item xs={12} sm={6}><TextField name="email" label="Email" fullWidth required /></Grid>
              <Grid item xs={12}><TextField name="street" label="Street" fullWidth required /></Grid>
              <Grid item xs={6}><TextField name="city" label="City" fullWidth required /></Grid>
              <Grid item xs={6}><TextField name="postalCode" label="Postal Code" fullWidth required /></Grid>
            </Grid>

            <Divider sx={{ my: 2 }} /> */}

            <Typography variant="h6">Delivery Option</Typography>
            <RadioGroup
              name="deliveryOption"
              value={deliveryOption}
              onChange={(e) => setDeliveryOption(e.target.value)}
              row
            >
              <FormControlLabel value="pickup" control={<Radio required />} label="Pickup" />
              <FormControlLabel value="delivery" control={<Radio required />} label="Delivery" />
            </RadioGroup>

            {deliveryOption === "delivery" && (
              <>
                <FormControlLabel
                  control={<Checkbox checked={useShippingAddress} onChange={() => setUseShippingAddress(!useShippingAddress)} />}
                  label="Same as Shipping Address"
                />
                {!useShippingAddress && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField name="newStreet" label="Street" fullWidth required /></Grid>
                    <Grid item xs={4}><TextField name="newCity" label="City" fullWidth required /></Grid>
                    <Grid item xs={4}><TextField name="newState" label="State" fullWidth required /></Grid>
                    <Grid item xs={4}><TextField name="newZip" label="Zip Code" fullWidth required /></Grid>
                  </Grid>
                )}
              </>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Payment Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField name="cardNumber" label="Card Number" fullWidth required value={cardNumber} onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val) && val.length <= 16) setCardNumber(val);
              }} /></Grid>
              <Grid item xs={6}><TextField name="nameOnCard" label="Name on Card" fullWidth required /></Grid>
              <Grid item xs={3}><TextField name="cvv" label="CVV" fullWidth required inputProps={{ maxLength: 3 }} /></Grid>
              <Grid item xs={3}><TextField name="expiry" label="Expiry (MM/YYYY)" fullWidth required /></Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button onClick={() => userPrgrs.hideCheckout()} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : "Place Order"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
    </Modal>
  );
}


