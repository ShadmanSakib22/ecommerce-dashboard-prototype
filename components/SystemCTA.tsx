import React from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";

const SystemCTA = ({
  type,
  msg,
  link,
  linkText,
}: {
  type: string;
  msg: string;
  link: string;
  linkText: string;
}) => {
  if (type === "warning") {
    return (
      <div className="bg-[#FFF7ED] text-[#C77414] font-roboto rounded-lg shadow-sm border border-[#FCCF9C] p-2.5 sm:py-6 sm:pl-11 sm:pr-4 flex gap-2.5 flex-wrap items-center">
        <div className="flex gap-2.5 items-center ">
          <CircleAlert className="size-6" />
          <h2>{msg}</h2>
        </div>

        <Link
          href={link}
          className="text-sm bg-white font-medium px-4 py-2.5 rounded-md border border-[#FCCF9C] text-nowrap ml-auto"
        >
          {linkText}
        </Link>
      </div>
    );
  }
};

export default SystemCTA;
