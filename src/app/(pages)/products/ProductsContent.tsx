"use client";

import Rating from "@/components/Rating";
import { Package, PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CreateProductModal from "./CreateProductModal";
import { createProduct } from "@/lib/products/createProduct";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  imageKey: string | null;
};

type ProductsContentProps = {
  product: Product[];
};
export default function ProductsContent({ product }: ProductsContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="mb-2 text-2xl font-semibold">Products</h1>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded mr-4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
        </button>
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {product.map((product) => (
          <div
            key={product.id}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-25 w-35 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                {product.imageKey ? (
                  <img
                    src={product.imageKey}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallbackimg.png";
                    }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package size={40} className="text-zinc-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="light:text-gray-800">{product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Stock: {product.stockQuantity}
              </p>
              <div>
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating ?? 0} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createProduct}
      />
    </div>
  );
}
