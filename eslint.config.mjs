import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
	...nextVitals,
	...nextTypescript,
	{
		rules: {
			// Existing state/ref synchronization patterns predate the React Compiler.
			// Keep the standard Hooks correctness rules while migrating these separately.
			"react-hooks/refs": "off",
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/use-memo": "off",
		},
	},
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
]);
