import mongoose, { Schema, models, model } from "mongoose";

export interface IBook {
  _id: string;
  title: string;
  author?: string;
  subject: string;
  branch: string;
  semester: number;
  condition: "Like New" | "Good" | "Fair" | "Poor";
  description: string;
  images: string[];
  city: string;
  college: string;
  donationType: "Free" | "Exchange" | "Low Price";
  price?: number;
  donor: mongoose.Types.ObjectId;
  status: "available" | "requested" | "donated";
  createdAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: String,
    subject: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    condition: {
      type: String,
      enum: ["Like New", "Good", "Fair", "Poor"],
      required: true,
    },
    description: { type: String, required: true },
    images: [String],
    city: { type: String, required: true },
    college: { type: String, required: true },
    donationType: {
      type: String,
      enum: ["Free", "Exchange", "Low Price"],
      default: "Free",
    },
    price: Number,
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["available", "requested", "donated"],
      default: "available",
    },
  },
  { timestamps: true }
);

BookSchema.index({ title: "text", author: "text", subject: "text" });

export default models.Book || model<IBook>("Book", BookSchema);