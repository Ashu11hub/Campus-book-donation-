import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  college?: string;
  city?: string;
  branch?: string;
  year?: string;
  phone?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: String,
    college: String,
    city: String,
    branch: String,
    year: String,
    phone: String,
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);