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

// Color variables
const colors = {
  // Dark theme colors
  bg: "#0a0a0a",
  bgSecondary: "#1a1a1a",
  bgTertiary: "#2a2a2a",
  bgHover: "#333333",
  border: "#404040",
  borderHover: "#555555",
  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textMuted: "#888888",
  primary: "#3b82f6",
  primaryHover: "#2563eb",
  success: "#10b981",
  successHover: "#059669",
  warning: "#f59e0b",
  warningHover: "#d97706",
  danger: "#ef4444",
  dangerHover: "#dc2626",
  accent: "#8b5cf6",
  accentHover: "#7c3aed",
};

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

const CopyPitch: React.FC = () => {
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
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "320px",
            backgroundColor: colors.bgSecondary,
            borderRight: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 20px",
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                color: colors.primary,
                marginBottom: "16px",
              }}
            >
              CopyPitch
            </h1>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.textMuted,
                }}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  backgroundColor: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "6px",
                  color: colors.text,
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: colors.bgTertiary,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                color: colors.text,
                fontSize: "14px",
                marginBottom: "16px",
              }}
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
              style={{
                width: "100%",
                padding: "10px 16px",
                backgroundColor: colors.primary,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Plus size={16} />
              New Template
            </button>
          </div>

          {/* Templates List */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setSelectedVariation(template.variations[0]);
                  setIsEditing(false);
                }}
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: "pointer",
                  backgroundColor:
                    selectedTemplate?.id === template.id
                      ? colors.bgTertiary
                      : "transparent",
                  borderLeft:
                    selectedTemplate?.id === template.id
                      ? `3px solid ${colors.primary}`
                      : "3px solid transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "500",
                      color: colors.text,
                    }}
                  >
                    {template.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: colors.textMuted,
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: colors.textSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {template.content}
                </p>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "12px",
                        backgroundColor: colors.bgTertiary,
                        color: colors.textMuted,
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {selectedTemplate ? (
            <>
              {/* Header */}
              <div
                style={{
                  padding: "24px 32px",
                  borderBottom: `1px solid ${colors.border}`,
                  backgroundColor: colors.bgSecondary,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {selectedTemplate.title}
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: colors.textSecondary,
                          backgroundColor: colors.bgTertiary,
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {selectedTemplate.category}
                      </span>
                      <span
                        style={{ fontSize: "14px", color: colors.textMuted }}
                      >
                        {selectedTemplate.variations.length} variation
                        {selectedTemplate.variations.length !== 1 ? "s" : ""}
                      </span>
                      {hasVariables && (
                        <span
                          style={{
                            fontSize: "14px",
                            color: colors.accent,
                            backgroundColor: colors.bgTertiary,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Variable size={12} />
                          {currentVariables.length} variable
                          {currentVariables.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setShowVariableEditor(!showVariableEditor)}
                      disabled={!hasVariables}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: hasVariables
                          ? showVariableEditor
                            ? colors.accent
                            : colors.bgTertiary
                          : colors.border,
                        color: hasVariables
                          ? showVariableEditor
                            ? "white"
                            : colors.text
                          : colors.textMuted,
                        border: "none",
                        borderRadius: "6px",
                        cursor: hasVariables ? "pointer" : "not-allowed",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Variable size={14} />
                      Variables
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: isEditing
                          ? colors.success
                          : colors.bgTertiary,
                        color: isEditing ? "white" : colors.text,
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Edit2 size={14} />
                      {isEditing ? "Save" : "Edit"}
                    </button>
                    <button
                      onClick={addVariation}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: colors.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Plus size={14} />
                      Add Variation
                    </button>
                  </div>
                </div>
              </div>

              {/* Variables Editor */}
              {showVariableEditor && hasVariables && (
                <div
                  style={{
                    padding: "24px 32px",
                    backgroundColor: colors.bgSecondary,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "500",
                        color: colors.accent,
                      }}
                    >
                      Template Variables
                    </h3>
                    <button
                      onClick={clearAllVariables}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: colors.warning,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <RotateCcw size={12} />
                      Clear All
                    </button>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {currentVariables.map((varName) => (
                      <div key={varName}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: colors.text,
                            marginBottom: "4px",
                          }}
                        >
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
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: colors.bgTertiary,
                            border: `1px solid ${colors.border}`,
                            borderRadius: "4px",
                            color: colors.text,
                            fontSize: "14px",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variations Tabs */}
              <div
                style={{
                  padding: "0 32px",
                  backgroundColor: colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  {selectedTemplate.variations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariation(variation)}
                      style={{
                        padding: "12px 16px",
                        backgroundColor:
                          selectedVariation?.id === variation.id
                            ? colors.bg
                            : "transparent",
                        color:
                          selectedVariation?.id === variation.id
                            ? colors.text
                            : colors.textSecondary,
                        border: "none",
                        borderRadius: "6px 6px 0 0",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderBottom:
                          selectedVariation?.id === variation.id
                            ? `2px solid ${colors.primary}`
                            : "2px solid transparent",
                      }}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: "32px", overflow: "auto" }}>
                {selectedVariation && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        {selectedVariation.name}
                      </h3>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedVariation.content,
                            selectedVariation.id
                          )
                        }
                        style={{
                          padding: "8px 16px",
                          backgroundColor:
                            copiedId === selectedVariation.id
                              ? colors.success
                              : colors.primary,
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Copy size={14} />
                        {copiedId === selectedVariation.id ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: colors.textSecondary,
                        }}
                      >
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
                        style={{
                          width: "100%",
                          height: "300px",
                          padding: "16px",
                          backgroundColor: isEditing
                            ? colors.bgSecondary
                            : colors.bgTertiary,
                          border: `1px solid ${colors.border}`,
                          borderRadius: "8px",
                          color: colors.text,
                          fontSize: "16px",
                          lineHeight: "1.5",
                          resize: "vertical",
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: colors.textMuted,
              }}
            >
              <FileText size={48} style={{ marginBottom: "16px" }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Select a template to get started
              </h3>
              <p style={{ margin: 0, fontSize: "16px", textAlign: "center" }}>
                Choose a template from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyPitch;
