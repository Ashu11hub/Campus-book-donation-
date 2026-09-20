"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Upload, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const branches = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "Other"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
const conditions = ["Like New", "Good", "Fair", "Poor"];

export default function ListBookPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    subject: "",
    branch: "CSE",
    semester: "1",
    condition: "Good",
    description: "",
    city: "",
    college: "",
    donationType: "Free",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      setImages([...images, ...data.urls]);
      toast.success(`${data.urls.length} image(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least 1 image");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        ...form,
        semester: Number(form.semester),
        images,
      };
      if (form.donationType === "Low Price") {
        payload.price = Number(form.price);
      } else {
        delete payload.price;
      }

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to list book");
        return;
      }

      toast.success("Book listed successfully!");
      router.push(`/book/${data.book._id}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container-page py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container-page py-20 text-center">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please login first</h2>
        <p className="text-ink-soft mb-6">
          You need to be logged in to donate a book.
        </p>
        <Button onClick={() => router.push("/login")} className="bg-primary hover:bg-primary-hover">
          Login
        </Button>
      </div>
    );
  }

  return (
    <section className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Donate a Book</h1>
          <p className="text-ink-soft mt-2">
            Share your study material with someone who needs it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-6 md:p-8 space-y-6">
          <div>
            <Label>Book Photos * (max 5)</Label>
            <p className="text-xs text-ink-mute mt-1 mb-3">
              First photo will be the cover.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {images.map((url) => (
                <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <img src={url} alt="Book" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-light/30 flex flex-col items-center justify-center cursor-pointer transition">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-ink-mute mb-1" />
                      <span className="text-xs text-ink-mute">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Data Structures & Algorithms"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Cormen"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="DSA"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch *</Label>
              <select
                id="branch"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="semester">Semester *</Label>
              <select
                id="semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell about the book's condition, any notes, edition, etc."
              required
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="college">College *</Label>
              <Input
                id="college"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="IIT Delhi"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Delhi"
                required
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label>Donation Type *</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {["Free", "Exchange", "Low Price"].map((type) => (
                <label
                  key={type}
                  className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition ${
                    form.donationType === type
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border hover:bg-black/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="donationType"
                    value={type}
                    checked={form.donationType === type}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {form.donationType === "Low Price" && (
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="100"
                className="mt-1.5"
              />
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-primary hover:bg-primary-hover h-12 text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Listing book...
                </>
              ) : (
                "List Book for Donation"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}