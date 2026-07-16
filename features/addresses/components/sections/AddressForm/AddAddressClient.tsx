"use client";

import { useState } from "react";
import { MapPickerClient } from "@/features/addresses/components/sections/AddressForm/MapPickerClient";
import { AddressFormClient } from "@/features/addresses/components/sections/AddressForm/AddressFormClient";
import { PickedLocation } from "@/features/addresses/types/address.types";

type Step = "map" | "form";

export function AddAddressClient({ isArabic }: { isArabic: boolean }) {
	const [step, setStep] = useState<Step>("map");
	const [location, setLocation] = useState<PickedLocation | null>(null);

	function handleLocationConfirmed(loc: PickedLocation) {
		setLocation(loc);
		setStep("form");
	}

	if (step === "map" || !location) {
		return (
			<div className="flex min-h-0 flex-1 flex-col">
				<MapPickerClient onConfirm={handleLocationConfirmed} isArabic={isArabic} />
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto">
			<AddressFormClient location={location} isArabic={isArabic} />
		</div>
	);
}
