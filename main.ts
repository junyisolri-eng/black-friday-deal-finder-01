// Deal Scout — Black Friday deal finder entry (Node 22, standard library
// only). The site lives in this directory's app/ as plain static files; this
// program hands it in: it copies app/ and screenshots/ from beside this file
// to /output and writes /output/dossier.json, the summary the judge reads,
// with the vendored make.fun library. All paths resolve from this file, never
// from the working directory, so the grader can run it from anywhere.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });

const shots = join(here, "screenshots");
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(shots)) {
  const files = readdirSync(shots).filter((f) => !f.startsWith("."));
  if (files.length < 3 || files.length > 4) {
    throw new Error(`expected 3 or 4 screenshots, found ${files.length}`);
  }
  cpSync(shots, join(out, "screenshots"), { recursive: true });
} else {
  throw new Error("screenshots/ is missing next to main.ts");
}

// The scorer's own caps (from the kit): at most 4 screenshots, each at most
// 256 KiB; app/ at most 993 files and 16 MiB. buildDossier enforces them.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
