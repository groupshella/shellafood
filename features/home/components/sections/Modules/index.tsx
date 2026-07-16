import { ModulesClient } from "./ModulesClient";
import ModuleSkeleton from "./skeleton";

export const Modules = Object.assign(
	async function Modules({ isArabic }: { isArabic: boolean }) {
		return <ModulesClient isArabic={isArabic} />;
	},
	{ skeleton: ModuleSkeleton },
);
