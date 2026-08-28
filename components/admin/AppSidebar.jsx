"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChartNoAxesColumn,
  ChevronLeft,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  GitCommitVerticalIcon,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageCircle,
  Package,
  Settings2,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "علی حسینی",
    email: "ali@example.com",
    // avatar: "/avatars/sara.jpg",
  },
  navMain: [
    { title: "داشبورد", url: "/admin", icon: LayoutDashboard },
   
   
    { title: "کاربران", url: "/admin/users", icon: Users, badge: "۱۲" },
    {title : "نظرات" ,  url : "/admin/comments" , icon : MessageCircle },
    
    {
      title: "فروشگاه",
      icon: ShoppingCart,
      items: [
        { title: "سفارش‌ها", url: "/orders" },
        { title: "محصولات", url: "/admin/products" },
        { title: "دسته‌بندی‌ها", url: "/admin/categories" },
        { title: "کد تخفیف", url: "/admin/coupon" },
        { title: "برند ها", url: "/admin/brands" },
      ],
    },
    {
      title: "انبار",
      icon: Package,
      items: [
        { title: "موجودی", url: "/admin/inventory" },
        { title: "تأمین‌کنندگان", url: "/suppliers" },
      ],
    },
    { title: "گزارش‌ها", url: "/reports", icon: ChartNoAxesColumn },
  ],
  navSecondary: [
    { title: "تنظیمات", url: "/settings", icon: Settings2 },
    { title: "پشتیبانی", url: "/support", icon: LifeBuoy },
  ],
}

export function AppSidebar(props) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  return (
    <Sidebar dir="rtl" side="right" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">شرکت آکمه</span>
                  <span className="truncate text-xs">پنل مدیریت</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>منوی اصلی</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.items.some((sub) => sub.url === pathname)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronLeft className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === sub.url}
                            >
                              <Link href={sub.url}>
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>سیستم</SidebarGroupLabel>
          <SidebarMenu>
            {data.navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {/* <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">سم</AvatarFallback>
                  </Avatar> */}
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{data.user.name}</span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                dir="rtl"
                side={isMobile ? "bottom" : "left"}
                align="end"
                sideOffset={4}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                    {/* <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">سم</AvatarFallback>
                    </Avatar> */}
                    <div className="grid flex-1 leading-tight">
                      <span className="truncate font-medium">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    حساب کاربری
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    صورت‌حساب
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    اعلان‌ها
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  خروج از حساب
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

