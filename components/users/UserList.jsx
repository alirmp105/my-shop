"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pen } from "lucide-react";
import UserDialog from "@/components/users/UserDialog";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

function UserCard({ user }) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{user.name}</h3>
          <p dir="ltr" className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <span className={`${user.isActive ? "text-green-500" : "text-red-500"} shrink-0 text-xs`}>
          {user.isActive ? "فعال" : "غیرفعال"}
        </span>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2 border-t pt-3 text-sm">
          <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">شناسه</span><span className="font-mono text-xs">{user._id.slice(20, 24)}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">نقش</span><span>{user.role === "user" ? "کاربر" : "ادمین"}</span></div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary"
        >
          {showDetails ? "بستن جزئیات" : "نمایش جزئیات بیشتر"}
          {showDetails ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
        </button>
        <div className="flex items-center gap-2">
          <UserDialog user={user} />
          <Button size="icon"><Pen className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}

const UserList = ({ users }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "all";
  const role = searchParams.get("role") || "all";

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("key");
    } else {
      params.set(key, value);
    }
    const queryString = params.toString();

    router.push(
      queryString
        ? `
        /admin/users?${queryString.toString()}`
        : "/admin/users",
    );
  };
  return (
    <div>
     <div className="flex gap-4 my-4" >
      مرتب سازی بر اساس 
      وضعیت :
       <Select
        value={status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="وضعیت کاربران" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">همه کاربران</SelectItem>

          <SelectItem value="active">فعال</SelectItem>

          <SelectItem value="inActive">غیرفعال</SelectItem>
        </SelectContent>
      </Select>
      نقش :
      <Select
        value={role}
        onValueChange={(value) => handleFilterChange("role", value)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="نقش کاربر" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">همه کاربران</SelectItem>

          <SelectItem value="user">کاربر</SelectItem>

          <SelectItem value="admin">ادمین</SelectItem>
        </SelectContent>
      </Select>
     </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {users?.map((user) => <UserCard key={user._id} user={user} />)}
      </div>

      <div className="hidden overflow-x-auto md:block">
      <Table className="min-w-[900px] table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>نام کاربر</TableHead>

            <TableHead>ایمیل</TableHead>

            <TableHead>وضعیت</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">
                {user._id.slice(20, 24)}
              </TableCell>
              <TableCell className="max-w-[220px] truncate">{user.name}</TableCell>
              <TableCell dir="ltr" className="max-w-[280px] truncate">{user.email}</TableCell>
              <TableCell
                className={`${user.isActive ? "text-green-500" : "text-red-500"}`}
              >
                {user.isActive ? "فعال " : "غیرفعال"}
              </TableCell>
              <TableCell>
                {`${user.role === "user" ? "کاربر" : "ادمین"}  `}
              </TableCell>
              <TableCell>
                
                  <UserDialog user={user} />
                
                
                <Button>
                  <Pen />
                
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default UserList;
