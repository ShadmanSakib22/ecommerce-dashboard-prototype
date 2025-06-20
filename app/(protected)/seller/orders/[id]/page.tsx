import Link from "next/link";
import { MainSearch } from "@/components/MainSearch";
import { ArrowLeft } from "lucide-react";
import SellerTabs from "@/components/SellerTabs";
import ConstructionDialog from "@/components/ui/construction-dialog";

interface PageProps {
  params: { id: string };
}
const Page = async ({ params }: PageProps) => {
  const { id } = params;
  return (
    <>
      <MainSearch />
      <div className="border-t-1 border-border bg-background xl:bg-gradient-to-r from-background to-background-2">
        <div className="container min-h-screen flex">
          {/* Sidebar */}
          <div className="hidden md:block bg-background border-r-1 border-border pr-4">
            <div className="py-4">
              <SellerTabs activeTab={"Orders"} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-background xl:bg-background-2 overflow-hidden">
            <div className="py-4 md:pl-4">
              {/* Mobile Tabs */}
              <div className="flex md:hidden mb-4 bg-primary/5 rounded-md">
                <SellerTabs activeTab={"Orders"} />
              </div>

              {/* Page Header */}
              <div className="flex gap-2.5 text-foreground-2 mb-2.5 lg:mb-[26px]">
                <Link href="/seller/Orders">
                  <ArrowLeft className="size-6 mt-1" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Order Details
                  </h1>
                  <div className="text-foreground">#{id}</div>
                </div>
              </div>

              <ConstructionDialog />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
