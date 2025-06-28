"use client";

import Link from "next/link";
import SelectLanguage from "@/components/SelectLanguage";
import { CircleHelp, Bell, PanelLeft, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState } from "react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="py-6 md:py-5 xl:py-[28.5px] border-b border-border">
      <div className="container flex justify-between items-center h-[40px]">
        {/* Mobile Sidebar Toggle Button */}
        <button onClick={toggleSidebar} className="block md:hidden">
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
          <div className="flex justify-end items-center gap-2">
            <SignedOut>
              <SignUpButton>
                <Button className="hidden md:block bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:scale-95 rounded-md cursor-pointer">
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-95 rounded-md cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-background w-[250px] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-primary font-bold text-2xl">
              Logo
            </Link>
            <button onClick={toggleSidebar}>
              <X className="size-5 text-foreground-2" />
            </button>
          </div>

          {/* Sidebar Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-4 py-2 text-foreground hover:bg-muted rounded-md"
                  onClick={toggleSidebar} // Close sidebar on link click
                >
                  <CircleHelp className="h-5 w-5" /> Help
                </Link>
              </li>
              <li>
                <SelectLanguage />
              </li>
              <li className="block md:hidden">
                {" "}
                {/* Sign up/in buttons for mobile*/}
                <SignedOut>
                  <div className="flex flex-col gap-2 mt-4">
                    <SignUpButton>
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-md">
                        Sign Up
                      </Button>
                    </SignUpButton>
                    <SignInButton>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80 rounded-md">
                        Sign In
                      </Button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar} // Close sidebar when clicking on overlay
        ></div>
      )}
    </div>
  );
};

export default Navbar;
