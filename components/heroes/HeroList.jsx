"use client";

import Image from "next/image";
import Link from "next/link";
import { PencilIcon, Plus, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HeroList({ heroes = [] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  async function remove(id) {
    setDeleting(id);
    setError("");
    try {
      const response = await fetch(`/api/heroes/${id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message);
      toast.success("اسلاید حذف شد", { position: "top-center" });
      router.refresh();
    } catch (e) {
      setError(e.message || "حذف انجام نشد");
    } finally {
      setDeleting(null);
    }
  }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">اسلایدهای Hero</h1>
        <Button asChild>
          <Link href="/admin/heroes/add">
            اسلاید جدید <Plus />
          </Link>
        </Button>
      </div>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>تصویر</TableHead>
              <TableHead>عنوان</TableHead>
              <TableHead>دکمه</TableHead>
              <TableHead>ترتیب</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>بازه نمایش</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heroes.map((hero) => (
              <TableRow key={hero._id}>
                <TableCell>
                  <Image
                    src={hero.image?.url}
                    alt={hero.title}
                    width={120}
                    height={56}
                    className="h-14 w-28 rounded object-cover"
                  />
                </TableCell>
                <TableCell>{hero.title}</TableCell>
                <TableCell dir="ltr">{hero.button?.href}</TableCell>
                <TableCell>{hero.order}</TableCell>
                <TableCell>{hero.isActive ? "فعال" : "غیرفعال"}</TableCell>
                <TableCell dir="ltr" className="text-xs">
                  {hero.startAt
                    ? new Date(hero.startAt).toLocaleString("fa-IR")
                    : "—"}{" "}
                  تا{" "}
                  {hero.endAt
                    ? new Date(hero.endAt).toLocaleString("fa-IR")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button asChild size="icon" variant="outline">
                    <Link href={`/admin/heroes/${hero._id}/edit`}>
                      <PencilIcon />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="mx-2"
                    onClick={() => remove(hero._id)}
                    disabled={deleting === hero._id}
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
