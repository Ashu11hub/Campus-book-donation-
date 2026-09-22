"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Books" },
  { href: "/list-book", label: "Donate a Book" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setOpen(false);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b transition-shadow duration-300 ${
        scrolled ? "border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]" : "border-transparent"
      }`}
    >
      <nav className="container-page flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"
          >
            <BookOpen className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">Campus Books</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary-light rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-lg bg-black/5 opacity-0 hover:opacity-100 transition-opacity -z-10" />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        {status === "loading" ? (
          <div className="hidden md:block w-24 h-9 bg-black/5 rounded-lg animate-pulse" />
        ) : session ? (
          <div className="hidden md:block relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full hover:bg-black/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {userInitial}
              </div>
              <span className="text-sm font-medium max-w-[120px] truncate">
                {session.user?.name?.split(" ")[0] || "User"}
              </span>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-56 card-base p-2 z-50 shadow-card origin-top-right"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-semibold truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-ink-mute truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>

                    <Link
                      href="/my-requests"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      My Requests
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium transition-transform hover:scale-105"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary-hover font-medium transition-transform hover:scale-105"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-black/5"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container-page py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-black/5"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-black/5"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/my-requests"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-black/5"
                  >
                    My Requests
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary-hover">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}