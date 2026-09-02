import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

import { mainNav } from "@/lib/nav";
import { Separator } from "@/components/ui/separator";

const socialLinks = [
  { icon: Mail, href: "#", label: "اینستاگرام" },
  { icon: Mail, href: "#", label: "توییتر" },
  { icon: Mail, href: "#", label: "فیسبوک" },
  { icon: Mail, href: "#", label: "یوتیوب" },
];

const customerLinks = ["پیگیری سفارش", "راهنمای خرید", "شرایط بازگشت کالا", "سوالات متداول"];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-base font-bold">فروشگاه لوتوس</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              فروشگاه آنلاین من از سال ۱۳۹۸ در حال ارائه محصولات باکیفیت با بهترین قیمت به
              مشتریان سراسر کشور است.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-base font-bold">لینک‌های سریع</h3>
            <ul className="space-y-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-base font-bold">خدمات مشتریان</h3>
            <ul className="space-y-2">
              {customerLinks.map((label) => (
                <li key={label}>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-base font-bold">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                تهران، خیابان ولیعصر، پلاک ۱۲۳
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span dir="ltr">021-12345678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span dir="ltr">support@lotusshop.ir</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} فروشگاه من. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
