import { ProfileShell } from "@/features/profile/components/ProfileShell";
import { ProfileHome } from "@/features/profile/components/sections/ProfileHome";
import { ProfileEditProvider } from "@/features/profile/context/ProfileEditContext";
import { getProfileUser, isProfileAuthenticated } from "@/features/profile/lib/get-profile-user";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const isAuthenticated = await isProfileAuthenticated();
    if (!isAuthenticated) return null;

    const user = await getProfileUser();
    if (!user) redirect("/auth");

    return (
        <ProfileEditProvider user={user}>
            <ProfileShell>
                <ProfileHome user={user} />
            </ProfileShell>
        </ProfileEditProvider>
    );
}
