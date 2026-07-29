import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
    stripeCustomerId: { type: String, default: null },
    subscription: {
      status: { type: String, enum: ["none", "active", "canceled", "past_due"], default: "none" },
      plan: { type: String, enum: ["monthly", "annual", null], default: null },
      currentPeriodEnd: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
