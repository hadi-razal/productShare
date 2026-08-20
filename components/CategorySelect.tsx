"use client";

import { useState } from "react";
import {
  addCustomCategory,
  mergeProductCategories,
  resolveCategoryValue,
} from "@/lib/product-categories";

type CategorySelectProps = {
  value: string;
  customCategories: string[];
  onChange: (value: string) => void;
  onCustomCategoriesChange: (categories: string[]) => void | Promise<void>;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
};

const CategorySelect = ({
  value,
  customCategories,
  onChange,
  onCustomCategoriesChange,
  disabled,
  required,
  className,
  labelClassName,
}: CategorySelectProps) => {
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const options = mergeProductCategories(customCategories, value);

  const handleCreate = async () => {
    const nextValue = resolveCategoryValue(draft);
    if (!nextValue) return;

    setSaving(true);
    try {
      await onCustomCategoriesChange(addCustomCategory(customCategories, draft));
      onChange(nextValue);
      setDraft("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className={labelClassName}>
        Category {required ? <span className="text-red-500">*</span> : null}
      </label>
      <select
        name="category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || saving}
        className={className}
        required={required}
      >
        <option value="">Select a category</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleCreate();
            }
          }}
          disabled={disabled || saving}
          className={className}
          placeholder="Create a new category"
          maxLength={40}
        />
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={disabled || saving || !draft.trim()}
          className="flex-shrink-0 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default CategorySelect;
