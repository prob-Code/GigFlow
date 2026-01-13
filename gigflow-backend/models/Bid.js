import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "hired", "rejected"],
    default: "pending"
  },
  freelancerContact: {
    type: String,
    required: false
  },
  freelancerUpi: {
    type: String,
    required: false
  },
  initialPaymentPaid: {
    type: Boolean,
    default: false
  },
  finalPaymentPaid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Bid", bidSchema);
