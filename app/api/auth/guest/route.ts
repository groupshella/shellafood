import { NextRequest } from "next/server";
import { postGuest } from "@/features/auth/api/guest";

export async function POST(request: NextRequest) {
  return postGuest(request);
}
