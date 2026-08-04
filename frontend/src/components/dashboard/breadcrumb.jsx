import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px]">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.href && !last ? (
              <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "font-medium text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
          </span>
        );
      })}
    </nav>
  );
}
