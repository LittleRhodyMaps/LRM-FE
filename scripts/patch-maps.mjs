#!/usr/bin/env node
// Applies the per-map patch file in scripts/map-patches/<slug>.mjs to each
// raw Folium/Leaflet export in public/raw_maps, writing the result to
// public/patched_maps.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const RAW_DIR = join(ROOT, "public", "raw_maps");
const PATCHED_DIR = join(ROOT, "public", "patched_maps");
const PATCHES_DIR = join(ROOT, "scripts", "map-patches");

async function patchFile(filename) {
  const slug = basename(filename, extname(filename));
  const patchPath = join(PATCHES_DIR, `${slug}.mjs`);

  if (!existsSync(patchPath)) {
    console.error(
      `no patch file for "${slug}" — create scripts/map-patches/${slug}.mjs ` +
        `(compose it from the helpers in scripts/map-patches/lib.mjs)`
    );
    process.exitCode = 1;
    return;
  }

  const { default: patch } = await import(pathToFileURL(patchPath).href);
  const html = readFileSync(join(RAW_DIR, filename), "utf-8");
  writeFileSync(join(PATCHED_DIR, filename), patch(html), "utf-8");
  console.log(`patched ${filename} (scripts/map-patches/${slug}.mjs)`);
}

mkdirSync(PATCHED_DIR, { recursive: true });

const args = process.argv.slice(2);
const files =
  args.length > 0
    ? args.map((a) => basename(a))
    : readdirSync(RAW_DIR).filter((f) => f.endsWith(".html"));

if (files.length === 0) {
  console.log(`no .html files found in ${RAW_DIR}`);
}

for (const f of files) await patchFile(f);
