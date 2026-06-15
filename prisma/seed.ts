import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { resolve } from "path";

const dbPath = resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Chae GPT database...");

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@chaegpt.pk" },
    update: {},
    create: { name: "Chae GPT Admin", email: "admin@chaegpt.pk", hashedPassword: adminPass, role: "ADMIN" },
  });

  const userPass = await bcrypt.hash("customer123", 10);
  const customer1 = await prisma.user.upsert({
    where: { email: "ali@example.com" },
    update: {},
    create: { name: "Ali Hassan", email: "ali@example.com", hashedPassword: userPass, role: "CUSTOMER" },
  });
  const customer2 = await prisma.user.upsert({
    where: { email: "sara@example.com" },
    update: {},
    create: { name: "Sara Khan", email: "sara@example.com", hashedPassword: userPass, role: "CUSTOMER" },
  });

  console.log("✅ Users created");

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = [
    { name: "Signature Chai", slug: "signature-chai", emoji: "☕", sortOrder: 1 },
    { name: "Hot & Cold Coffee", slug: "coffee", emoji: "☕", sortOrder: 2 },
    { name: "Shakes & Mojitos", slug: "shakes-mojitos", emoji: "🥤", sortOrder: 3 },
    { name: "Parathas & Breakfast", slug: "parathas-breakfast", emoji: "🫓", sortOrder: 4 },
    { name: "Burgers & Fast Food", slug: "burgers-fast-food", emoji: "🍔", sortOrder: 5 },
    { name: "Sandwiches & Wraps", slug: "sandwiches-wraps", emoji: "🥙", sortOrder: 6 },
    { name: "Fries & Snacks", slug: "fries-snacks", emoji: "🍟", sortOrder: 7 },
    { name: "Desi Specials", slug: "desi-specials", emoji: "🍛", sortOrder: 8 },
    { name: "Desserts", slug: "desserts", emoji: "🍰", sortOrder: 9 },
  ] as const;

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }
  console.log("✅ Categories created");

  // ── Menu Items ─────────────────────────────────────────────────────────────
  const items = [
    // Signature Chai
    {
      name: "Doodh Patti",
      slug: "doodh-patti",
      description: "Classic Pakistani milk tea brewed strong with cardamom — the OG chai.",
      price: 80,
      image: "/images/doodh-patti.svg",
      categorySlug: "signature-chai",
      tags: "popular",
      options: [
        { groupName: "Size", label: "Cup (220ml)", priceDelta: 0 },
        { groupName: "Size", label: "Glass (320ml)", priceDelta: 20 },
        { groupName: "Sugar Level", label: "No Sugar", priceDelta: 0 },
        { groupName: "Sugar Level", label: "Less Sugar", priceDelta: 0 },
        { groupName: "Sugar Level", label: "Normal", priceDelta: 0 },
        { groupName: "Sugar Level", label: "Extra Sweet", priceDelta: 0 },
      ],
    },
    {
      name: "Kashmiri Pink Chai",
      slug: "kashmiri-pink-chai",
      description: "Velvety blush-pink chai with crushed pistachios, almonds, and fragrant cardamom.",
      price: 180,
      image: "/images/kashmiri-pink-chai.svg",
      categorySlug: "signature-chai",
      tags: "popular,veg",
    },
    {
      name: "Elaichi Chai",
      slug: "elaichi-chai",
      description: "Golden tea steeped with whole green cardamom pods — aromatic and soothing.",
      price: 90,
      image: "/images/elaichi-chai.svg",
      categorySlug: "signature-chai",
      tags: "veg",
    },
    {
      name: "Noon Chai (Salted Tea)",
      slug: "noon-chai",
      description: "Authentic Kashmiri salted pink tea — a unique, rich experience.",
      price: 160,
      image: "/images/noon-chai.svg",
      categorySlug: "signature-chai",
      tags: "veg,new",
    },
    {
      name: "Masala Chai",
      slug: "masala-chai",
      description: "Spiced tea blend with ginger, cloves, cinnamon, and black pepper.",
      price: 100,
      image: "/images/masala-chai.svg",
      categorySlug: "signature-chai",
      spiceLevel: 1,
      tags: "popular,veg",
    },
    // Coffee
    {
      name: "Cold Coffee",
      slug: "cold-coffee",
      description: "Chilled blended coffee with milk and ice — a student's best friend.",
      price: 200,
      image: "/images/cold-coffee.svg",
      categorySlug: "coffee",
      tags: "popular",
    },
    {
      name: "Hot Cappuccino",
      slug: "hot-cappuccino",
      description: "Espresso with steamed milk foam — bold and creamy.",
      price: 250,
      image: "/images/hot-cappuccino.svg",
      categorySlug: "coffee",
      tags: "veg",
    },
    {
      name: "Dalgona Coffee",
      slug: "dalgona-coffee",
      description: "Whipped coffee cloud over chilled milk — Instagram-worthy.",
      price: 280,
      image: "/images/dalgona-coffee.svg",
      categorySlug: "coffee",
      tags: "popular,veg",
    },
    // Shakes & Mojitos
    {
      name: "Oreo Shake",
      slug: "oreo-shake",
      description: "Thick creamy shake loaded with crushed Oreos and vanilla ice cream.",
      price: 280,
      image: "/images/oreo-shake.svg",
      categorySlug: "shakes-mojitos",
      tags: "popular",
    },
    {
      name: "Strawberry Mojito",
      slug: "strawberry-mojito",
      description: "Fresh strawberry, mint, lime, and sparkling water — refreshing and tangy.",
      price: 250,
      image: "/images/strawberry-mojito.svg",
      categorySlug: "shakes-mojitos",
      tags: "veg,popular",
    },
    {
      name: "Mango Lassi Shake",
      slug: "mango-lassi-shake",
      description: "Smooth mango blended with creamy yogurt — a Pakistani summer classic.",
      price: 260,
      image: "/images/mango-lassi-shake.svg",
      categorySlug: "shakes-mojitos",
      tags: "veg",
    },
    {
      name: "Blue Berry Mojito",
      slug: "blueberry-mojito",
      description: "Blueberry crush with mint, lime, and chilled soda.",
      price: 260,
      image: "/images/blueberry-mojito.svg",
      categorySlug: "shakes-mojitos",
      tags: "veg,new",
    },
    // Parathas & Breakfast
    {
      name: "Aloo Paratha",
      slug: "aloo-paratha",
      description: "Crispy golden paratha stuffed with spiced mashed potato — served with yogurt & chutney.",
      price: 180,
      image: "/images/aloo-paratha.svg",
      categorySlug: "parathas-breakfast",
      spiceLevel: 1,
      tags: "popular,veg",
    },
    {
      name: "Keema Paratha",
      slug: "keema-paratha",
      description: "Flaky paratha stuffed with juicy spiced minced beef.",
      price: 220,
      image: "/images/keema-paratha.svg",
      categorySlug: "parathas-breakfast",
      spiceLevel: 2,
      tags: "popular",
    },
    {
      name: "Egg Paratha",
      slug: "egg-paratha",
      description: "Classic egg-stuffed paratha — perfect student breakfast.",
      price: 160,
      image: "/images/egg-paratha.svg",
      categorySlug: "parathas-breakfast",
      tags: "popular",
    },
    // Burgers
    {
      name: "Zinger Burger",
      slug: "zinger-burger",
      description: "Crispy spiced chicken fillet, coleslaw, and zinger sauce in a toasted bun.",
      price: 350,
      image: "/images/zinger-burger.svg",
      categorySlug: "burgers-fast-food",
      spiceLevel: 2,
      tags: "popular",
    },
    {
      name: "Beef Smash Burger",
      slug: "beef-smash-burger",
      description: "Double smashed beef patty with cheddar, caramelized onions, and special sauce.",
      price: 420,
      image: "/images/beef-smash-burger.svg",
      categorySlug: "burgers-fast-food",
      spiceLevel: 1,
      tags: "popular,new",
    },
    {
      name: "Chicken Shawarma Roll",
      slug: "chicken-shawarma-roll",
      description: "Marinated grilled chicken, garlic sauce, pickles, and veggies in a soft roll.",
      price: 280,
      image: "/images/chicken-shawarma-roll.svg",
      categorySlug: "burgers-fast-food",
      tags: "popular",
    },
    // Sandwiches & Wraps
    {
      name: "Club Sandwich",
      slug: "club-sandwich",
      description: "Triple-decker toasted sandwich with chicken, egg, cheese, and veggies.",
      price: 320,
      image: "/images/club-sandwich.svg",
      categorySlug: "sandwiches-wraps",
      tags: "popular",
    },
    {
      name: "Paratha Roll",
      slug: "paratha-roll",
      description: "Saucy chicken tikka wrapped in a crispy layered paratha.",
      price: 240,
      image: "/images/paratha-roll.svg",
      categorySlug: "sandwiches-wraps",
      spiceLevel: 2,
      tags: "popular",
    },
    {
      name: "Grilled Veggie Wrap",
      slug: "grilled-veggie-wrap",
      description: "Chargrilled peppers, mushrooms, and cheese in a whole-wheat tortilla.",
      price: 220,
      image: "/images/grilled-veggie-wrap.svg",
      categorySlug: "sandwiches-wraps",
      tags: "veg",
    },
    // Fries & Snacks
    {
      name: "Loaded Fries",
      slug: "loaded-fries",
      description: "Crispy fries smothered in cheese sauce, jalapeños, and spiced chicken.",
      price: 280,
      image: "/images/loaded-fries.svg",
      categorySlug: "fries-snacks",
      spiceLevel: 2,
      tags: "popular",
    },
    {
      name: "Garlic Parmesan Fries",
      slug: "garlic-parmesan-fries",
      description: "Golden fries tossed with garlic butter, parmesan, and fresh herbs.",
      price: 220,
      image: "/images/garlic-parmesan-fries.svg",
      categorySlug: "fries-snacks",
      tags: "veg,popular",
    },
    {
      name: "Chicken Wings (6 pcs)",
      slug: "chicken-wings",
      description: "Crispy wings with your choice of buffalo, BBQ, or honey-garlic sauce.",
      price: 350,
      image: "/images/chicken-wings.svg",
      categorySlug: "fries-snacks",
      spiceLevel: 2,
      tags: "popular",
    },
    // Desi Specials
    {
      name: "Chapli Kabab Platter",
      slug: "chapli-kabab-platter",
      description: "2 juicy Peshawari chapli kababs with naan, raita, and mint chutney.",
      price: 380,
      image: "/images/chapli-kabab-platter.svg",
      categorySlug: "desi-specials",
      spiceLevel: 2,
      tags: "popular",
    },
    {
      name: "Haleem Bowl",
      slug: "haleem-bowl",
      description: "Slow-cooked wheat and beef haleem — hearty and nourishing.",
      price: 300,
      image: "/images/haleem-bowl.svg",
      categorySlug: "desi-specials",
      spiceLevel: 1,
      tags: "popular",
    },
    {
      name: "Biryani Box",
      slug: "biryani-box",
      description: "Fragrant student-portion chicken biryani with raita and salad.",
      price: 280,
      image: "/images/biryani-box.svg",
      categorySlug: "desi-specials",
      spiceLevel: 2,
      tags: "popular,new",
    },
    // Desserts
    {
      name: "Chocolate Brownie",
      slug: "chocolate-brownie",
      description: "Warm fudgy brownie served with a scoop of vanilla ice cream.",
      price: 220,
      image: "/images/chocolate-brownie.svg",
      categorySlug: "desserts",
      tags: "popular,veg",
    },
    {
      name: "Gulab Jamun (3 pcs)",
      slug: "gulab-jamun",
      description: "Soft milk-solid dumplings soaked in rose-scented sugar syrup.",
      price: 160,
      image: "/images/gulab-jamun.svg",
      categorySlug: "desserts",
      tags: "veg",
    },
    {
      name: "Nutella Pancakes",
      slug: "nutella-pancakes",
      description: "Fluffy stacked pancakes drizzled with Nutella and fresh banana.",
      price: 280,
      image: "/images/nutella-pancakes.svg",
      categorySlug: "desserts",
      tags: "popular,veg",
    },
  ] as const;

  for (const item of items) {
    const { options, categorySlug, ...data } = item as {
      options?: { groupName: string; label: string; priceDelta: number }[];
      categorySlug: string;
      name: string;
      slug: string;
      description: string;
      price: number;
      image: string;
      spiceLevel?: number;
      tags?: string;
    };

    await prisma.menuItem.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        spiceLevel: data.spiceLevel ?? 0,
        tags: data.tags ?? "",
        categoryId: catMap[categorySlug],
        options: options
          ? { create: options.map((o) => ({ ...o })) }
          : undefined,
      },
    });
  }
  console.log("✅ Menu items created (30 items)");

  // ── Reviews ───────────────────────────────────────────────────────────────
  const reviews = [
    { guestName: "Hamza R.", rating: 5, comment: "Best Kashmiri chai in Jamshoro! The ambiance is unmatched.", approved: true },
    { guestName: "Zara M.", rating: 5, comment: "Doodh patti at 1 AM hits different. My go-to study break spot.", approved: true },
    { guestName: "Usman T.", rating: 4, comment: "Smash burger was incredible. Fries were a bit cold but still great.", approved: true },
    { guestName: "Nida A.", rating: 5, comment: "Love the vibe — feels like a Karachi cafe right here in Jamshoro!", approved: true },
    { guestName: "Bilal K.", rating: 5, comment: "Student-friendly prices and massive portions. What more could you want?", approved: true },
    { userId: customer1.id, rating: 5, comment: "Ordered delivery three times this week. Always hot and on time.", approved: true },
    { userId: customer2.id, rating: 4, comment: "The outdoor seating is 🔥 in the evening. Perfect after exams.", approved: true },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log("✅ Reviews seeded");

  // ── Coupons ───────────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENTAGE", value: 10, minOrder: 300, active: true },
  });
  await prisma.coupon.upsert({
    where: { code: "STUDENT50" },
    update: {},
    create: { code: "STUDENT50", type: "FLAT", value: 50, minOrder: 500, active: true },
  });
  console.log("✅ Coupons created (WELCOME10, STUDENT50)");

  // ── Sample Address ────────────────────────────────────────────────────────
  await prisma.address.create({
    data: {
      userId: customer1.id,
      label: "Home",
      street: "Block 5, Mehran Town",
      area: "Near MUET Gate",
      city: "Jamshoro",
      isDefault: true,
    },
  });

  // ── Sample Order ──────────────────────────────────────────────────────────
  const doodhPatti = await prisma.menuItem.findUnique({ where: { slug: "doodh-patti" } });
  const zingerBurger = await prisma.menuItem.findUnique({ where: { slug: "zinger-burger" } });

  if (doodhPatti && zingerBurger) {
    await prisma.order.create({
      data: {
        orderNumber: "CG-SAMPLE-001",
        userId: customer1.id,
        status: "DELIVERED",
        type: "DELIVERY",
        subtotal: 430,
        deliveryFee: 100,
        tip: 0,
        discount: 0,
        total: 530,
        paymentMethod: "COD",
        paymentStatus: "UNPAID",
        deliveryAddress: "Block 5, Mehran Town, Near MUET Gate, Jamshoro",
        items: {
          create: [
            {
              menuItemId: doodhPatti.id,
              nameSnapshot: doodhPatti.name,
              unitPrice: doodhPatti.price,
              quantity: 2,
              selectedOptions: "",
              lineTotal: doodhPatti.price * 2,
            },
            {
              menuItemId: zingerBurger.id,
              nameSnapshot: zingerBurger.name,
              unitPrice: zingerBurger.price,
              quantity: 1,
              selectedOptions: "",
              lineTotal: zingerBurger.price,
            },
          ],
        },
      },
    });
  }
  console.log("✅ Sample order created");

  console.log("\n🎉 Seed complete!\n");
  console.log("─────────────────────────────────────");
  console.log("Admin login:    admin@chaegpt.pk / admin123");
  console.log("Customer login: ali@example.com / customer123");
  console.log("Promo code:     WELCOME10 (10% off orders over Rs. 300)");
  console.log("─────────────────────────────────────\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
