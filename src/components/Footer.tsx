import Link from "next/link";
import { BookOpen, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Campus Books</span>
            </div>
            <p className="text-sm text-ink-soft max-w-sm leading-relaxed">
              Give your old books a new home. Donate study material to juniors
              who need them — reduce waste, help students.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link href="/browse" className="hover:text-primary transition">Browse Books</Link></li>
              <li><Link href="/list-book" className="hover:text-primary transition">Donate a Book</Link></li>
              <li><Link href="/about" className="hover:text-primary transition">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-black/5 hover:bg-primary-light hover:text-primary flex items-center justify-center transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-black/5 hover:bg-primary-light hover:text-primary flex items-center justify-center transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-mute">
          <p>© {new Date().getFullYear()} Campus Books. Made for students.</p>
          <p>Built with Next.js & MongoDB</p>
        </div>
      </div>
    </footer>
  );
}