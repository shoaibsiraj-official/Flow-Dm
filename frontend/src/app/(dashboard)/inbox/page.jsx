"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ConversationList } from "@/components/inbox/conversation-list";
import { MessageThread } from "@/components/inbox/message-thread";
import { ContactPanel } from "@/components/inbox/contact-panel";
import { conversations } from "@/lib/mock/inbox-data";

export default function InboxPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const active = conversations.find((c) => c.id === activeId);

  return (
    <DashboardShell breadcrumb={[{ label: "Workspace" }, { label: "Inbox" }]}>
      <div className="-m-6 flex h-[calc(100vh-64px)] overflow-hidden rounded-none border-t border-border">
        <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        <MessageThread conversation={active} />
        <ContactPanel conversation={active} />
      </div>
    </DashboardShell>
  );
}
