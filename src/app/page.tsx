"use client";

import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  { value: 1200, suffix: "+", label: "Books shared" },
  { value: 850, suffix: "+", label: "Students helped" },
  { value: 40, suffix: "+", label: "Colleges" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function FloatingBook({
  delay,
  duration,
  x,
  y,
  size,
  rotate,
}: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  size: number;
  rotate: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute pointer-events-none hidden md:block z-20"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [rotate, rotate + 5, rotate],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <BookOpen size={size} className="text-primary" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <section className="container-page pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute right-[-8%] top-[8%]  -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] pointer-events-none select-none z-0"
        >
          <motion.img
            src="/hero-illustration.png"
            alt=""
            className="w-full h-full object-contain opacity-15 md:opacity-20"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <FloatingBook delay={0} duration={6} x="85%" y="10%" size={48} rotate={-15} />
        <FloatingBook delay={0.3} duration={7} x="92%" y="55%" size={36} rotate={20} />
        <FloatingBook delay={0.6} duration={5.5} x="80%" y="80%" size={42} rotate={-8} />
        <FloatingBook delay={0.9} duration={6.5} x="75%" y="35%" size={30} rotate={12} />

        <div className="max-w-3xl relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-medium mb-6 relative overflow-hidden"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Free for every student
            <motion.span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight"
          >
            Your old books.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-primary"
          >
            Someone&apos;s next semester.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed"
          >
            Don&apos;t let your study material gather dust. Pass it on to a junior
            who needs it — no cost, no waste, just help.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover h-12 px-6 text-base font-medium transition-transform hover:scale-105 active:scale-95"
              >
                Browse Books
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/list-book">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base font-medium border-border hover:bg-black/5 transition-transform hover:scale-105 active:scale-95"
              >
                Donate a Book
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl relative z-30">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-primary">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-ink-mute mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="container-page py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="mt-3 text-ink-soft">
              Three simple steps. No money involved. Just kindness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card-base p-6 hover:shadow-card transition-shadow duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xs font-semibold text-ink-mute mb-2">
                  STEP {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="card-base p-10 md:p-14 bg-primary text-white border-0 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BookOpen className="w-10 h-10 mb-5 opacity-90" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Got books you&apos;ll never open again?
            </h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              List them in under two minutes. Somewhere on your campus, a junior
              is looking for exactly what you have.
            </p>
            <Link href="/list-book" className="inline-block mt-7">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 h-12 px-6 text-base font-medium transition-transform hover:scale-105 active:scale-95"
              >
                Start Donating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}