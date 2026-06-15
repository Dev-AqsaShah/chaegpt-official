import { MapPin, Clock, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export function LocationSection() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-display text-4xl font-black uppercase text-primary">
            Come Visit Us
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <MapPin className="h-5 w-5" /> Location
              </div>
              <p className="text-sm text-muted-foreground">{siteConfig.contact.address}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Clock className="h-5 w-5" /> Hours
              </div>
              {siteConfig.hours.map((h) => (
                <p key={h.day} className="text-sm text-muted-foreground">
                  {h.day}: <span className="font-medium text-foreground">{h.time}</span>
                </p>
              ))}
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Phone className="h-5 w-5" /> Contact
              </div>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          {/* Map embed */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border/50 min-h-[300px]">
            <iframe
              title="Chae GPT Location"
              src={siteConfig.contact.mapEmbedUrl}
              className="w-full h-full min-h-[300px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
