import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  pics: Array,
  measures: Array,
  category: String,
  color: String,
});

export default mongoose.models.Prod || mongoose.model("Prod", schema);
