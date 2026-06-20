import { postGuest } from "@/features/auth/api/guest";

export async function POST() {
  return postGuest();
}
