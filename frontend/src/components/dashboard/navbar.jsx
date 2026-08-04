"use client";

import { Breadcrumb } from "./breadcrumb";
import { GlobalSearch } from "./global-search";
import { QuickActions } from "./quick-actions";
import { NotificationCenter } from "./notification-center";
import { UserMenu } from "./user-menu";

export function Navbar({ breadcrumb }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <Breadcrumb items={breadcrumb} />
      <div className="mx-auto flex-1" />
      <div className="flex items-center gap-3">
        <GlobalSearch />
        <QuickActions />
        <div className="mx-1 h-6 w-px bg-border" />
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
}
