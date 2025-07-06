export const sampleTemplates = [
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
    // tags: ["recruiter", "first-contact", "cold-outreach"],
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
    // tags: ["follow-up", "interview", "thank-you"],
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
    // tags: ["linkedin", "networking", "connection"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];
