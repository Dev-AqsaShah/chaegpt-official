import { Hero } from "@/components/home/Hero";
import { SignatureDrinksStrip } from "@/components/home/SignatureDrinksStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { SocialFeedSection } from "@/components/social/SocialFeedSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const signatureItems = await prisma.menuItem.findMany({
    where: { categoryId: { not: undefined }, isAvailable: true, tags: { contains: "popular" } },
    take: 6,
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Hero />
      <SignatureDrinksStrip items={signatureItems} />
      <AboutSection />
      <SocialFeedSection />
      <ReviewsSection reviews={reviews} />
      <LocationSection />
    </>
  );
}
