export const chatThread = [
  { id: 1, from: "user", text: "Summarize my conversation with @studio.lena and tell me if she's a good lead." },
  {
    id: 2,
    from: "ai",
    text: "Lena asked about Canada shipping and the linen set. She's a repeat customer ($128 lifetime), engaged twice this week, and responded within minutes both times — that's a strong buying signal. I'd rate her lead score 82/100 and recommend offering the bundle discount before she goes quiet.",
  },
  { id: 3, from: "user", text: "Draft a reply offering her 10% off the bundle." },
  {
    id: 4,
    from: "ai",
    text: "Here's a draft in your brand voice:\n\n\u201cHi Lena! Since you're already part of the fam \uD83D\uDC9B, I can get you 10% off the linen bundle today — just say the word and I'll send a checkout link.\u201d",
  },
];

export const promptLibrary = [
  { id: "p1", title: "Summarize conversation", prompt: "Summarize this conversation and flag any objections." },
  { id: "p2", title: "Draft a follow-up", prompt: "Draft a friendly follow-up for a lead who went quiet." },
  { id: "p3", title: "Qualify this lead", prompt: "Score this lead 0-100 and explain why." },
  { id: "p4", title: "Handle price objection", prompt: "Write a reply that handles a price objection without discounting." },
  { id: "p5", title: "Translate to Spanish", prompt: "Translate the last customer message to Spanish." },
];

export const savedReplies = [
  { id: "s1", title: "Shipping to Canada", text: "Yes, we ship to Canada — usually 5–7 business days!" },
  { id: "s2", title: "Size chart", text: "Here's our size chart: [link]. Let me know if you need help picking a size!" },
  { id: "s3", title: "Business hours", text: "We're online Mon–Fri, 9am–6pm EST. I'll get back to you first thing otherwise!" },
];

export const knowledgeBase = [
  { id: "k1", title: "Shipping & returns policy", updated: "3 days ago" },
  { id: "k2", title: "Product sizing guide", updated: "1 week ago" },
  { id: "k3", title: "Coaching bundle FAQ", updated: "2 weeks ago" },
  { id: "k4", title: "Brand tone & voice guidelines", updated: "1 month ago" },
];
