import { MainSearch } from "@/components/MainSearch";
import SellerTabs from "@/components/SellerTabs";
import OrdersTable from "@/components/OrdersTable";

export default function Page() {
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
              <h1 className="text-3xl font-semibold text-foreground-2 section-break">
                Orders
              </h1>

              {/* Orders Table */}
              <OrdersTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
