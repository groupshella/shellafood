import type { Metadata } from "next";
import { DeleteAccountClient } from "@/features/profile/components/sections/DeleteAccount/DeleteAccountClient";

export const metadata: Metadata = {
    title: "حذف الحساب | شيلة فود",
    description: "حذف حسابك من شيلة فود بشكل نهائي",
};

export default function DeleteAccountPage() {
    return <DeleteAccountClient />;
}