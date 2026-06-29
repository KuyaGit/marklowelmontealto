/**
 * Worker bundle size guard.
 *
 * Run after `opennextjs-cloudflare build` to verify the compiled worker stays
 * under the Cloudflare Workers 3 MiB upload limit. Exits with code 1 if the
 * limit is exceeded so CI / npm scripts can catch it before deploy.
 *
 * Usage: node scripts/check-worker-size.mjs
 */

import fs from "fs";
import path from "path";

const WORKER_PATH = path.resolve(".open-next/worker.js");
const LIMIT_BYTES = 2.9 * 1024 * 1024; // 2.9 MiB — leave 100 KB headroom

if (!fs.existsSync(WORKER_PATH)) {
  console.error(`❌  Worker not found at ${WORKER_PATH}`);
  console.error(
    "    Run `opennextjs-cloudflare build` (or `npm run preview`) first."
  );
  process.exit(1);
}

const { size } = fs.statSync(WORKER_PATH);
const sizeMiB = (size / 1024 / 1024).toFixed(2);
const limitMiB = (LIMIT_BYTES / 1024 / 1024).toFixed(2);

if (size > LIMIT_BYTES) {
  console.error(
    `❌  Worker bundle too large: ${sizeMiB} MiB (limit: ${limitMiB} MiB)`
  );
  console.error(
    "    The Cloudflare Workers free/paid plans cap uploads at 3 MiB."
  );
  console.error(
    "    Common causes: importing the full `shiki` bundle, `next/og`,"
  );
  console.error("    or other large WASM/binary dependencies.");
  process.exit(1);
}

console.log(
  `✅  Worker bundle size OK: ${sizeMiB} MiB / ${limitMiB} MiB limit`
);
