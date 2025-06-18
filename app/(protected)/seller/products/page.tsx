import { MainSearch } from "@/components/MainSearch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SellerTabs from "@/components/SellerTabs";
import ProductsTable from "@/components/ProductsTable";

export default function SellerDashboardProducts() {
  return (
    <>
      <MainSearch />
      <div className="border-t-1 border-border bg-background xl:bg-gradient-to-r from-background to-background-2">
        <div className="container min-h-screen flex">
          {/* Sidebar */}
          <div className="hidden sm:block bg-background border-r-1 border-border pr-4">
            <div className="py-4">
              <SellerTabs activeTab={"Products"} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-background xl:bg-background-2 overflow-hidden">
            <div className="py-4 sm:pl-4">
              {/* Mobile Tabs */}
              <div className="flex sm:hidden mb-4 bg-primary/5 rounded-md">
                <SellerTabs activeTab={"Products"} />
              </div>

              {/* Page Header */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-semibold text-foreground-2">
                  Products
                </h1>
                <Button className="rounded-sm font-medium h-[52px] w-[174px]">
                  <Plus className="size-6" /> Add Product
                </Button>
              </div>

              {/* Products Table */}
              <ProductsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
