import mongoose, { Schema, models, model } from "mongoose";

export interface IRequest {
  _id: string;
  book: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  donor: mongoose.Types.ObjectId;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Request || model<IRequest>("Request", RequestSchema);