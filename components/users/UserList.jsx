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

      <Table className="table-fixed">
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
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
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
  );
};

export default UserList;
