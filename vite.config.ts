import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Every route is prerendered, and SvelteKit 2 refuses `$env/dynamic/*` during prerendering
  // while `$env/static/*` fails to import a variable that is not set (a fresh clone has none).
  // So the build-time code in src/lib/server reads `process.env`, and this copies a local
  // `.env` into it. The platform's deploy sets the real environment, which always wins.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ["PUBLIC_", "BCMS_"]))) {
    process.env[key] ??= value;
  }
  return { plugins: [tailwindcss(), sveltekit()] };
});
