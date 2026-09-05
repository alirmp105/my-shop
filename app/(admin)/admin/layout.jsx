import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { Home } from "lucide-react";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppBreadcrumb from "@/components/app-breadcrumb";
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />

        <main className="w-full">
          {/* هدر بالای صفحه */}
          <header className="border-border/50 bg-background sticky top-0 z-10 flex items-center gap-4 border-b px-6 py-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

            {/* بردکرامب */}
            <AppBreadcrumb />
          </header>

          {/* محتوای صفحه */}
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
