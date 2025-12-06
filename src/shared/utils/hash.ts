import { createHash } from "crypto";

export default function hash(str: string) {
	const hash = createHash("sha256").update(str).digest("hex");

	return hash;
}

