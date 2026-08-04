"use client";

import { useState } from "react";
import { Plus, Camera } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { AccountCard } from "@/components/workspace/account-card";
import { ConnectAccountModal } from "@/components/workspace/connect-account-modal";
import { connectedAccounts as initialAccounts } from "@/lib/mock/workspace-data";

export default function WorkspacePage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showConnect, setShowConnect] = useState(false);

  const handleReconnect = (id) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "connected", syncStatus: "Synced just now" } : a))
    );
  };

  const handleConnected = () => {
    setAccounts((prev) => [
      ...prev,
      {
        id: `a${prev.length + 1}`,
        handle: "@acme.newshop",
        name: "Acme New Shop",
        status: "connected",
        followers: "0",
        reach: "\u2014",
        dmsToday: 0,
        syncStatus: "Synced just now",
        healthy: true,
      },
    ]);
  };

  return (
    <DashboardShell breadcrumb={[{ label: "Workspace" }, { label: "Instagram accounts" }]}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Instagram accounts</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Connect every account you want FlowDM AI to monitor and automate.
          </p>
        </div>
        <Button onClick={() => setShowConnect(true)}>
          <Plus className="h-4 w-4" /> Connect account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState onConnect={() => setShowConnect(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} onReconnect={handleReconnect} />
          ))}

          <button
            onClick={() => setShowConnect(true)}
            className="flex min-h-[236px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-400"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-[13.5px] font-medium">Connect another account</span>
          </button>
        </div>
      )}

      {showConnect && (
        <ConnectAccountModal onClose={() => setShowConnect(false)} onConnected={handleConnected} />
      )}
    </DashboardShell>
  );
}

function EmptyState({ onConnect }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary-400">
        <Instagram className="h-6 w-6" />
      </div>
      <p className="mt-4 text-[15px] font-semibold text-foreground">No accounts connected yet</p>
      <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
        Connect your first Instagram account to start automating comments and DMs.
      </p>
      <Button className="mt-5" onClick={onConnect}>
        <Plus className="h-4 w-4" /> Connect account
      </Button>
    </div>
  );
}
