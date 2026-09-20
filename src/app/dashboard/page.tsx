"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  BookOpen,
  Heart,
  Check,
  X,
  Clock,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author?: string;
  images: string[];
  city: string;
  status: string;
  donationType: string;
}

interface RequestType {
  _id: string;
  book: Book;
  requester?: { _id: string; name: string; email: string };
  donor?: { _id: string; name: string; email: string };
  message?: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"listings" | "received" | "sent">("listings");
  const [books, setBooks] = useState<Book[]>([]);
  const [received, setReceived] = useState<RequestType[]>([]);
  const [sent, setSent] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      setLoading(true);
      try {
        const [booksRes, receivedRes, sentRes] = await Promise.all([
          fetch("/api/books?mine=true"),
          fetch("/api/requests?type=received"),
          fetch("/api/requests?type=sent"),
        ]);

        const booksData = await booksRes.json();
        const receivedData = await receivedRes.json();
        const sentData = await sentRes.json();

        const myBooks = (booksData.books || []).filter(
          (b: any) => b.donor?._id === (session?.user as any)?.id
        );

        setBooks(myBooks);
        setReceived(receivedData.requests || []);
        setSent(sentData.requests || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status, session]);

  const handleRequestAction = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
        return;
      }

      toast.success(`Request ${newStatus}`);
      setReceived((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container-page py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <section className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
        <p className="text-ink-soft mt-2">Manage your listings and requests</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        <button
          onClick={() => setTab("listings")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            tab === "listings"
              ? "border-primary text-primary"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1.5" />
          My Listings ({books.length})
        </button>
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            tab === "received"
              ? "border-primary text-primary"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          <Heart className="w-4 h-4 inline mr-1.5" />
          Requests Received ({received.filter((r) => r.status === "pending").length})
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            tab === "sent"
              ? "border-primary text-primary"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          <Package className="w-4 h-4 inline mr-1.5" />
          My Requests ({sent.length})
        </button>
      </div>

      {tab === "listings" && (
        <>
          {books.length === 0 ? (
            <div className="text-center py-20 card-base">
              <BookOpen className="w-12 h-12 text-ink-mute mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No listings yet</h3>
              <p className="text-sm text-ink-soft mb-6">
                Start donating books you no longer need.
              </p>
              <Link href="/list-book">
                <Button className="bg-primary hover:bg-primary-hover">
                  Donate a Book
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((book) => (
                <Link
                  key={book._id}
                  href={`/book/${book._id}`}
                  className="card-base overflow-hidden hover:shadow-card transition"
                >
                  <div className="aspect-[4/3] bg-primary-light">
                    {book.images?.[0] ? (
                      <img
                        src={book.images[0]}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {book.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          book.status === "available"
                            ? "bg-primary-light text-primary"
                            : book.status === "donated"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {book.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "received" && (
        <>
          {received.length === 0 ? (
            <div className="text-center py-20 card-base">
              <Heart className="w-12 h-12 text-ink-mute mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No requests yet</h3>
              <p className="text-sm text-ink-soft">
                Requests for your books will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {received.map((r) => (
                <div key={r._id} className="card-base p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden bg-primary-light flex-shrink-0">
                      {r.book?.images?.[0] ? (
                        <img
                          src={r.book.images[0]}
                          alt={r.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{r.book?.title}</h3>
                          <p className="text-sm text-ink-soft mt-1">
                            Requested by <strong>{r.requester?.name}</strong>
                          </p>
                          <p className="text-xs text-ink-mute">
                            {r.requester?.email}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            r.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : r.status === "accepted"
                              ? "bg-primary-light text-primary"
                              : r.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {r.status}
                        </Badge>
                      </div>

                      {r.message && (
                        <p className="text-sm text-ink-soft mt-3 p-3 rounded-lg bg-black/5">
                          "{r.message}"
                        </p>
                      )}

                      {r.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleRequestAction(r._id, "accepted")}
                            className="bg-primary hover:bg-primary-hover"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestAction(r._id, "rejected")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}

                      {r.status === "accepted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestAction(r._id, "completed")}
                          className="mt-4"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark as Handed Over
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "sent" && (
        <>
          {sent.length === 0 ? (
            <div className="text-center py-20 card-base">
              <Package className="w-12 h-12 text-ink-mute mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No requests sent</h3>
              <p className="text-sm text-ink-soft mb-6">
                Browse books and request what you need.
              </p>
              <Link href="/browse">
                <Button className="bg-primary hover:bg-primary-hover">
                  Browse Books
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sent.map((r) => (
                <div key={r._id} className="card-base p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden bg-primary-light flex-shrink-0">
                      {r.book?.images?.[0] ? (
                        <img
                          src={r.book.images[0]}
                          alt={r.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{r.book?.title}</h3>
                          <p className="text-sm text-ink-soft mt-1">
                            Donor: <strong>{r.donor?.name}</strong>
                          </p>
                          <p className="text-xs text-ink-mute">
                            {r.donor?.email}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            r.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : r.status === "accepted"
                              ? "bg-primary-light text-primary"
                              : r.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {r.status}
                        </Badge>
                      </div>

                      {r.status === "accepted" && (
                        <p className="text-sm text-primary mt-3 flex items-center gap-1.5">
                          <Check className="w-4 h-4" />
                          Donor accepted! Coordinate pickup.
                        </p>
                      )}

                      {r.status === "pending" && (
                        <p className="text-sm text-amber-700 mt-3 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Waiting for donor's response
                        </p>
                      )}

                      {r.status === "completed" && (
                        <p className="text-sm text-blue-700 mt-3 flex items-center gap-1.5">
                          <Check className="w-4 h-4" />
                          Book received. Enjoy!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}