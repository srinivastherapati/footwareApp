import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import { registerUser, loginUser } from "./ServerRequests";

function LoginPage({ setLoggedIn, setUserData }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePage = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userDetails", JSON.stringify(userData));
      setUserData(userData);
      setLoggedIn(true);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      dateOfBirth,
      street,
      city,
      state,
      zip,
    } = formData;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = /^\d{10}$/.test(phoneNumber);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!isValidEmail) {
      alert("Invalid email format!");
      return;
    }

    if (!isValidPhone) {
      alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        dateOfBirth,
        address: [`${street}, ${city}, ${state}, ${zip}`],
      };
      await registerUser(newUser);
      alert("Signup successful! Please log in.");
      setIsLogin(true);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/footwear.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 0,
        },
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{ position: "relative", zIndex: 1, px: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={5}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#fff", mb: 2 }}
          >
            Find a best Pair for your feet.
          </Typography>
          {/* <Typography variant="h6" sx={{ color: "#fefefe" }}>
            You're just one click away from the best shopping experience.
          </Typography> */}
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={5}
            sx={{
              p: 4,
              borderRadius: "20px",
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Typography variant="h5" gutterBottom align="center">
              {isLogin ? "Login" : "Sign Up"}
            </Typography>

            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              <Stack spacing={2}>
                {!isLogin && (
                  <>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Zip Code"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </>
                )}

                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                {!isLogin && (
                  <TextField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                )}
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, backgroundColor: "#324a5e" }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>

            <Button
              onClick={togglePage}
              variant="text"
              fullWidth
              sx={{ mt: 2, color: "#ff7058", textTransform: "none" }}
            >
              {isLogin
                ? "New here? Create an account"
                : "Already have an account? Login"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
