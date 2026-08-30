"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";

import { mainNav } from "@/lib/nav";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu />
              <span className="sr-only">باز کردن منو</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>فروشگاه لوتوس</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingBag className="size-5" />
          </span>
          <span className="hidden text-lg sm:inline">فروشگاه لوتوس</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          {/* Search */}
          <div className="hidden sm:flex">
            {searchOpen ? (
              <Input
                autoFocus
                placeholder="جستجوی محصول..."
                className="w-56"
                onBlur={() => setSearchOpen(false)}
              />
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search />
                <span className="sr-only">جستجو</span>
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search />
            <span className="sr-only">جستجو</span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-1  flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
            <span className="sr-only">سبد خرید</span>
            </Link>
          </Button>

          {/* Auth */}
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <User />
            ورود / ثبت‌نام
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <User />
            <span className="sr-only">ورود / ثبت‌نام</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
