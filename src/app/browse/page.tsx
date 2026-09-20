"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, BookOpen, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Book {
  _id: string;
  title: string;
  author?: string;
  subject: string;
  branch: string;
  semester: number;
  condition: string;
  images: string[];
  city: string;
  college: string;
  donationType: string;
  price?: number;
  donor?: { name: string };
}

const branches = ["All", "CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "Other"];
const semesters = ["All", "1", "2", "3", "4", "5", "6", "7", "8"];
const donationTypes = ["All", "Free", "Exchange", "Low Price"];

export default function BrowsePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    branch: "All",
    semester: "All",
    city: "",
    donationType: "All",
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.branch !== "All") params.set("branch", filters.branch);
      if (filters.semester !== "All") params.set("semester", filters.semester);
      if (filters.city) params.set("city", filters.city);
      if (filters.donationType !== "All") params.set("donationType", filters.donationType);

      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  return (
    <section className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Browse Books</h1>
        <p className="text-ink-soft mt-2">
          Find study material donated by students near you.
        </p>
      </div>

      <div className="card-base p-4 md:p-5 mb-8">
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute" />
            <Input
              placeholder="Search by title, author, subject..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <select
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            className="md:col-span-2 h-10 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {branches.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All Branches" : b}</option>
            ))}
          </select>

          <select
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            className="md:col-span-2 h-10 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {semesters.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Semesters" : `Sem ${s}`}</option>
            ))}
          </select>

          <Input
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="md:col-span-2"
          />

          <select
            value={filters.donationType}
            onChange={(e) => setFilters({ ...filters, donationType: e.target.value })}
            className="md:col-span-2 h-10 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {donationTypes.map((d) => (
              <option key={d} value={d}>{d === "All" ? "All Types" : d}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-ink-mute mt-3 text-sm">Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-ink-mute mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">No books found</h3>
          <p className="text-ink-soft text-sm mb-6">
            Try changing filters or be the first to donate!
          </p>
          <Link href="/list-book">
            <Button className="bg-primary hover:bg-primary-hover">
              Donate a Book
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {books.map((book) => (
            <Link
              key={book._id}
              href={`/book/${book._id}`}
              className="card-base overflow-hidden hover:shadow-card transition group"
            >
              <div className="aspect-[4/3] bg-primary-light overflow-hidden">
                {book.images?.[0] ? (
                  <img
                    src={book.images[0]}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary/40" />
                  </div>
                )}
              </div>

              <div className="p-3 md:p-4">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${
                      book.donationType === "Free"
                        ? "bg-primary-light text-primary"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {book.donationType}
                    {book.donationType === "Low Price" && book.price
                      ? ` ₹${book.price}`
                      : ""}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Sem {book.semester}
                  </Badge>
                </div>

                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-xs text-ink-mute mt-1 truncate">
                    by {book.author}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-3 text-xs text-ink-soft">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{book.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}