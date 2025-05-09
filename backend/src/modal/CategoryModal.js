import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const CategoryModal = model("Category", categorySchema);
export default CategoryModal;
