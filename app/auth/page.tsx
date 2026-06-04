"use client";

import { useState } from "react";
import WelcomeScreen, {

} from "../../features/auth/components/WelcomeScreen";
import EnterPhoneScreen from "@/features/auth/components/EnterPhoneScreen";
import OtpScreen from "@/features/auth/components/OtpScreen";
import RoleSelectionScreen from "@/features/auth/components/RoleSelectionScreen";
import CreateAccountScreen from "@/features/auth/components/CreateAccountScreen";
type Step = "welcome" | "enter-phone" | "otp" | "role" | "create";

export default function AuthFlowPage() {
	const [step, setStep] = useState<Step>("welcome");
	const [phone, setPhone] = useState("");

	return (
		<main className="min-h-dvh bg-white">
			{step === "welcome" && (
				<WelcomeScreen
					onPhone={() => setStep("enter-phone")}
					onApple={() => { }}
					onGoogle={() => { }}
					onGuest={() => setStep("role")}
				/>
			)}

			{step === "enter-phone" && (
				<EnterPhoneScreen
					onBack={() => setStep("welcome")}
					onContinue={(p) => {
						setPhone(p);
						setStep("otp");
					}}
				/>
			)}

			{step === "otp" && (
				<OtpScreen
					phone={phone}
					onBack={() => setStep("enter-phone")}
					onVerify={(code) => {
						setStep("role");
					}}
					onResend={() => { }}
				/>
			)}

			{step === "role" && (
				<RoleSelectionScreen
					onSelectRole={(role) => {
						setStep("create");
					}}
				/>
			)}

			{step === "create" && (
				<CreateAccountScreen
					onBack={() => setStep("role")}
					onCreate={() => setStep("welcome")}
				/>
			)}
		</main>
	);
}
