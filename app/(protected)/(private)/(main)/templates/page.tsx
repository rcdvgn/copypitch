"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  Search,
  Tag,
  FileText,
  Settings,
  RotateCcw,
  Variable,
} from "lucide-react";

// Interfaces mantidas
interface Template {
  id: string;
  title: string;
  category: string;
  content: string;
  variations: Variation[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Variation {
  id: string;
  name: string;
  content: string;
  notes?: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [showVariableEditor, setShowVariableEditor] = useState(false);

  // Sample data
  useEffect(() => {
    const sampleTemplates: Template[] = [
      {
        id: "1",
        title: "Initial Outreach to Recruiter",
        category: "outreach",
        content:
          "Hi {{recruiterName}}, I hope this message finds you well. I came across the {{position}} role at {{company}} and I'm very interested in learning more about this opportunity. With my {{yearsExperience}} years of experience in {{field}}, I believe I would be a strong fit for this position.",
        variations: [
          {
            id: "1-1",
            name: "Formal",
            content:
              "Dear {{recruiterName}}, I hope this message finds you well. I noticed the {{position}} position at {{company}} and would be delighted to discuss how my {{yearsExperience}} years of experience in {{field}} aligns with your requirements.",
          },
          {
            id: "1-2",
            name: "Casual",
            content:
              "Hey {{recruiterName}}! I saw the {{position}} role at {{company}} and thought it looked like a great fit. With my background in {{field}}, I'd love to chat about it!",
          },
        ],
        tags: ["recruiter", "first-contact", "cold-outreach"],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        title: "Follow-up After Interview",
        category: "follow-up",
        content:
          "Thank you for taking the time to speak with me about the {{position}} role. I enjoyed our conversation about {{topicDiscussed}} and I'm even more excited about the opportunity to join {{company}}. I wanted to follow up on {{nextSteps}}.",
        variations: [
          {
            id: "2-1",
            name: "Standard",
            content:
              "Thank you for taking the time to speak with me about the {{position}} role. I enjoyed our conversation about {{topicDiscussed}} and I'm even more excited about the opportunity to join {{company}}.",
          },
        ],
        tags: ["follow-up", "interview", "thank-you"],
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "3",
        title: "LinkedIn Connection Request",
        category: "networking",
        content:
          "Hi {{name}}, I noticed we both work in {{industry}}. I'd love to connect and learn more about your experience at {{company}}.",
        variations: [
          {
            id: "3-1",
            name: "Professional",
            content:
              "Hi {{name}}, I noticed we both work in {{industry}}. I'd love to connect and learn more about your experience at {{company}}.",
          },
        ],
        tags: ["linkedin", "networking", "connection"],
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
      },
    ];
    setTemplates(sampleTemplates);
  }, []);

  const categories = [
    "all",
    "outreach",
    "follow-up",
    "networking",
    "application",
    "negotiation",
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract variables from template content
  const extractVariables = (content: string): string[] => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1].trim())) {
        variables.push(match[1].trim());
      }
    }

    return variables;
  };

  // Replace variables in content
  const replaceVariables = (
    content: string,
    variables: Record<string, string>
  ): string => {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
      result = result.replace(regex, value);
    });
    return result;
  };

  // Get all variables from current variation
  const getCurrentVariables = (): string[] => {
    if (!selectedVariation) return [];
    return extractVariables(selectedVariation.content);
  };

  // Initialize variables when variation changes
  useEffect(() => {
    if (selectedVariation) {
      const currentVars = getCurrentVariables();
      const newVariables: Record<string, string> = {};

      currentVars.forEach((varName) => {
        newVariables[varName] = variables[varName] || "";
      });

      setVariables(newVariables);
    }
  }, [selectedVariation]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      const processedText = replaceVariables(text, variables);
      await navigator.clipboard.writeText(processedText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const addNewTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      title: "New Template",
      category: "outreach",
      content: "Enter your template content here with {{variables}}...",
      variations: [
        {
          id: Date.now().toString() + "-1",
          name: "Default",
          content: "Enter your template content here with {{variables}}...",
        },
      ],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setSelectedVariation(newTemplate.variations[0]);
    setIsEditing(true);
    setShowNewTemplateForm(false);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      setSelectedVariation(null);
    }
  };

  const addVariation = () => {
    if (!selectedTemplate) return;

    const newVariation: Variation = {
      id: Date.now().toString(),
      name: `Variation ${selectedTemplate.variations.length + 1}`,
      content: selectedTemplate.content,
    };

    const updatedTemplate = {
      ...selectedTemplate,
      variations: [...selectedTemplate.variations, newVariation],
      updatedAt: new Date(),
    };

    setTemplates(
      templates.map((t) => (t.id === selectedTemplate.id ? updatedTemplate : t))
    );
    setSelectedTemplate(updatedTemplate);
    setSelectedVariation(newVariation);
    setIsEditing(true);
  };

  const clearAllVariables = () => {
    const clearedVariables: Record<string, string> = {};
    getCurrentVariables().forEach((varName) => {
      clearedVariables[varName] = "";
    });
    setVariables(clearedVariables);
  };

  const currentVariables = getCurrentVariables();
  const hasVariables = currentVariables.length > 0;

  return (
    <div className="text-text min-h-screen font-sans">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-[320px] bg-bg-secondary border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary mb-4">CopyPitch</h1>
            {/* Search */}
            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-bg-tertiary border border-border rounded-md text-text text-sm box-border"
              />
            </div>
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text text-sm mb-4"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {/* New Template Button */}
            <button
              onClick={addNewTemplate}
              className="w-full py-2.5 px-4 bg-primary text-white rounded-md font-medium flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              New Template
            </button>
          </div>
          {/* Templates List */}
          <div className="flex-1 overflow-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setSelectedVariation(template.variations[0]);
                  setIsEditing(false);
                }}
                className={`px-5 py-4 border-b border-border cursor-pointer ${
                  selectedTemplate?.id === template.id
                    ? "bg-bg-tertiary border-l-4 border-primary"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="m-0 text-base font-medium text-text">
                    {template.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    className="bg-none border-none text-text-muted cursor-pointer p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="m-0 text-sm text-text-secondary overflow-hidden text-ellipsis line-clamp-2">
                  {template.content}
                </p>
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-bg-tertiary text-text-muted px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedTemplate ? (
            <>
              {/* Header */}
              <div className="px-8 py-6 border-b border-border bg-bg-secondary">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="m-0 text-xl font-semibold mb-2">
                      {selectedTemplate.title}
                    </h2>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-text-secondary bg-bg-tertiary px-2 py-1 rounded">
                        {selectedTemplate.category}
                      </span>
                      <span className="text-sm text-text-muted">
                        {selectedTemplate.variations.length} variation
                        {selectedTemplate.variations.length !== 1 ? "s" : ""}
                      </span>
                      {hasVariables && (
                        <span className="text-sm text-accent bg-bg-tertiary px-2 py-1 rounded flex items-center gap-1">
                          <Variable size={12} />
                          {currentVariables.length} variable
                          {currentVariables.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowVariableEditor(!showVariableEditor)}
                      disabled={!hasVariables}
                      className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                        hasVariables
                          ? showVariableEditor
                            ? "bg-accent text-white"
                            : "bg-bg-tertiary text-text"
                          : "bg-border text-text-muted cursor-not-allowed"
                      }`}
                    >
                      <Variable size={14} />
                      Variables
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                        isEditing
                          ? "bg-success text-white"
                          : "bg-bg-tertiary text-text"
                      }`}
                    >
                      <Edit2 size={14} />
                      {isEditing ? "Save" : "Edit"}
                    </button>
                    <button
                      onClick={addVariation}
                      className="px-4 py-2 rounded-md text-sm flex items-center gap-1 bg-primary text-white"
                    >
                      <Plus size={14} />
                      Add Variation
                    </button>
                  </div>
                </div>
              </div>
              {/* Variables Editor */}
              {showVariableEditor && hasVariables && (
                <div className="px-8 py-6 bg-bg-secondary border-b border-border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-base font-medium text-accent">
                      Template Variables
                    </h3>
                    <button
                      onClick={clearAllVariables}
                      className="px-3 py-1.5 rounded bg-warning text-white text-xs flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      Clear All
                    </button>
                  </div>
                  <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    {currentVariables.map((varName) => (
                      <div key={varName}>
                        <label className="block text-sm font-medium text-text mb-1">
                          {varName}
                        </label>
                        <input
                          type="text"
                          value={variables[varName] || ""}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              [varName]: e.target.value,
                            })
                          }
                          placeholder={`Enter ${varName}`}
                          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-text text-sm box-border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Variations Tabs */}
              <div className="px-8 bg-bg-secondary border-b border-border">
                <div className="flex gap-1">
                  {selectedTemplate.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariation(variation)}
                      className={`px-4 py-3 rounded-t-md text-sm font-medium border-b-2 ${
                        selectedVariation?.id === variation.id
                          ? "bg-bg text-text border-primary"
                          : "bg-transparent text-text-secondary border-transparent"
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 px-8 py-8 overflow-auto">
                {selectedVariation && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="m-0 text-lg font-medium">
                        {selectedVariation.name}
                      </h3>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedVariation.content,
                            selectedVariation.id
                          )
                        }
                        className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                          copiedId === selectedVariation.id
                            ? "bg-success text-white"
                            : "bg-primary text-white"
                        }`}
                      >
                        <Copy size={14} />
                        {copiedId === selectedVariation.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-text-secondary">
                        {isEditing ? "Template Editor" : "Preview"}
                      </h4>
                      <textarea
                        value={
                          isEditing
                            ? selectedVariation.content
                            : replaceVariables(
                                selectedVariation.content,
                                variables
                              )
                        }
                        onChange={(e) => {
                          if (isEditing) {
                            const updatedVariation = {
                              ...selectedVariation,
                              content: e.target.value,
                            };
                            const updatedTemplate = {
                              ...selectedTemplate,
                              variations: selectedTemplate.variations.map((v) =>
                                v.id === selectedVariation.id
                                  ? updatedVariation
                                  : v
                              ),
                              updatedAt: new Date(),
                            };
                            setTemplates(
                              templates.map((t) =>
                                t.id === selectedTemplate.id
                                  ? updatedTemplate
                                  : t
                              )
                            );
                            setSelectedTemplate(updatedTemplate);
                            setSelectedVariation(updatedVariation);
                          }
                        }}
                        readOnly={!isEditing}
                        className={`w-full h-[300px] p-4 border border-border rounded-lg text-base leading-relaxed resize-vertical font-sans ${
                          isEditing ? "bg-bg-secondary" : "bg-bg-tertiary"
                        } text-text`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
              <FileText size={48} className="mb-4" />
              <h3 className="m-0 text-xl font-medium mb-2">
                Select a template to get started
              </h3>
              <p className="m-0 text-lg text-center">
                Choose a template from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;
