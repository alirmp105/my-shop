import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">پروفایل</h1>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">نام</p>
            <p className="mt-1 font-medium">{session.user.name || "کاربر"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">ایمیل</p>
            <p className="mt-1 font-medium">{session.user.email}</p>
          </div>

          <div>
            <p className="text-muted-foreground">نقش</p>
            <p className="mt-1 font-medium">{session.user.role === "admin" ? "ادمین" : "کاربر"}</p>
          </div>
          <Button asChild>
          <Link href="/">

        بازگشت به صفحه اصلی
          </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
