import express from "express";
import CategoryModal from "../modal/CategoryModal.js";

const categoryRouter = express.Router();

categoryRouter.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryModal.find();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

categoryRouter.post("/categories/add", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const existing = await CategoryModal.findOne({ name: name.toUpperCase() });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = new CategoryModal({ name: name.toUpperCase() });
    await category.save();
    res.status(201).json({ message: "Category added", category });
  } catch (error) {
    res.status(500).json({ message: "Error adding category" });
  }
});

export default categoryRouter;
