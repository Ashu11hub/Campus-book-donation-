"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  BookOpen,
  MapPin,
  Calendar,
  GraduationCap,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author?: string;
  subject: string;
  branch: string;
  semester: number;
  condition: string;
  description: string;
  images: string[];
  city: string;
  college: string;
  donationType: string;
  price?: number;
  status: string;
  createdAt: string;
  donor: {
    _id: string;
    name: string;
    email: string;
    college?: string;
    city?: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setBook(data.book);
        } else {
          toast.error(data.error || "Book not found");
        }
      } catch {
        toast.error("Failed to load book");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchBook();
  }, [params.id]);

  const handleRequest = async () => {
    if (!session) {
      toast.error("Please login to request this book");
      router.push("/login");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book?._id, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send request");
        return;
      }

      toast.success("Request sent to donor!");
      setRequestOpen(false);
      setMessage("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const isOwner = session?.user && book?.donor?._id === (session.user as any).id;

  if (loading) {
    return (
      <div className="container-page py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-page py-20 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="w-12 h-12 text-ink-mute mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Book not found</h2>
        <Link href="/browse">
          <Button className="bg-primary hover:bg-primary-hover mt-4 transition-transform hover:scale-105">
            Browse Books
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <section className="container-page py-8">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8 md:gap-12"
      >
        <motion.div variants={itemVariants}>
          <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-primary-light">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                src={book.images?.[selectedImage] || ""}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {book.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {book.images.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge
              className={`${
                book.donationType === "Free"
                  ? "bg-primary-light text-primary"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {book.donationType}
              {book.donationType === "Low Price" && book.price ? ` · ₹${book.price}` : ""}
            </Badge>
            <Badge variant="outline">Semester {book.semester}</Badge>
            <Badge variant="outline">{book.condition}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {book.title}
          </h1>

          {book.author && (
            <p className="text-ink-soft mt-2">by {book.author}</p>
          )}

          <div className="mt-6 space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-ink-soft">
              <BookOpen className="w-4 h-4 text-ink-mute" />
              <span>{book.subject} · {book.branch}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <GraduationCap className="w-4 h-4 text-ink-mute" />
              <span>{book.college}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <MapPin className="w-4 h-4 text-ink-mute" />
              <span>{book.city}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <Calendar className="w-4 h-4 text-ink-mute" />
              <span>Listed {new Date(book.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-ink-soft text-sm leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-semibold mb-3">Donor</h3>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.35 }}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold"
              >
                {book.donor?.name?.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <p className="font-medium text-sm">{book.donor?.name}</p>
                <p className="text-xs text-ink-mute">
                  {book.donor?.college || "Student"} · {book.donor?.city || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {isOwner ? (
              <div className="card-base p-4 bg-primary-light/50 border-primary/20">
                <p className="text-sm text-center text-primary font-medium">
                  This is your listing
                </p>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={() => setRequestOpen(!requestOpen)}
                  disabled={book.status !== "available"}
                  className="w-full bg-primary hover:bg-primary-hover h-12 text-base font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {book.status === "available" ? "Request this Book" : "Not Available"}
                </Button>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {requestOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="card-base p-4">
                  <label className="text-sm font-medium">
                    Message to donor (optional)
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'm a junior from your college. Can I have this book?"
                    rows={3}
                    className="mt-2"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      onClick={() => setRequestOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRequest}
                      disabled={sending}
                      className="flex-1 bg-primary hover:bg-primary-hover"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Send Request"
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}