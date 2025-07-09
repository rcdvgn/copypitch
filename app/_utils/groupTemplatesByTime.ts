// _utils/groupTemplatesByTime.ts
import { Timestamp } from "firebase/firestore";

interface Template {
  id: string;
  title: string;
  name: string;
  category: string;
  variables: Record<string, string>;
  variantIds: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

function normalizeTimestamp(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else if (
    typeof timestamp === "object" &&
    timestamp?.seconds &&
    timestamp?.nanoseconds
  ) {
    // Handle custom objects that mimic Firestore Timestamp structure
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else if (timestamp instanceof Date) {
    // Already a Date object
    return timestamp;
  } else if (typeof timestamp === "number") {
    // Handle numeric timestamps (e.g., Unix epoch time in milliseconds)
    return new Date(timestamp);
  } else {
    throw new Error("Unsupported timestamp format");
  }
}

export function groupTemplatesByTime(
  templates: Template[],
  criteria: keyof Template
): Record<string, Template[]> {
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const oneWeekInMs = 7 * oneDayInMs;
  const oneMonthInMs = 30 * oneDayInMs;

  const organizedTemplates: Record<string, Template[]> = {};

  templates.forEach((template) => {
    const rawTimestamp = template[criteria];
    if (rawTimestamp == null) {
      return;
    }

    let date: Date;
    try {
      date = normalizeTimestamp(rawTimestamp);
    } catch (error) {
      console.error(`Failed to normalize timestamp:`, rawTimestamp);
      return;
    }

    const timeDiff = now.getTime() - date.getTime();

    if (timeDiff < oneDayInMs) {
      organizedTemplates["today"] = organizedTemplates["today"] || [];
      organizedTemplates["today"].push(template);
    } else if (timeDiff < oneWeekInMs) {
      organizedTemplates["last 7 days"] =
        organizedTemplates["last 7 days"] || [];
      organizedTemplates["last 7 days"].push(template);
    } else if (timeDiff < oneMonthInMs) {
      organizedTemplates["last 30 days"] =
        organizedTemplates["last 30 days"] || [];
      organizedTemplates["last 30 days"].push(template);
    } else {
      const isSameYear = now.getFullYear() === date.getFullYear();
      const key = isSameYear
        ? date.toLocaleString("en-US", { month: "long" })
        : date.getFullYear().toString();

      organizedTemplates[key] = organizedTemplates[key] || [];
      organizedTemplates[key].push(template);
    }
  });

  return organizedTemplates;
}
