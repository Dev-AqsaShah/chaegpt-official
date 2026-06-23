"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Sun, Moon, User, LogOut, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { navLinks, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = itemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/50 bg-background/90 py-2 shadow-sm backdrop-blur-md"
          : "border-transparent bg-background/60 py-3.5 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center px-4 md:grid-cols-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div animate={{ scale: scrolled ? 0.88 : 1 }} transition={{ duration: 0.25 }}>
            <Image
              src="/chaigpt-logo.jpg"
              alt="Chae GPT logo"
              width={44}
              height={44}
              className="rounded-full object-cover"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden items-center justify-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-1.5">
          {/* Phone pill — desktop only */}
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="mr-1 hidden items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary lg:flex"
          >
            <Phone className="h-3 w-3" />
            {siteConfig.contact.phone}
          </a>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
              >
                {count}
              </motion.span>
            )}
          </Button>

          {/* User menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  My Orders
                </DropdownMenuItem>
                {(session.user as { role?: string }).role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="mt-1 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
              >
                <Phone className="h-3.5 w-3.5" /> {siteConfig.contact.phone}
              </a>
              {!session && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 rounded-md px-3 py-2 text-sm font-medium text-primary"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
