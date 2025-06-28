"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  label = "Tags",
  placeholder = "Type and press Enter to add tags",
  helperText = "Tags help buyers find your product when searching",
  className = "",
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagFromInput();
    }
  };

  const addTagFromInput = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
      setTagInput(""); // Clear input after adding
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={`${className}`}>
      <label htmlFor="tags" className="text-base md:text-xl font-medium">
        {label}
      </label>
      <Input
        id="tags"
        name="tagsInput"
        className="my-2.5"
        placeholder={placeholder}
        value={tagInput}
        onChange={handleTagInputChange}
        onKeyDown={handleTagInputKeyDown}
        onBlur={addTagFromInput} // Add tag when input loses focus
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Remove tag ${tag}`}
            >
              <XCircle className="size-4" />
            </button>
          </span>
        ))}
      </div>
      <span className="text-foreground text-xs md:text-sm mt-1 block italic">
        {helperText}
      </span>
    </div>
  );
};

export default TagInput;
