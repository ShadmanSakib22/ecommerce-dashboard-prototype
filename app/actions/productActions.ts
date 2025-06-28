"use server";

import prisma from "@/lib/prisma";
import { ProductCategory, ProductStatus } from "@prisma/client";

// Structure for product submission data
interface ProductSubmissionData {
  title: string;
  description: string;
  images: string[];
  category: ProductCategory;
  specifications: Record<string, string>;
  price: number;
  salePrice: number | null;
  quantity: number;
  sku: string;
  enableNegotiation: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  status: ProductStatus;
  sellerId: string;
}

// Validation function
function validateProductData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields validation
  if (!data.title?.trim()) {
    errors.push("Product title is required");
  }
  if (!data.description?.trim()) {
    errors.push("Product description is required");
  }
  if (!data.category) {
    errors.push("Product category is required");
  }
  if (!data.price || data.price <= 0) {
    errors.push("Valid price is required");
  }
  if (data.quantity === undefined || data.quantity < 0) {
    errors.push("Valid quantity is required");
  }
  if (!data.sellerId?.trim()) {
    errors.push("Seller ID is required");
  }
  if (!data.images || data.images.length === 0) {
    errors.push("At least one product image is required");
  }

  // Additional validations
  if (data.salePrice && data.salePrice >= data.price) {
    errors.push("Sale price must be less than regular price");
  }
  if (data.title && data.title.length > 200) {
    errors.push("Product title must be less than 200 characters");
  }
  if (data.description && data.description.length > 2000) {
    errors.push("Product description must be less than 2000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a new product in the database.
 */
export async function createProduct(productData: ProductSubmissionData) {
  try {
    // Validate the data
    const validation = validateProductData(productData);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(", "),
        errors: validation.errors,
      };
    }

    // Check if SKU already exists (if provided)
    if (productData.sku) {
      const existingSku = await prisma.product.findFirst({
        where: { sku: productData.sku },
      });
      if (existingSku) {
        return {
          success: false,
          error: "SKU already exists. Please use a unique SKU.",
        };
      }
    }

    // Handle tags - create or connect existing ones
    const tagOperations = productData.tags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        title: productData.title.trim(),
        description: productData.description.trim(),
        images: productData.images,
        category: productData.category,
        specifications: productData.specifications,
        price: productData.price,
        salePrice: productData.salePrice,
        quantity: productData.quantity,
        sku: productData.sku || `PRD-${Date.now()}`,
        enableNegotiation: productData.enableNegotiation,
        seoTitle: productData.seoTitle || productData.title,
        seoDescription: productData.seoDescription || productData.description,
        status: productData.status,
        sellerId: productData.sellerId,
        tags: {
          connectOrCreate: tagOperations,
        },
      },
      include: {
        tags: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("Product created successfully:", newProduct.id);
    return {
      success: true,
      product: newProduct,
      message: `Product "${newProduct.title}" ${
        productData.status === "PUBLISHED" ? "published" : "saved as draft"
      } successfully!`,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return {
        success: false,
        error: "A product with this SKU already exists.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to create product. Please try again.",
    };
  }
}
