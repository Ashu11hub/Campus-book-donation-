"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Package, Check, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RequestType {
  _id: string;
  book: {
    _id: string;
    title: string;
    images: string[];
  };
  donor?: { name: string; email: string };
  status: string;
  createdAt: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: Math.min(i * 0.06, 0.4) },
  }),
};

export default function MyRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      try {
        const res = await fetch("/api/requests?type=sent");
        const data = await res.json();
        setRequests(data.requests || []);
      } catch {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="container-page py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <section className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold">My Requests</h1>
        <p className="text-ink-soft mt-2">
          Books you&apos;ve requested from other students
        </p>
      </motion.div>

      {requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-20 card-base"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Package className="w-12 h-12 text-ink-mute mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-1">No requests yet</h3>
          <p className="text-sm text-ink-soft mb-6">
            Browse books and request what you need.
          </p>
          <Link href="/browse">
            <Button className="bg-primary hover:bg-primary-hover transition-transform hover:scale-105">
              Browse Books
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {requests.map((r, i) => (
            <motion.div
              key={r._id}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4 }}
            >
              <Link
                href={`/book/${r.book?._id}`}
                className="card-base p-5 flex items-center gap-4 hover:shadow-card transition-shadow block"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-light flex-shrink-0">
                  {r.book?.images?.[0] ? (
                    <img
                      src={r.book.images[0]}
                      alt={r.book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-mute">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{r.book?.title}</h3>
                  <p className="text-sm text-ink-soft truncate">
                    Donor: {r.donor?.name}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
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
                    {r.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                    {r.status === "completed" && <Check className="w-3 h-3 mr-1" />}
                    {r.status}
                  </Badge>
                  <span className="text-xs text-ink-mute">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}