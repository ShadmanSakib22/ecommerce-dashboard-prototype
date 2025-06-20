import React from "react";
import { Input } from "@/components/ui/input";
import { ArrowRight, Asterisk, Plus, Trash2 } from "lucide-react";
import { TextArea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ProductBuilder = () => {
  return (
    <>
      <div className="card-form">
        <h3 className="mb-4 md:mb-[26px] font-medium text-xl md:text-2xl">
          General Information
        </h3>
        {/* Name */}
        <div className="mb-5">
          <label className="text-base md:text-xl font-medium relative">
            Product Title{" "}
            <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
          </label>
          <Input className="mt-2.5" placeholder="Enter Product Name" />
        </div>
        {/* Description */}
        <div className="mb-5">
          <label className="text-base md:text-xl font-medium relative">
            Description{" "}
            <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
          </label>
          <TextArea
            className="mt-2.5"
            placeholder="Enter Product Description"
          />
        </div>
        {/* Images */}
        <div>
          <label className="text-base md:text-xl font-medium relative">
            Product Images
            <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
          </label>
          <div className="mt-2.5 border-2 border-border border-dashed rounded-md p-4">
            Select Images
          </div>
        </div>
      </div>
      {/* Category */}
      <div className="card-form">
        <label className="text-base md:text-xl font-medium relative">
          Category{" "}
          <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
        </label>
        <Select>
          <SelectTrigger className="mt-2.5 w-full h-[52px]! bg-background! text-foreground-2! font-normal! text-sm! md:text-base! pl-2.5 pr-2 py-2 cursor-pointer shadow-none">
            <SelectValue placeholder="Categories" />
          </SelectTrigger>
          <SelectContent className="bg-background text-sm border-foreground">
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="Laptop & Accessories">
              Laptop & Accessories
            </SelectItem>
            <SelectItem value="Wearables">Wearables</SelectItem>
            <SelectItem value="Headphones & Audio">
              Headphones & Audio
            </SelectItem>
            <SelectItem value="Kitchen & Dining">Kitchen & Dining</SelectItem>
            <SelectItem value="Men's Clothing">Men's Clothing</SelectItem>
            <SelectItem value="Women's Clothing">Women's Clothing</SelectItem>
            <SelectItem value="Kid's Wear">Kid's Wear</SelectItem>
            <SelectItem value="Skincare">Skincare</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Specification - Conditional Render based on Category Selection */}
      <div className="card-form">
        <div className="flex justify-between mb-4 md:mb-[26px]">
          <h3 className=" font-medium text-xl md:text-2xl">Specifications</h3>
          <button className="text-[#315CEA] text-sm md:text-base max-w-[130px] sm:max-w-[240px] text-right">
            <Plus className="h-[24px] w-[24px] inline" /> Add another
            specification
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-base md:text-xl font-medium relative">
              Brand{" "}
              <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
            </label>
            <Input className="mt-2.5" placeholder="Enter Brand Name" />
          </div>
          {/* Specification Item - Dynamically Generated on Add */}
          <div>
            <label className="text-base md:text-xl font-medium relative">
              Specification Name{" "}
              <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
            </label>
            <Input className="mt-2.5" placeholder="Enter Specification Name" />
          </div>
        </div>
      </div>
      {/* Pricing & Inventory */}
      <div className="card-form">
        <h3 className="mb-4 md:mb-[26px] font-medium text-xl md:text-2xl">
          Pricing & Inventory
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-base md:text-xl font-medium relative">
              Price($)
              <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
            </label>
            <Input type="number" className="mt-2.5" placeholder="0.00" />
          </div>
          <div>
            <label className="text-base md:text-xl font-medium ">
              Sale Price($)
            </label>
            <Input type="number" className="mt-2.5" placeholder="0.00" />
          </div>
          <div>
            <label className="text-base md:text-xl font-medium relative">
              Quantity
              <Asterisk className="text-primary size-4 absolute top-0 right-[-14px]" />
            </label>
            <Input type="number" className="mt-2.5" placeholder="0" />
          </div>
          {/* SKU - Ensure unique */}
          <div>
            <label className="text-base md:text-xl font-medium relative">
              SKU
            </label>
            <Input className="mt-2.5" placeholder="e.g. MP-001" />
          </div>
        </div>
      </div>
      {/* SEO Information */}
      <div className="card-form">
        <h3 className="mb-4 md:mb-[26px] font-medium text-xl md:text-2xl">
          Additional Information
        </h3>
        <div className="mb-5">
          <label className="text-base md:text-xl font-medium">Tags</label>
          <Input
            className="my-2.5"
            placeholder="e.g. smartphone, android, 5G (separate with commas)"
          />
          <span className="text-foreground text-sm md:text-base">
            Tags help buyers find your product when searching
          </span>
        </div>
        <div className="mb-5">
          <label className="text-base md:text-xl font-medium">SEO Title</label>
          <Input
            className="mt-2.5"
            placeholder="Custom titles for search engines"
          />
        </div>
        <div>
          <label className="text-base md:text-xl font-medium">
            Description{" "}
          </label>
          <TextArea
            className="mt-2.5"
            placeholder="Custom description for search engines"
          />
        </div>
      </div>
      {/* Save & Publish */}
      <div className="card-form flex flex-col md:flex-row justify-between">
        <Button className="h-[52px] px-5 py-3.5 border border-secondary bg-background text-primary hover:bg-secondary">
          {" "}
          <Trash2 className="size-6" /> Discard
        </Button>
        <div className="flex flex-col-reverse md:flex-row gap-2.5">
          <Button className="h-[52px] px-5 py-3.5 border border-border bg-background text-foreground hover:bg-foreground/10">
            {" "}
            Save Draft
          </Button>
          <Button className="h-[52px] px-5 py-3.5">
            {" "}
            Save & Publish <ArrowRight className="size-6 inline" />{" "}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductBuilder;
