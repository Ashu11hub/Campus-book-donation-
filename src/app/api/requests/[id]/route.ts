import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Book";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const request = await Request.findById(params.id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;

    if (request.donor.toString() !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      await Book.findByIdAndUpdate(request.book, { status: "requested" });

      await Request.updateMany(
        {
          book: request.book,
          _id: { $ne: request._id },
          status: "pending",
        },
        { status: "rejected" }
      );
    } else if (status === "rejected") {
      const otherActive = await Request.findOne({
        book: request.book,
        status: "accepted",
      });
      if (!otherActive) {
        await Book.findByIdAndUpdate(request.book, { status: "available" });
      }
    } else if (status === "completed") {
      await Book.findByIdAndUpdate(request.book, { status: "donated" });
    }

    return NextResponse.json({ request }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update request" },
      { status: 500 }
    );
  }
}