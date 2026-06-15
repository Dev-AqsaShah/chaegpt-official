import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional(),
  date: z.string(),
  time: z.string(),
  partySize: z.number().min(1).max(20),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      ...parsed.data,
      userId: session?.user?.id ?? null,
    },
  });

  return NextResponse.json({ id: reservation.id }, { status: 201 });
}
