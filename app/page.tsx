import Link from "next/link";
import { BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background-2 min-h-screen flex flex-col items-center justify-center">
      <div className="container flex flex-wrap gap-4 justify-center">
        <Link href="/seller/overview">
          <div className="w-[300px] bg-background px-6 py-8 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-5">
            <span className="inline-block p-4 rounded-full bg-secondary text-secondary-foreground ">
              <BanknoteArrowUp className="size-7 " />
            </span>
            <p className="text-lg text-foreground-2">Go to Seller Dashboard </p>
            <p className="text-xs font-roboto uppercase">
              Track your Earnings!
            </p>
          </div>
        </Link>
        <Link href="/customer">
          <div className="w-[300px] bg-background px-6 py-8 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-5">
            <span className="inline-block p-4 rounded-full bg-secondary text-secondary-foreground ">
              <BanknoteArrowDown className="size-7 " />
            </span>
            <p className="text-lg text-foreground-2">
              Go to Customer Dashboard{" "}
            </p>
            <p className="text-xs font-roboto uppercase">
              Track your spending!
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
