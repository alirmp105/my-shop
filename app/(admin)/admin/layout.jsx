import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/AppSidebar"
import { Home } from "lucide-react"
import Link from "next/link"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function AdminLayout({ children }) {
  return (
    <TooltipProvider>
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      
      <main className="w-full">
        {/* هدر بالای صفحه */}
        <header className="border-border/50 bg-background sticky top-0 z-10 flex items-center gap-4 border-b px-6 py-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          
          {/* بردکرامب */}
          <nav className="flex items-center gap-2 text-sm">
            <Link 
              href="/admin" 
              className="text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Home className="size-4" />
              داشبورد
            </Link>
            <span className="text-muted-foreground">/</span>
           
          </nav>
        </header>

        {/* محتوای صفحه */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
    </TooltipProvider>
  )
}