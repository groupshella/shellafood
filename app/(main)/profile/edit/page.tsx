import type { AuthUser } from "@/features/auth/types/auth.types";
import { EditProfilePageClient } from "@/features/profile/components/sections/EditProfile";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
    const cookieStore = await cookies();
    const rawUser = cookieStore.get(COOKIE_KEYS.USER)?.value;
    if (!rawUser) redirect("/auth");

    const user = JSON.parse(rawUser) as AuthUser;

    return <EditProfilePageClient user={user} />;
}
