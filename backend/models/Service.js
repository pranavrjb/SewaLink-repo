const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true, minlength: 20 },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true, maxlength: 10 },
    image: { type: String },
    ratings: { type: Number, default: 0 }, 
    reviewsCount: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
