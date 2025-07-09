"use client";
import React, { useState } from "react";

import { X } from "lucide-react";

export default function CreateTemplate({ data, closeItself }: any) {
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("General");
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const categories = [
    "General",
    "Email",
    "Marketing",
    "Social Media",
    "Business",
    "Personal",
    "Documentation",
    "Other",
  ];

  const handleCreate = () => {
    if (templateName.trim()) {
      const finalCategory = isCreatingNewCategory
        ? newCategoryName.trim()
        : category;

      if (isCreatingNewCategory && !newCategoryName.trim()) {
        return; // Don't create if new category name is empty
      }

      data?.onCreateTemplate(templateName.trim(), finalCategory);
      closeItself();
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "create-new") {
      setIsCreatingNewCategory(true);
      setNewCategoryName("");
    } else {
      setIsCreatingNewCategory(false);
      setCategory(value);
    }
  };

  const handleCancelNewCategory = () => {
    setIsCreatingNewCategory(false);
    setNewCategoryName("");
    setCategory("General");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("dsgdfgdfg");
      handleCreate();
    } else if (e.key === "Escape") {
      closeItself();
    }
  };

  return (
    <div className="w-[400px] bg-bg border border-border rounded-xl shadow-2xl overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-text m-0">New Template</h2>
        <button
          onClick={closeItself}
          className="p-1 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <X size={20} className="text-text-secondary" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-4">
        {/* Template Name Field */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">
            Template Name
          </label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter template name"
            className="input-1"
            autoFocus
          />
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">
            Category
          </label>
          {isCreatingNewCategory ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter new category name"
                className="input-1"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCancelNewCategory}
                  className="px-3 py-1 text-xs font-medium text-text-secondary hover:text-text bg-transparent border border-border rounded hover:bg-bg-tertiary transition-colors"
                >
                  Cancel
                </button>
                <span className="text-xs text-text-secondary self-center">
                  or press Enter to create
                </span>
              </div>
            </div>
          ) : (
            <select
              value={category}
              onChange={handleCategoryChange}
              className="input-1"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-bg-secondary text-text"
                >
                  {cat}
                </option>
              ))}
              <option
                value="create-new"
                className="bg-bg-secondary text-accent font-medium"
              >
                + Create New Category
              </option>
            </select>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-border bg-bg-secondary/30">
        <button
          onClick={closeItself}
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text bg-transparent border border-border rounded-lg hover:bg-bg-tertiary transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={
            !templateName.trim() ||
            (isCreatingNewCategory && !newCategoryName.trim())
          }
          className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  );
}
