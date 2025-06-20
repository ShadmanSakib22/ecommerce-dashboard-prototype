import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SelectCategory = () => {
  return (
    <Select>
      <SelectTrigger className="min-w-[146px] bg-background! text-foreground pl-2.5 pr-2 py-2 cursor-pointer border-0 shadow-none">
        <SelectValue placeholder="Categories" />
      </SelectTrigger>
      <SelectContent className="bg-background text-sm border-foreground">
        <SelectItem value="Categories">Categories</SelectItem>
        <SelectItem value="Mobile">Mobile</SelectItem>
        <SelectItem value="Laptop&Accessories">Laptop & Accessories</SelectItem>
        <SelectItem value="Wearables">Wearables</SelectItem>
        <SelectItem value="Headphones&Audio">Headphones & Audio</SelectItem>
        <SelectItem value="Kitchen&Dining">Kitchen & Dining</SelectItem>
        <SelectItem value="MensClothing">Men's Clothing</SelectItem>
        <SelectItem value="WomensClothing">Women's Clothing</SelectItem>
        <SelectItem value="KidsWear">Kid's Wear</SelectItem>
        <SelectItem value="Skincare">Skincare</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const MainSearch = () => {
  return (
    <div className="container py-5 flex items-center gap-8">
      <div className="flex-1 border border-foreground rounded-lg h-[52px] flex items-center px-1">
        <span className="hidden md:flex">
          <SelectCategory />
          <div className="border-r-1 border-border h-[33px] mr-4"></div>
        </span>

        <div className="flex items-center gap-2.5 flex-1 ml-1">
          <Search className="size-6 hidden lg:block" />
          <input
            type="text"
            placeholder="Search by product, brand, or keyword"
            className="w-full text-foreground-2 placeholder:text-foreground border-0 outline-none"
          />
          <Button className="flex lg:hidden bg-primary text-primary-foreground rounded-md size-[42px] cursor-pointer">
            <Search className="size-6" />
          </Button>
        </div>
      </div>
      <Button className="px-[26.5px] h-[48px] w-[117px] rounded-sm text-lg font-medium hidden lg:block cursor-pointer">
        Search
      </Button>
    </div>
  );
};
