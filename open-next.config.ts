import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// TODO: Enable R2 incremental cache (ISR) — implement soon.
// Requires provisioning an R2 bucket in Cloudflare and adding an r2_buckets
// binding in wrangler.jsonc, then:
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
export default defineCloudflareConfig({});
