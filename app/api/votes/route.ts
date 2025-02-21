import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

const voteSchema = z.object({
  candidateId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existingVote = await db.vote.findUnique({
      where: { userId: session.user.id },
    });

    if (existingVote) {
      return NextResponse.json(
        { message: "You have already voted" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { candidateId } = voteSchema.parse(body);

    const vote = await db.vote.create({
      data: {
        userId: session.user.id,
        candidateId,
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to cast vote" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vote = await db.vote.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ candidateId: vote?.candidateId || null });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to check vote status" },
      { status: 500 }
    );
  }
}
