import { Package, PackageCheck, PackageX } from "lucide-react";

const StockStatus = ({ stock }) => {
  if (stock === 0) {
    return (
      <div className="flex items-center gap-1.5 text-red-500">
        <PackageX className="size-4" />
        <span>{stock}</span>
      </div>
    );
  }

  if (stock <= 5) {
    return (
      <div className="flex items-center gap-1.5 text-yellow-500">
        <Package className="size-4" />
        <span>{stock}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-green-500">
      <PackageCheck className="size-4" />
      <span>{stock}</span>
    </div>
  );
};

export default StockStatus