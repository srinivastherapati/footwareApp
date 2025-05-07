import { useContext, useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Tooltip,
  TextField, Drawer, Select, MenuItem, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import logoImg from "../assets/logo.jpg";
import CartContext from "./Store/CartContext.jsx";
import UserProgressContext from "./Store/UserProgressContext.jsx";
import { API_BASE_URL } from "./ServerRequests.jsx";
import AddProductMOdal from "./AddProductModal.jsx"

export default function Header({
  isAdmin, isLoggedIn, userData, onLogout, setCurrentPage, onProductsFetched
}) {
  const crtCntxt = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartValue = crtCntxt.items.reduce((total, item) => total + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortOption, selectedCategories, selectedTypes]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}product/get?page=1&limit=100&search=${searchQuery}&sort=${sortOption}&category=${selectedCategories.join(",")}&typeOfWear=${selectedTypes.join(",")}`
      );
      const data = await response.json();
      if (data.products) {
        onProductsFetched(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleShowCart = () => {
    if (!isLoggedIn) {
      alert("Please login to continue!");
      setCurrentPage("products");
      return;
    }
    userProgressCtx.showCart();
  };

  const handleApplyFilters = () => {
    setShowFilterDrawer(false);
    // No need to call fetchProducts(); useEffect already triggers it
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSortOption("");
  };

  return (
    <AppBar position="static" color="default" className="header">
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setCurrentPage("products")}>
          <img src={logoImg} alt="Store Logo" style={{ height: 40, width: 40, marginRight: 10, borderRadius: 8 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Footware Store</Typography>
        </Box>

        {/* Middle: Search & Navigation */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          { (
            <TextField
              label="Search"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
          <Tooltip title="Filters & Sort">
            <IconButton onClick={() => setShowFilterDrawer(true)} color="primary">
              <FilterAltIcon />
            </IconButton>
          </Tooltip>

          {isAdmin && isLoggedIn && (
            <Button variant="contained" onClick={() => setShowAddProductModal(true)}>
              Add Product
            </Button>
          )}

          {isAdmin && (
            <>
              <Typography sx={{ cursor: "pointer" }} onClick={() => setCurrentPage("all-orders")}>ORDERS</Typography>
              <Typography sx={{ cursor: "pointer" }} onClick={() => setCurrentPage("all-users")}>USERS</Typography>
            </>
          )}

          {!isAdmin && isLoggedIn && (
            <Typography sx={{ cursor: "pointer" }} onClick={() => setCurrentPage("your-orders")}>YOUR ORDERS</Typography>
          )}
        </Box>

        {/* Right: Cart/User */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isAdmin && (
            <Tooltip title="View Cart">
              <IconButton onClick={handleShowCart} color="primary">
                <ShoppingCartIcon />
                <Typography variant="body2" sx={{ ml: 0.5 }}>({cartValue})</Typography>
              </IconButton>
            </Tooltip>
          )}
          {!isLoggedIn ? (
            <Button variant="outlined" onClick={() => setCurrentPage("login")}>Login</Button>
          ) : (
            <>
              <Typography variant="body2">{userData?.emailId || ""}</Typography>
              <Button variant="outlined" onClick={onLogout} startIcon={<LogoutIcon />}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Drawer: Filters & Sort */}
      <Drawer
        anchor="right"
        open={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Typography variant="h6">Filters & Sorting</Typography>

          {/* Sort */}
          <Typography sx={{ mt: 2 }}>Sort By</Typography>
          <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} fullWidth>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="A-Z">A-Z</MenuItem>
            <MenuItem value="Z-A">Z-A</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
          </Select>

          {/* Categories */}
          <Typography sx={{ mt: 2 }}>Category</Typography>
          <FormGroup>
            {["MEN", "WOMEN", "GIRLS", "BOYS", "KIDS"].map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(category)
                          ? prev.filter((c) => c !== category)
                          : [...prev, category]
                      )
                    }
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>

          {/* Types */}
          <Typography sx={{ mt: 2 }}>Type</Typography>
          <FormGroup>
            {["SNEAKERS", "RUNNING", "CASUAL", "SPORTS", "FORMAL", "LOAFERS", "BOOTS"].map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() =>
                      setSelectedTypes((prev) =>
                        prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      )
                    }
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleClearFilters}>Clear</Button>
            <Box>
              <Button onClick={() => setShowFilterDrawer(false)}>Cancel</Button>
              <Button variant="contained" sx={{ ml: 1 }} onClick={handleApplyFilters}>Apply</Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Add Product Modal */}
      <AddProductMOdal
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        isAdd={true}
        currentProduct={null}
      />
    </AppBar>
  );
}
