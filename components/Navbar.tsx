import Link from "next/link";
import SelectLanguage from "@/components/SelectLanguage";
import { CircleHelp, Bell, PanelLeft } from "lucide-react";

const Navbar = () => {
  return (
    <div className="py-6 md:py-5 xl:py-[28.5px] border-b border-border">
      <div className="container flex justify-between items-center h-[40px]">
        <button className="block md:hidden">
          <PanelLeft className="size-4.5 text-foreground-2" />
        </button>

        <Link href="/" className="text-primary font-bold text-[32px]">
          Logo
        </Link>

        <div className="flex items-center gap-5">
          <span className="hidden md:block">
            <SelectLanguage />
          </span>
          <Link
            href={"/"}
            className="hidden md:flex items-center gap-2.5 px-4 py-2"
          >
            <CircleHelp className="h-6! w-6!" /> Help
          </Link>
          <button className="rounded-md border border-border text-foreground-2 p-2 cursor-pointer relative">
            <Bell className="h-6! w-6!" />
            {/* Request for notification */}
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          {/* Clerk Profile Button */}
          <div>Clerk-Buttons</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
