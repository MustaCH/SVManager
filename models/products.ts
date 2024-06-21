import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: string[];
}

const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  measures: { type: [String], required: true },
  category: { type: String, required: true },
  pics: { type: [String], required: true },
});

const Prod: Model<IProduct> =
  mongoose.models && mongoose.models.Prod
    ? mongoose.models.Prod
    : mongoose.model<IProduct>("Prod", productSchema);

export default Prod;
