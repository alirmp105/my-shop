import CategoryList from "@/components/categories/CategoryList";
import { CategorySkeleton } from "@/components/categories/CategorySkeleton";
import { getAdminCategories} from "@/lib/data/categories";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const dynamic = "force-dynamic";
const CategoriesPage = async () => {
  const categories = await getAdminCategories();

  return (
    <div>
       <h4 className="text-4xl">دسته بندی ها</h4>
       <Button className="my-3.5" asChild>
        <Link href="/admin/categories/add">
          دسته بندی جدید
          {/* <Plus />   */}
        </Link>
      </Button>
  <Suspense fallback={<CategorySkeleton />}>
  <CategoryList categories={categories} />
  </Suspense>
  </div>
  );
};

export default CategoriesPage;
