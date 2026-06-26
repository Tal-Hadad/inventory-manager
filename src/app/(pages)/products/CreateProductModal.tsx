"use client";
import type { CreateProductInput } from "@/lib/products/createProduct";
import { ChangeEvent, SubmitEvent, useState } from "react";

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CreateProductInput) => void | Promise<void>;
};

type ProductFormState = {
  name: string;
  sku: string;
  price: string;
  costPrice: string;
  reorderPoint: string;
  stockQuantity: string;
  rating: string;
  imageKey: string;
};

const initialFormData: ProductFormState = {
  name: "",
  sku: "",
  price: "",
  costPrice: "",
  reorderPoint: "",
  stockQuantity: "",
  rating: "",
  imageKey: "",
};
export default function CreateProductModal({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const parseOptionalNumber = (value: string) => {
    if (value.trim() === "") return undefined;
    return Number(value);
  };

  const parseOptionalInt = (value: string) => {
    if (value.trim() === "") return undefined;
    return parseInt(value, 10);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payload: CreateProductInput = {
      name: formData.name.trim(),
      sku: formData.sku.trim() || undefined,
      price: Number(formData.price),
      costPrice: parseOptionalNumber(formData.costPrice),
      reorderPoint: parseOptionalInt(formData.reorderPoint),
      stockQuantity: parseOptionalInt(formData.stockQuantity),
      rating: parseOptionalNumber(formData.rating),
      imageKey: formData.imageKey.trim() || undefined,
    };

    try {
      await onCreate(payload);
      setFormData(initialFormData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sku" ? value.toUpperCase() : value,
    }));
  };

  const labelCSS = "block text-sm font-medium";
  const inputCSS =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md mt-2";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-20">
      <div className=" relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-zinc-900">
        <h1 className="mb-2 text-2xl font-semibold">Create New Product</h1>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className={labelCSS}>
            Product Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCSS}
            required
          />

          <label htmlFor="sku" className={labelCSS}>
            SKU
          </label>
          <input
            id="sku"
            type="text"
            name="sku"
            placeholder="SKU"
            onChange={handleChange}
            value={formData.sku}
            className={inputCSS}
          />

          <label htmlFor="price" className={labelCSS}>
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCSS}
            required
          />
          <label htmlFor="costPrice" className={labelCSS}>
            Cost Price
          </label>
          <input
            id="costPrice"
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            onChange={handleChange}
            value={formData.costPrice}
            className={inputCSS}
          />
          <label htmlFor="reorderPoint" className={labelCSS}>
            Reorder Point
          </label>
          <input
            id="reorderPoint"
            type="number"
            name="reorderPoint"
            placeholder="Reorder Point"
            onChange={handleChange}
            value={formData.reorderPoint}
            className={inputCSS}
          />
          <label htmlFor="stockQuantity" className={labelCSS}>
            Stock Quantity
          </label>
          <input
            id="stockQuantity"
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCSS}
          />
          <label htmlFor="rating" className={labelCSS}>
            Rating
          </label>
          <input
            id="rating"
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCSS}
          />
          <label htmlFor="imageKey" className={labelCSS}>
            Image Key
          </label>
          <input
            id="imageKey"
            type="text"
            name="imageKey"
            placeholder="Image Key"
            onChange={handleChange}
            value={formData.imageKey}
            className={inputCSS}
          />
          <button
            type="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-1 bg-zinc-700 text-white rounded hover:bg-zinc-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
