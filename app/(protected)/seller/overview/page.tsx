import { MainSearch } from "@/components/MainSearch";
import SellerTabs from "@/components/SellerTabs";
import SystemCTA from "@/components/SystemCTA";

export default function SellerDashboardOverview() {
  return (
    <>
      <MainSearch />
      <div className="border-t-1 border-border bg-background xl:bg-gradient-to-r from-background to-background-2">
        <div className="container min-h-screen flex">
          {/* Sidebar */}
          <div className="hidden sm:block bg-background border-r-1 border-border pr-4">
            <div className="py-4">
              <SellerTabs activeTab={"Overview"} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-background xl:bg-background-2 overflow-hidden">
            <div className="py-4 sm:pl-4">
              {/* Mobile Tabs */}
              <div className="flex sm:hidden mb-4 bg-primary/5 rounded-md">
                <SellerTabs activeTab={"Overview"} />
              </div>

              {/* Page Header */}
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground-2 mb-2">
                Welcome back, John Doe!
              </h1>
              <p className="text-sm md:text-lg text-foreground-2 mb-5">
                You've made <b>$2,450</b> today.
              </p>

              {/* Sales Cards */}
              <div className="flex flex-wrap gap-4 md:gap-5 section-break">
                <div className="card-sales-info flex-grow">
                  <h2 className="text-sm font-medium text-foreground mb-1 font-roboto">
                    Sales Today
                  </h2>
                  <p className="text-2xl font-bold text-foreground-2 mb-1 font-roboto">
                    $2,450
                  </p>
                  {/* ToDo: If positive, text-success, else text-destructive */}
                  <p className="text-sm font-medium text-success font-roboto">
                    +15% from last period
                  </p>
                </div>
                <div className="card-sales-info flex-grow">
                  <h2 className="text-sm font-medium text-foreground mb-1 font-roboto">
                    Sales This Week
                  </h2>
                  <p className="text-2xl font-bold text-foreground-2 mb-1 font-roboto">
                    $10,230
                  </p>
                  <p className="text-sm font-medium text-success font-roboto">
                    +8% from last period
                  </p>
                </div>
                <div className="card-sales-info flex-grow">
                  <h2 className="text-sm font-medium text-foreground mb-1 font-roboto">
                    Sales This Month
                  </h2>
                  <p className="text-2xl font-bold text-foreground-2 mb-1 font-roboto">
                    $45,670
                  </p>
                  <p className="text-sm font-medium text-success font-roboto">
                    +12% from last period
                  </p>
                </div>
              </div>

              {/* Orders Status */}
              <div className="bg-background rounded-lg shadow-sm border border-input px-3 py-5 section-break">
                <h2 className="text-lg font-semibold font-roboto text-foreground-2 mb-2.5">
                  Orders Status
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="card-sale-orders-info">
                    <span className="w-3 h-3 inline-block rounded-full bg-warning mr-3"></span>
                    <span className="text-base text-foreground-2">Pending</span>
                    <div className="text-xl font-semibold text-foreground-2 ml-6">
                      12
                    </div>
                  </div>
                  <div className="card-sale-orders-info">
                    <span className="w-3 h-3 inline-block rounded-full bg-accent mr-3"></span>
                    <span className="text-base text-foreground-2">Shipped</span>
                    <div className="text-xl font-semibold text-foreground-2 ml-6">
                      24
                    </div>
                  </div>
                  <div className="card-sale-orders-info">
                    <span className="w-3 h-3 inline-block rounded-full bg-success mr-3"></span>
                    <span className="text-base text-foreground-2">
                      Delivered
                    </span>
                    <div className="text-xl font-semibold text-foreground-2 ml-6">
                      156
                    </div>
                  </div>
                  <div className="card-sale-orders-info">
                    <span className="w-3 h-3 inline-block rounded-full bg-destructive mr-3"></span>
                    <span className="text-base text-foreground-2">
                      Cancelled
                    </span>
                    <div className="text-xl font-semibold text-foreground-2 ml-6">
                      3
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="bg-background rounded-lg shadow-sm border border-[#264D82] px-6 pt-6 pb-5 section-break">
                <h2 className="text-xl font-semibold text-foreground-2 mb-2.5">
                  Revenue Trend (30 days)
                </h2>
                <div className="bg-[#F3F4F6] rounded-md min-h-[204px] flex items-center justify-center text-foreground">
                  Revenue Chart
                </div>
              </div>

              {/* System Warning Messages - ToDo: Conditional Low Stock Notification */}
              <div className="section-break">
                <SystemCTA
                  type="warning"
                  msg="You have 2 products running low. Restock now."
                  link="/seller/products"
                  linkText="View Products"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
