import { NextRequest } from "next/server";
import { deleteSession, postSession } from "@/features/auth/api/session";

export async function POST(request: NextRequest) {
  return postSession(request);
}

export async function DELETE() {
  return deleteSession();
}
