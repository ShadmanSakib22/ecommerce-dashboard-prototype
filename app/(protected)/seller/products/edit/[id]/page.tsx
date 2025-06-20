import Link from "next/link";
import { MainSearch } from "@/components/MainSearch";
import { ArrowLeft } from "lucide-react";
import SellerTabs from "@/components/SellerTabs";
import ProductBuilder from "@/components/ProductBuilder";

export default function Page({ params }: { params: { id: string } }) {
  // ToDo: Fetch product details using params.id and populate the form
  return (
    <>
      <MainSearch />
      <div className="border-t-1 border-border bg-background xl:bg-gradient-to-r from-background to-background-2">
        <div className="container min-h-screen flex">
          {/* Sidebar */}
          <div className="hidden md:block bg-background border-r-1 border-border pr-4">
            <div className="py-4">
              <SellerTabs activeTab={"Products"} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-background xl:bg-background-2 overflow-hidden">
            <div className="py-4 md:pl-4">
              {/* Mobile Tabs */}
              <div className="flex md:hidden mb-4 bg-primary/5 rounded-md">
                <SellerTabs activeTab={"Products"} />
              </div>

              {/* Page Header */}
              <div className="flex gap-2.5 text-foreground-2 mb-2.5 lg:mb-[26px]">
                <Link href="/seller/products">
                  <ArrowLeft className="size-6 mt-1" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Edit Product Details
                  </h1>
                  <p className="text-base md:text-xl mt-2.5 text-foreground">
                    Edit the details of your product
                  </p>
                </div>
              </div>

              {/* Product Form */}
              <ProductBuilder />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
