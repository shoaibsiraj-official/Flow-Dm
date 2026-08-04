export const promptLibrary = [
  { id: "p1", title: "Qualify a new lead", prompt: "Ask 2 questions to understand budget and timeline before recommending a plan." },
  { id: "p2", title: "Handle a shipping question", prompt: "Explain shipping zones, cost, and delivery times in a friendly tone." },
  { id: "p3", title: "Recover an abandoned lead", prompt: "Re-engage a lead who went quiet for 48+ hours with a light, no-pressure nudge." },
  { id: "p4", title: "Upsell a bundle", prompt: "Suggest a relevant bundle upgrade based on what the customer already asked about." },
];

export const savedReplies = [
  { id: "s1", title: "Shipping to Canada", text: "Yes, we ship to Canada! Delivery usually takes 5–7 business days." },
  { id: "s2", title: "Discount code request", text: "Here's 15% off your first order: WELCOME15 🎉" },
  { id: "s3", title: "Business hours", text: "We're online Mon–Fri, 9am–6pm EST. I'm always here for quick questions though!" },
];

export const knowledgeBase = [
  { id: "k1", title: "Return & exchange policy", updated: "2 days ago" },
  { id: "k2", title: "Sizing guide", updated: "1 week ago" },
  { id: "k3", title: "Coaching bundle FAQ", updated: "3 weeks ago" },
  { id: "k4", title: "Brand tone & voice guide", updated: "1 month ago" },
];

export const sampleChat = [
  { id: 1, role: "user", text: "Summarize my last conversation with @studio.lena and suggest a next step." },
  {
    id: 2,
    role: "assistant",
    text:
      "Lena asked about Canada shipping and the linen set. I confirmed 5–7 day delivery. She hasn't replied in 40 minutes — I'd suggest a gentle follow-up offering a size chart, since she seemed close to purchasing.",
  },
  { id: 3, role: "user", text: "Draft that follow-up in our brand voice." },
  {
    id: 4,
    role: "assistant",
    text:
      "\"Hey Lena! Just wanted to check if you had any other questions on the linen set — happy to send over a size chart if that'd help 😊\"",
  },
];
