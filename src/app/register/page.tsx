"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    city: "",
    branch: "",
    year: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created! Please login.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, delay: 0.3 + i * 0.05 },
    }),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-page py-2"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4"
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-ink-soft mt-2">
            Start sharing and receiving books
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-base p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
                className="mt-1.5 transition-shadow focus:shadow-[0_0_0_4px_rgba(45,106,79,0.1)]"
              />
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@college.edu"
                required
                className="mt-1.5 transition-shadow focus:shadow-[0_0_0_4px_rgba(45,106,79,0.1)]"
              />
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="mt-1.5 transition-shadow focus:shadow-[0_0_0_4px_rgba(45,106,79,0.1)]"
              />
            </motion.div>

            <motion.div
              custom={3}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="IIT Delhi"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Delhi"
                  className="mt-1.5"
                />
              </div>
            </motion.div>

            <motion.div
              custom={4}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="CSE"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="3rd"
                  className="mt-1.5"
                />
              </div>
            </motion.div>

            <motion.div
              custom={5}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover h-11 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 pt-6 border-t border-border text-center text-sm"
          >
            <span className="text-ink-soft">Already have an account? </span>
            <Link href="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}