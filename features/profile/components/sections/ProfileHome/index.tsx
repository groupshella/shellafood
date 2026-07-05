import { ProfileHomeClient } from "./ProfileHomeClient";

export function ProfileHome({ user }: Parameters<typeof ProfileHomeClient>[0]) {
    return <ProfileHomeClient user={user} />;
}
