import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

const candidateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export async function GET() {
  try {
    const candidates = await db.candidate.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });
    return NextResponse.json(candidates);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description } = candidateSchema.parse(body);

    const candidate = await db.candidate.create({
      data: { name, description },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
