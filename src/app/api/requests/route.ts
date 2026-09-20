import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Book";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "received";

    const userId = (session.user as any).id;

    const query =
      type === "sent" ? { requester: userId } : { donor: userId };

    const requests = await Request.find(query)
      .populate("book")
      .populate("requester", "name email image college city")
      .populate("donor", "name email image college city")
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch requests" },
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
    const { bookId, message } = body;

    if (!bookId) {
      return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    }

    await connectDB();

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;

    if (book.donor.toString() === userId) {
      return NextResponse.json(
        { error: "You cannot request your own book" },
        { status: 400 }
      );
    }

    if (book.status !== "available") {
      return NextResponse.json(
        { error: "Book is not available" },
        { status: 400 }
      );
    }

    const existing = await Request.findOne({
      book: bookId,
      requester: userId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already requested this book" },
        { status: 400 }
      );
    }

    const request = await Request.create({
      book: bookId,
      requester: userId,
      donor: book.donor,
      message: message || "",
    });

    await Book.findByIdAndUpdate(bookId, { status: "requested" });

    return NextResponse.json({ request }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create request" },
      { status: 500 }
    );
  }
}