"use client";

import { Camera, Users, Eye, MessageCircle, RefreshCw, AlertTriangle, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccountCard({ account, onReconnect }) {
  const needsReconnect = account.status === "needs_reconnect";

  return (
    <Card className={cn("p-5", needsReconnect && "border-danger/30")}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              needsReconnect ? "bg-danger/12 text-danger" : "bg-gradient-to-br from-primary to-primary-600 text-white"
            )}
          >
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">{account.handle}</p>
            <p className="text-[12px] text-muted-foreground">{account.name}</p>
          </div>
        </div>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        {needsReconnect ? (
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-danger/12 px-2.5 py-1 text-[11.5px] font-medium text-danger">
            <AlertTriangle className="h-3 w-3" /> Needs reconnect
          </span>
        ) : (
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11.5px] font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-white/[0.03] p-3">
        <Stat icon={Users} label="Followers" value={account.followers} />
        <Stat icon={Eye} label="Reach (30d)" value={account.reach} />
        <Stat icon={MessageCircle} label="DMs today" value={account.dmsToday} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className={cn("flex items-center gap-1.5 text-[11.5px]", needsReconnect ? "text-danger" : "text-muted-foreground")}>
          <RefreshCw className="h-3 w-3" /> {account.syncStatus}
        </p>
        {needsReconnect && (
          <Button size="sm" variant="danger" onClick={() => onReconnect(account.id)}>
            Reconnect
          </Button>
        )}
      </div>
    </Card>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-0.5 text-[14px] font-semibold text-foreground">{value}</p>
    </div>
  );
}
