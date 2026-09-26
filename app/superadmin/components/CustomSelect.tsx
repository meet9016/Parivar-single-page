"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: CustomSelectOption[] | string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options array
  const formattedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = formattedOptions.find((opt) => String(opt.value) === String(value));

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md bg-white border transition-colors text-left text-xs font-medium text-slate-900 cursor-pointer ${
          isOpen
            ? "border-[#0B1340] ring-1 ring-[#0B1340]"
            : "border-slate-300 hover:border-slate-400"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : <span className="text-slate-500">{placeholder}</span>}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
            isOpen ? "transform rotate-180 text-[#0B1340]" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="no-scrollbar absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-300 rounded-md shadow-lg overflow-hidden py-1 max-h-56 overflow-y-auto"
        >
          {formattedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#0B1340] text-white font-semibold"
                    : "text-slate-800 hover:bg-slate-100 font-medium"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
