"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Fixed import for App Router
import { Input } from "@/components/ui/input";
import { ArrowRight, Asterisk, Plus, Trash2, XCircle } from "lucide-react";
import { TextArea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TagInput from "@/components/ui/tagInput";
import toast from "react-hot-toast";

import { createProduct } from "@/app/actions/productActions";

const PRODUCT_CATEGORIES = [
  "MOBILES",
  "LAPTOPS_ACCESSORIES",
  "WEARABLES",
  "HEADPHONES_AUDIO",
  "KITCHEN_DINNING",
  "MENS_CLOTHING",
  "WOMENS_CLOTHING",
  "KIDS_WEAR",
  "SKINCARE",
] as const;

// Type Definitions for product state
interface ProductState {
  title: string;
  description: string;
  images: (File | string)[]; // Can be File objects or URLs
  category: (typeof PRODUCT_CATEGORIES)[number] | ""; // Strict category type
  specifications: { name: string; value: string }[];
  price: number;
  salePrice: number;
  quantity: number;
  sku: string;
  enableNegotiation: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
}

const ProductBuilder = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<ProductState>({
    title: "",
    description: "",
    images: [],
    category: "",
    specifications: [{ name: "", value: "" }],
    price: 0,
    salePrice: 0,
    quantity: 0,
    sku: "",
    enableNegotiation: false,
    seoTitle: "",
    seoDescription: "",
    tags: [],
  });

  // Validation function
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!product.title.trim()) errors.push("Product title is required");
    if (!product.description.trim())
      errors.push("Product description is required");
    if (!product.category) errors.push("Product category is required");
    if (!product.price || product.price <= 0)
      errors.push("Valid price is required");
    if (product.quantity < 0) errors.push("Valid quantity is required");
    if (product.images.length === 0)
      errors.push("At least one product image is required");

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (value: (typeof PRODUCT_CATEGORIES)[number]) => {
    setProduct((prev) => ({
      ...prev,
      category: value,
    }));
  };

  // Image handling - placeholder for now
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Specification handling
  const addSpecification = () => {
    setProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }));
  };

  const handleSpecificationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newSpecs = product.specifications.map((spec, i) =>
      i === index ? { ...spec, [name]: value } : spec
    );
    setProduct((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const removeSpecification = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Discard functionality
  const handleDiscard = () => {
    setProduct({
      title: "",
      description: "",
      images: [],
      category: "",
      specifications: [{ name: "", value: "" }],
      price: 0,
      salePrice: 0,
      quantity: 0,
      sku: "",
      enableNegotiation: false,
      seoTitle: "",
      seoDescription: "",
      tags: [],
    });
    router.push("/seller/products");
  };

  // Submit handling with validation and toast
  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    // Validate form before submission
    const validation = validateForm();
    if (!validation.isValid) {
      const displayErrors = validation.errors.slice(0, 2).join(". ");
      toast.error(`Validation failed: ${displayErrors}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedSpecifications = product.specifications.reduce(
        (acc: Record<string, string>, spec) => {
          if (spec.name && spec.value) {
            acc[spec.name] = spec.value;
          }
          return acc;
        },
        {}
      );

      const productData = {
        title: product.title,
        description: product.description,
        images: product.images.map((file) =>
          file instanceof File ? `placeholder-${file.name}` : file
        ), // Placeholder: Skip actual upload for now
        category: product.category as any,
        specifications: formattedSpecifications,
        price: parseFloat(product.price.toString()),
        salePrice: product.salePrice
          ? parseFloat(product.salePrice.toString())
          : null,
        quantity: parseInt(product.quantity.toString(), 10),
        sku: product.sku,
        enableNegotiation: product.enableNegotiation,
        seoTitle: product.seoTitle || product.title,
        seoDescription: product.seoDescription || product.description,
        tags: product.tags,
        status: status,
        sellerId: userId,
      };

      const result = await createProduct(productData);

      if (result.success) {
        toast.success(
          `Product ${
            status === "PUBLISHED" ? "published" : "saved as draft"
          } successfully!`
        );
        handleDiscard(); // Reset form and redirect
      } else {
        toast.error(`Failed to save product`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An unexpected error occurred while saving product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="card-form">
        <h3 className="mb-4 md:mb-[26px] font-medium text-xl md:text-2xl">
          General Information
        </h3>
        {/* Product Title */}
        <div className="mb-5">
          <label
            htmlFor="productTitle"
            className="text-base md:text-xl font-medium relative"
          >
            Product Title{" "}
            <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
          </label>
          <Input
            id="productTitle"
            name="title"
            className="mt-2.5"
            placeholder="Enter Product Name"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>
        {/* Description */}
        <div className="mb-5">
          <label
            htmlFor="productDescription"
            className="text-base md:text-xl font-medium relative"
          >
            Description{" "}
            <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
          </label>
          <TextArea
            id="productDescription"
            name="description"
            className="mt-2.5"
            placeholder="Enter Product Description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* Images */}
        <div>
          <label
            htmlFor="productImages"
            className="text-base md:text-xl font-medium relative"
          >
            Product Images
            <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
          </label>
          <div className="mt-2.5 border-2 border-border border-dashed rounded-md p-4 text-center cursor-pointer">
            <input
              id="productImages"
              type="file"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              required={product.images.length === 0}
            />
            <label
              htmlFor="productImages"
              className="block w-full h-full cursor-pointer text-foreground-2 hover:text-primary transition-colors"
            >
              Click to Select Images
            </label>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {product.images.length > 0 ? (
                product.images.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border rounded-md overflow-hidden"
                  >
                    <img
                      src={
                        file instanceof File ? URL.createObjectURL(file) : file
                      }
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                      aria-label="Remove image"
                    >
                      <XCircle className="size-4" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-sm text-foreground-2">
                  No images selected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="card-form">
        <label className="text-base md:text-xl font-medium relative">
          Category{" "}
          <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
        </label>
        <Select
          value={product.category}
          onValueChange={handleCategoryChange}
          required
        >
          <SelectTrigger className="mt-2.5 w-full h-[52px]! bg-background! text-foreground-2! font-normal! text-sm! md:text-base! pl-2.5 pr-2 py-2 cursor-pointer shadow-none">
            <SelectValue placeholder="Categories" />
          </SelectTrigger>
          <SelectContent className="bg-background text-sm border-foreground">
            {PRODUCT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Specification */}
      <div className="card-form">
        <h3 className="font-medium text-xl md:text-2xl mb-4 md:mb-[26px]">
          Specifications
        </h3>
        {product.specifications.map((spec, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-5 mb-5 items-end"
          >
            <div>
              <label
                htmlFor={`specName-${index}`}
                className="text-base md:text-xl font-medium"
              >
                Specification Name{" "}
              </label>
              <Input
                id={`specName-${index}`}
                name="name"
                className="mt-2.5"
                placeholder="e.g., Brand, Color, RAM"
                value={spec.name}
                onChange={(e) => handleSpecificationChange(index, e)}
              />
            </div>
            <div>
              <label
                htmlFor={`specValue-${index}`}
                className="text-base md:text-xl font-medium"
              >
                Specification Value{" "}
              </label>
              <Input
                id={`specValue-${index}`}
                name="value"
                className="mt-2.5"
                placeholder="e.g., Samsung, Black, 8GB"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, e)}
              />
            </div>
            {product.specifications.length > 1 && (
              <Button
                type="button"
                onClick={() => removeSpecification(index)}
                variant="destructive"
                className="px-2 py-2 h-auto"
                aria-label="Remove specification"
              >
                <Trash2 className="size-5" />
              </Button>
            )}
          </div>
        ))}
        <button
          onClick={addSpecification}
          type="button"
          className="text-[#315CEA] ml-auto text-sm md:text-base max-w-[130px] sm:max-w-[240px] text-right flex items-center gap-1 mt-2"
        >
          <Plus className="h-[20px] w-[20px]" /> Add another specification
        </button>
      </div>

      {/* Pricing & Inventory */}
      <div className="card-form">
        <h3 className="mb-4 md:mb-[26px] font-medium text-xl md:text-2xl">
          Pricing & Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="price"
              className="text-base md:text-xl font-medium relative"
            >
              Price($)
              <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className="mt-2.5"
              placeholder="0.00"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="salePrice"
              className="text-base md:text-xl font-medium "
            >
              Sale Price($)
            </label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              min="0"
              step="0.01"
              className="mt-2.5"
              placeholder="0.00"
              value={product.salePrice}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="text-base md:text-xl font-medium relative"
            >
              Quantity
              <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
            </label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              className="mt-2.5"
              placeholder="0"
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="sku"
              className="text-base md:text-xl font-medium relative"
            >
              SKU
            </label>
            <Input
              id="sku"
              name="sku"
              className="mt-2.5"
              placeholder="e.g. MP-001 (optional - will be auto-generated)"
              value={product.sku}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Checkbox - Enable Negotiation */}
      <div className="card-form">
        <div className="flex items-center gap-2">
          <Checkbox
            id="enableNegotiation"
            name="enableNegotiation"
            checked={product.enableNegotiation}
            onCheckedChange={(checked: boolean) =>
              handleChange({
                target: {
                  name: "enableNegotiation",
                  type: "checkbox",
                  checked,
                  value: checked.toString(),
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            aria-label="Enable Negotiation"
            className="h-5 w-5"
          />
          <label
            htmlFor="enableNegotiation"
            className="text-base md:text-xl font-medium cursor-pointer"
          >
            Enable Negotiation
          </label>
        </div>
      </div>

      {/* Additional Information */}
      <div className="card-form">
        <h3 className="mb-4 md:mb-[26px] font-medium text-xl md:text-2xl">
          Additional Information
        </h3>
        {/* Tags */}
        <TagInput
          className="mb-5"
          tags={product.tags}
          onTagsChange={(newTags) =>
            setProduct((prev) => ({
              ...prev,
              tags: newTags,
            }))
          }
          label="Tags"
          placeholder="e.g. smartphone, android, 5G, etc. Press enter to add"
          helperText="Tags help buyers find your product when searching"
        />
        {/* SEO Title and Description */}
        <div className="mb-5">
          <label
            htmlFor="seoTitle"
            className="text-base md:text-xl font-medium"
          >
            SEO Title
          </label>
          <Input
            id="seoTitle"
            name="seoTitle"
            className="mt-2.5"
            placeholder="Custom titles for search engines (optional)"
            value={product.seoTitle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="seoDescription"
            className="text-base md:text-xl font-medium"
          >
            SEO Description{" "}
          </label>
          <TextArea
            id="seoDescription"
            name="seoDescription"
            className="mt-2.5"
            placeholder="Custom description for search engines (optional)"
            value={product.seoDescription}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Save & Publish */}
      <div className="card-form flex flex-col md:flex-row justify-between gap-4">
        <Button
          type="button"
          onClick={handleDiscard}
          disabled={isSubmitting}
          className="h-[52px] px-5 py-3.5 border border-secondary bg-background text-primary hover:bg-secondary"
        >
          <Trash2 className="size-6 mr-2" /> Discard
        </Button>
        <div className="flex flex-col-reverse md:flex-row gap-2.5">
          <Button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSubmitting}
            className="h-[52px] px-5 py-3.5 border border-border bg-background text-foreground hover:bg-foreground/10"
          >
            {isSubmitting ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={isSubmitting}
            className="h-[52px] px-5 py-3.5"
          >
            {isSubmitting ? "Publishing..." : "Save & Publish"}
            <ArrowRight className="size-6 inline ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductBuilder;
