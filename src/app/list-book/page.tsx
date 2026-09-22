"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-page py-20 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Please login first</h2>
        <p className="text-ink-soft mb-6">
          You need to be logged in to donate a book.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-primary hover:bg-primary-hover transition-transform hover:scale-105"
        >
          Login
        </Button>
      </motion.div>
    );
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.35 },
    }),
  };

  return (
    <section className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold">Donate a Book</h1>
          <p className="text-ink-soft mt-2">
            Share your study material with someone who needs it.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card-base p-6 md:p-8 space-y-6"
        >
          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <Label>Book Photos * (max 5)</Label>
            <p className="text-xs text-ink-mute mt-1 mb-3">
              First photo will be the cover.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <AnimatePresence>
                {images.map((url) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                  >
                    <img src={url} alt="Book" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length < 5 && (
                <motion.label
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-light/30 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
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
                </motion.label>
              )}
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-5"
          >
            <div>
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Data Structures & Algorithms"
                required
                className="mt-1.5 transition-shadow focus:shadow-[0_0_0_4px_rgba(45,106,79,0.1)]"
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
          </motion.div>

          <motion.div
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-5"
          >
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
          </motion.div>

          <motion.div
            custom={3}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-5"
          >
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
          </motion.div>

          <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
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
          </motion.div>

          <motion.div
            custom={5}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-5"
          >
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
          </motion.div>

          <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
            <Label>Donation Type *</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {["Free", "Exchange", "Low Price"].map((type) => (
                <motion.label
                  key={type}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
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
                </motion.label>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {form.donationType === "Low Price" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            custom={7}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="pt-4 border-t border-border"
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}