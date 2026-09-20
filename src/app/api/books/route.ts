import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";

const bookSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  author: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  branch: z.string().min(1, "Branch is required"),
  semester: z.coerce.number().min(1).max(8),
  condition: z.enum(["Like New", "Good", "Fair", "Poor"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).optional(),
  city: z.string().min(2, "City is required"),
  college: z.string().min(2, "College is required"),
  donationType: z.enum(["Free", "Exchange", "Low Price"]),
  price: z.coerce.number().optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();

const { searchParams } = new URL(req.url);
const search = searchParams.get("search") || "";
const branch = searchParams.get("branch") || "";
const semester = searchParams.get("semester") || "";
const city = searchParams.get("city") || "";
const donationType = searchParams.get("donationType") || "";
const mine = searchParams.get("mine");

let query: any = {};

if (mine === "true") {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  query.donor = (session.user as any).id;
} else {
  query.status = "available";
}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }
    if (branch) query.branch = { $regex: branch, $options: "i" };
    if (semester) query.semester = Number(semester);
    if (city) query.city = { $regex: city, $options: "i" };
    if (donationType) query.donationType = donationType;

    const books = await Book.find(query)
      .populate("donor", "name email image college city")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ books }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = bookSchema.parse(body);

    await connectDB();

    const book = await Book.create({
      ...data,
      donor: (session.user as any).id,
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (err: any) {
    if (err?.issues && err.issues[0]) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to create book" },
      { status: 500 }
    );
  }
}