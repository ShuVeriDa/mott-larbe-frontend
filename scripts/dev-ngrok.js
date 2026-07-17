// Runs `next dev` with the single-tunnel ngrok env overrides applied only to
// this process — plain `npm run dev` (and .env.local) stays on the normal
// localhost setup. See the comment in .env.local for context.
const { spawnSync } = require("node:child_process");

const env = {
	...process.env,
	NEXT_PUBLIC_API_URL: "/api",
	DEV_API_PROXY_TARGET: process.env.DEV_API_PROXY_TARGET ?? "http://localhost:9555",
};

const result = spawnSync("next", ["dev"], {
	stdio: "inherit",
	env,
	shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
