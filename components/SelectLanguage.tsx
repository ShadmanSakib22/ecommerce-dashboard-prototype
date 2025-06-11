"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const SelectLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("EN");

  return (
    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
      <SelectTrigger className="min-w-[120px] bg-background! text-foreground! shadow-none border-none flex items-center justify-between gap-2.5 px-4 py-2 cursor-pointer">
        <Globe className="h-6! w-6!" />
        <div className="text-base">{selectedLanguage}</div>
      </SelectTrigger>
      <SelectContent className="bg-background">
        <SelectItem value="EN">English (EN)</SelectItem>
        <SelectItem value="ES">Spanish (ES)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectLanguage;
