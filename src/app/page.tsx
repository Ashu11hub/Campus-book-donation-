import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Search, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Upload,
    title: "List your book",
    desc: "Snap photos, add details — semester, subject, condition. Takes 2 minutes.",
  },
  {
    icon: Search,
    title: "Juniors find it",
    desc: "Students search by college, branch, semester. Your book shows up.",
  },
  {
    icon: HeartHandshake,
    title: "Hand it over",
    desc: "Accept the request, meet on campus, pass the book on. Zero cost.",
  },
];

const stats = [
  { value: "1,200+", label: "Books shared" },
  { value: "850+", label: "Students helped" },
  { value: "40+", label: "Colleges" },
];

export default function Home() {
  return (
    <>
      <section className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Free for every student
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Your old books.
            <br />
            <span className="text-primary">Someone&apos;s next semester.</span>
          </h1>

          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            Don&apos;t let your study material gather dust. Pass it on to a junior
            who needs it — no cost, no waste, just help.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse">
              <Button size="lg" className="bg-primary hover:bg-primary-hover h-12 px-6 text-base font-medium">
                Browse Books
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/list-book">
              <Button size="lg" variant="outline" className="h-12 px-6 text-base font-medium border-border hover:bg-black/5">
                Donate a Book
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-ink-mute mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="container-page py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="mt-3 text-ink-soft">
              Three simple steps. No money involved. Just kindness.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="card-base p-6">
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xs font-semibold text-ink-mute mb-2">
                  STEP {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="card-base p-10 md:p-14 bg-primary text-white border-0 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <BookOpen className="w-10 h-10 mb-5 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Got books you&apos;ll never open again?
            </h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              List them in under two minutes. Somewhere on your campus, a junior
              is looking for exactly what you have.
            </p>
            <Link href="/list-book" className="inline-block mt-7">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-6 text-base font-medium">
                Start Donating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
        </div>
      </section>
    </>
  );
}