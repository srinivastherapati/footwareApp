import express from "express";
import ReviewModal from "../modal/Reviews.js";

const reviewRouter = express.Router();

// Create a new review
reviewRouter.post("/api/review/add", async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    const newReview = new ReviewModal({
      productId,
      userId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error: error.message });
  }
});


// Update a review by ID
reviewRouter.put("/api/reviews/:reviewId", async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
  
      const updatedReview = await ReviewModal.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true }
      );
  
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      res.status(200).json({ message: "Review updated", review: updatedReview });
    } catch (error) {
      res.status(500).json({ message: "Failed to update review", error: error.message });
    }
  });
// Get all reviews for a product
reviewRouter.get("/api/reviews/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await ReviewModal.find({ productId });
  
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
  });
  export default reviewRouter;
    