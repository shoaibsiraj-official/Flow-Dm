import {
  LayoutDashboard,
  Building2,
  Workflow,
  Sparkles,
  Inbox,
  Users,
  BarChart3,
  Megaphone,
  Contact,
  Plug,
  CreditCard,
  Settings,
  ScrollText,
  Code2,
  LifeBuoy,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Instagram accounts", href: "/workspace", icon: Building2, badge: "3" },
    ],
  },
  {
    label: "Automate",
    items: [
      { label: "Automation builder", href: "/automation", icon: Workflow },
      { label: "AI assistant", href: "/ai-assistant", icon: Sparkles },
      { label: "Inbox", href: "/inbox", icon: Inbox, badge: "12" },
    ],
  },
  {
    label: "Grow",
    items: [
      { label: "CRM", href: "/crm", icon: Users },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Campaigns", href: "/campaigns", icon: Megaphone },
      { label: "Contacts", href: "/contacts", icon: Contact },
    ],
  },
  {
    label: "Configure",
    items: [
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Billing", href: "/billing", icon: CreditCard },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Logs", href: "/logs", icon: ScrollText },
      { label: "Developer", href: "/developer", icon: Code2 },
      { label: "Support", href: "/support", icon: LifeBuoy },
    ],
  },
];
