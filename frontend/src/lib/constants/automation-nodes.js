import {
  Zap,
  GitBranch,
  Sparkles,
  Clock,
  Tag,
  UserCheck,
  Webhook,
  Plug,
  Database,
  UserPlus,
  CreditCard,
  Flag,
} from "lucide-react";

export const NODE_TYPES = {
  trigger: { label: "Trigger", icon: Zap, color: "#6366F1", category: "flow", description: "Starts the automation" },
  condition: { label: "Condition", icon: GitBranch, color: "#F59E0B", category: "flow", description: "Branches based on logic" },
  ai: { label: "AI", icon: Sparkles, color: "#818CF8", category: "flow", description: "Generates an AI reply" },
  delay: { label: "Delay", icon: Clock, color: "#9CA3AF", category: "flow", description: "Waits before continuing" },
  tag: { label: "Tag", icon: Tag, color: "#22C55E", category: "action", description: "Adds a tag to the contact" },
  assign: { label: "Assign", icon: UserCheck, color: "#22C55E", category: "action", description: "Assigns to a teammate" },
  webhook: { label: "Webhook", icon: Webhook, color: "#EF4444", category: "integration", description: "Calls an external URL" },
  api: { label: "API", icon: Plug, color: "#EF4444", category: "integration", description: "Calls a third-party API" },
  crm: { label: "CRM", icon: Database, color: "#EF4444", category: "integration", description: "Syncs to your CRM" },
  lead: { label: "Lead Capture", icon: UserPlus, color: "#22C55E", category: "action", description: "Captures a qualified lead" },
  payment: { label: "Payment", icon: CreditCard, color: "#F59E0B", category: "integration", description: "Requests or logs a payment" },
  end: { label: "End Flow", icon: Flag, color: "#6B7280", category: "flow", description: "Ends the automation" },
};

export const PALETTE_SECTIONS = [
  { label: "Flow", types: ["trigger", "condition", "ai", "delay", "end"] },
  { label: "Actions", types: ["tag", "assign", "lead"] },
  { label: "Integrations", types: ["webhook", "api", "crm", "payment"] },
];

export const WORKFLOW_TEMPLATES = [
  {
    id: "comment-dm",
    name: "Comment \u2192 DM",
    description: "Auto-DM anyone who comments a keyword on your post",
    icon: "\uD83D\uDCAC",
    color: "#6366F1",
    nodes: 4,
  },
  {
    id: "keyword-reply",
    name: "Keyword Reply",
    description: "Reply instantly when a DM contains a trigger word",
    icon: "\uD83D\uDD11",
    color: "#818CF8",
    nodes: 3,
  },
  {
    id: "story-reply",
    name: "Story Reply",
    description: "Engage anyone who replies to your Stories",
    icon: "\uD83D\uDCF8",
    color: "#F59E0B",
    nodes: 3,
  },
  {
    id: "welcome-flow",
    name: "Welcome Flow",
    description: "Greet new followers and qualify them with AI",
    icon: "\uD83D\uDC4B",
    color: "#22C55E",
    nodes: 5,
  },
  {
    id: "abandoned-lead",
    name: "Abandoned Lead",
    description: "Re-engage leads who went quiet mid-conversation",
    icon: "\u23F1\uFE0F",
    color: "#EF4444",
    nodes: 4,
  },
  {
    id: "product-inquiry",
    name: "Product Inquiry",
    description: "Answer product questions and route to checkout",
    icon: "\uD83D\uDECD\uFE0F",
    color: "#6366F1",
    nodes: 5,
  },
  {
    id: "appointment-booking",
    name: "Appointment Booking",
    description: "Qualify and book a call straight from DMs",
    icon: "\uD83D\uDCC5",
    color: "#818CF8",
    nodes: 4,
  },
  {
    id: "coupon-delivery",
    name: "Coupon Delivery",
    description: "Send a personalized discount code automatically",
    icon: "\uD83C\uDFF7\uFE0F",
    color: "#F59E0B",
    nodes: 3,
  },
];

export const BLANK_FLOW_NODES = [
  { id: "n1", type: "trigger", x: 60, y: 160, title: "New DM received", config: "Any Instagram account" },
];

export const SAMPLE_FLOW = {
  nodes: [
    { id: "n1", type: "trigger", x: 40, y: 200, title: "Comment received", config: "Keyword: \u201cprice\u201d" },
    { id: "n2", type: "condition", x: 340, y: 200, title: "Already a customer?", config: "Check CRM tag" },
    { id: "n3", type: "ai", x: 640, y: 80, title: "AI qualifies lead", config: "Brand voice: Friendly" },
    { id: "n4", type: "tag", x: 640, y: 320, title: "Tag as VIP", config: "Adds \u201cVIP\u201d tag" },
    { id: "n5", type: "delay", x: 940, y: 80, title: "Wait 2 hours", config: "Business hours only" },
    { id: "n6", type: "end", x: 1240, y: 160, title: "End flow", config: "" },
  ],
  edges: [
    { from: "n1", to: "n2" },
    { from: "n2", to: "n3", label: "No" },
    { from: "n2", to: "n4", label: "Yes" },
    { from: "n3", to: "n5" },
    { from: "n4", to: "n6" },
    { from: "n5", to: "n6" },
  ],
};
