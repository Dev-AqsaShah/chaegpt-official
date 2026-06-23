import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export function TopBar() {
  return (
    <div className="hidden w-full border-b border-border/50 bg-foreground text-background sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs md:px-6">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">Opposite Mehran University, Jamshoro</span>
        </div>
        <a
          href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
          className="flex shrink-0 items-center gap-1.5 hover:text-primary transition-colors"
        >
          <Phone className="h-3.5 w-3.5 text-primary" />
          Order Now: {siteConfig.contact.phone}
        </a>
      </div>
    </div>
  );
}
