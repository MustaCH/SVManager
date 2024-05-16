import mongoose from "mongoose";

export async function connectDB() {
  const uri: string = process.env.MONGODB_URL as string;
  await mongoose.connect(uri, { bufferCommands: false });
}
