import mongoose from "mongoose";

//Top Category Schema start
const topCategorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },        // "Men", "Women", "Kids"
  categoryRef: { type: String, required: true },  // e.g., "shirts"
  img: { type: String, required: true }           // Image URL or path
});
const TopCategory = mongoose.model('TopCategory', topCategorySchema);
// Top Category Schema end

export default TopCategory;