import { NextRequest } from "next/server";
import { postRegister } from "@/features/auth/api/register";

export async function POST(request: NextRequest) {
  return postRegister(request);
}
