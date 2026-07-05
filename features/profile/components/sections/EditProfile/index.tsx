import type { AuthUser } from "@/features/auth/types/auth.types";
import { ProfileEditProvider } from "@/features/profile/context/ProfileEditContext";
import { EditProfileClient } from "./EditProfileClient";
interface EditProfilePageClientProps {
    user: AuthUser;
}
export function EditProfilePageClient({ user }: EditProfilePageClientProps) {
    return (
        <ProfileEditProvider user={user}>
            <EditProfileClient user={user} />
        </ProfileEditProvider>
    );
}