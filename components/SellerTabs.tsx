import React from "react";
import Link from "next/link";
import { House, Box, ShoppingCart, CreditCard, Settings } from "lucide-react";

const SellerTabs = ({ activeTab }: { activeTab: string }) => {
  const tabs = [
    { name: "Overview", href: "/app/seller/overview", icon: <House /> },
    { name: "Products", href: "/app/seller/products", icon: <Box /> },
    { name: "Orders", href: "/app/seller/orders", icon: <ShoppingCart /> },
    { name: "Customers", href: "/app/seller/customers", icon: <CreditCard /> },
    { name: "Settings", href: "/app/seller/settings", icon: <Settings /> },
  ];

  let isActive = false;

  return (
    <>
      {tabs.map((e) => {
        isActive = activeTab === e.name;
        const linkClasses = `
          rounded-md px-3 py-3 lg:py-4 flex gap-3 lg:w-[287px] font-medium transition-colors duration-200
          ${
            isActive
              ? "bg-secondary text-secondary-foreground hover:bg-secondary"
              : "text-foreground-2 lg:text-foreground hover:bg-card-shade"
          }
        `;

        return (
          <React.Fragment key={e.name}>
            <div className="hidden lg:block mb-1">
              <Link href={e.href} className={linkClasses.trim()}>
                {e.icon} {e.name}
              </Link>
            </div>
            <div className="block lg:hidden">
              <Link href={e.href} className={linkClasses.trim()}>
                {e.icon}
              </Link>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default SellerTabs;
