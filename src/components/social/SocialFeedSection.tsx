"use client";

import { useEffect } from "react";
import { siteConfig } from "@/data/site";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

// Uses official oEmbed embed widgets — no scraping, no ToS violations.
// Paste real post URLs into featuredPosts in src/data/site.ts to show live content.

export function SocialFeedSection() {
  const hasPosts = siteConfig.featuredPosts.length > 0;
  const hasInstagram = hasPosts && siteConfig.featuredPosts.some((p) => p.platform === "instagram");

  // Load and run Instagram's embed script only after hydration is done,
  // so it can't race React and swap blockquote -> iframe mid-hydration.
  useEffect(() => {
    if (!hasInstagram) return;

    const process = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      process();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", process);
    return () => script?.removeEventListener("load", process);
  }, [hasInstagram]);

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl font-black uppercase text-primary">
              Follow the Vibe
            </h2>
            <p className="mt-1 text-muted-foreground">
              @{siteConfig.social.instagram} on Instagram · @{siteConfig.social.tiktok} on TikTok
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={siteConfig.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border/50 px-4 py-2 text-sm hover:border-primary/50 transition-colors"
            >
              <InstagramIcon className="h-4 w-4 text-primary" /> Follow
            </a>
          </div>
        </div>

        {hasPosts ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.featuredPosts.map((post, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border/50">
                {post.platform === "instagram" ? (
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={post.url}
                    data-instgrm-version="14"
                  />
                ) : (
                  <blockquote
                    className="tiktok-embed"
                    data-video-id={post.url.split("/video/")[1]?.split("?")[0]}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder cards until real post URLs are added */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-dashed border-primary/30 bg-card flex flex-col items-center justify-center gap-3 text-center p-6"
              >
                <InstagramIcon className="h-10 w-10 text-primary/40" />
                <p className="text-sm text-muted-foreground">
                  Paste your Instagram post URL in{" "}
                  <code className="text-xs bg-muted px-1 rounded">src/data/site.ts</code>
                  {" "}to display real posts here.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
