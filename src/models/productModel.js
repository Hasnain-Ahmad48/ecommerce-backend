import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    image: {
      url: String,
      public_id: String,
    },
    brand: {type: String, default: ""},
    category: {type: String, default: ""},
    description: {type: String, default: ""},
    price: {type: Number, required: true, default: 0},
    countInStock: {type: Number, required: true, default: 0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, // creator
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
