import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function DashboardShell({ children, breadcrumb }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
