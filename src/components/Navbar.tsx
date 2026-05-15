import { Link } from "@tanstack/react-router";
import { GraduationCap, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const linkCls =
    "text-sm text-muted-foreground transition-colors hover:text-foreground";
  const activeCls = "text-foreground font-semibold";
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-full glass px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">IIITK Companion</span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link to="/setup" className={linkCls} activeProps={{ className: activeCls }}>
            Setup
          </Link>
          <Link to="/dashboard" className={linkCls} activeProps={{ className: activeCls }}>
            Dashboard
          </Link>
          <Link to="/analytics" className={linkCls} activeProps={{ className: activeCls }}>
            Analytics
          </Link>
          <Link to="/about" className={linkCls} activeProps={{ className: activeCls }}>
            About
          </Link>
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}