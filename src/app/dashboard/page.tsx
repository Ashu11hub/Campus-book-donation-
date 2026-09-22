"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: Math.min(i * 0.05, 0.4) },
  }),
};

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

  const tabs = [
    { id: "listings", label: "My Listings", icon: BookOpen, count: books.length },
    {
      id: "received",
      label: "Requests Received",
      icon: Heart,
      count: received.filter((r) => r.status === "pending").length,
    },
    { id: "sent", label: "My Requests", icon: Package, count: sent.length },
  ] as const;

  return (
    <section className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
        <p className="text-ink-soft mt-2">Manage your listings and requests</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-2 mb-6 border-b border-border overflow-x-auto"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                active ? "text-primary" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon className="w-4 h-4 inline mr-1.5" />
              {t.label} ({t.count})
              {active && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === "listings" && (
          <motion.div
            key="listings"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {books.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 card-base"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="w-12 h-12 text-ink-mute mx-auto mb-4" />
                </motion.div>
                <h3 className="font-semibold mb-1">No listings yet</h3>
                <p className="text-sm text-ink-soft mb-6">
                  Start donating books you no longer need.
                </p>
                <Link href="/list-book">
                  <Button className="bg-primary hover:bg-primary-hover transition-transform hover:scale-105">
                    Donate a Book
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.map((book, i) => (
                  <motion.div
                    key={book._id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={`/book/${book._id}`}
                      className="card-base overflow-hidden hover:shadow-card transition-shadow group block"
                    >
                      <div className="aspect-[4/3] bg-primary-light overflow-hidden">
                        {book.images?.[0] ? (
                          <img
                            src={book.images[0]}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "received" && (
          <motion.div
            key="received"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {received.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 card-base"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-12 h-12 text-ink-mute mx-auto mb-4" />
                </motion.div>
                <h3 className="font-semibold mb-1">No requests yet</h3>
                <p className="text-sm text-ink-soft">
                  Requests for your books will show up here.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {received.map((r, i) => (
                  <motion.div
                    key={r._id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="card-base p-5 hover:shadow-card transition-shadow"
                  >
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
                            &ldquo;{r.message}&rdquo;
                          </p>
                        )}

                        {r.status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(r._id, "accepted")}
                                className="bg-primary hover:bg-primary-hover"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestAction(r._id, "rejected")}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </motion.div>
                          </div>
                        )}

                        {r.status === "accepted" && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block mt-4"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestAction(r._id, "completed")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark as Handed Over
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "sent" && (
          <motion.div
            key="sent"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {sent.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 card-base"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Package className="w-12 h-12 text-ink-mute mx-auto mb-4" />
                </motion.div>
                <h3 className="font-semibold mb-1">No requests sent</h3>
                <p className="text-sm text-ink-soft mb-6">
                  Browse books and request what you need.
                </p>
                <Link href="/browse">
                  <Button className="bg-primary hover:bg-primary-hover transition-transform hover:scale-105">
                    Browse Books
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {sent.map((r, i) => (
                  <motion.div
                    key={r._id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="card-base p-5 hover:shadow-card transition-shadow"
                  >
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
                            Waiting for donor&apos;s response
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
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}