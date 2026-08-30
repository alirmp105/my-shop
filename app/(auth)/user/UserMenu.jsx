"use client";
import {
  CreditCardIcon,
  LayoutDashboard,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

const UserMenu = ({ session }) => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon />
          <Link href="/dashboard">پروفایل</Link>
        </DropdownMenuItem>
        {session?.user?.role === "admin" && (
          <DropdownMenuItem asChild className="cursor-pointer">
           <Link href="/admin">
            <LayoutDashboard />
            پنل
           </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <CreditCardIcon />
          سفارش ها
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          تنظیمات
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={()=> signOut({callbackUrl : "/"})}>

         
             <LogOutIcon />
          خروج
        
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;
