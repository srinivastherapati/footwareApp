import { Schema,model } from "mongoose";

const reviewSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
    },
});

const ReviewModal = model("Review", reviewSchema);
export default ReviewModal;