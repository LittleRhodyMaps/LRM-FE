import fs from "fs";
import path from "path";
import { marked } from "marked";
import { notFound } from "next/navigation";
import MAPS from "@/content/maps.json";
import MapView from "./map-view";

export function generateStaticParams() {
  return MAPS.map((map) => ({ id: map.route }));
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = MAPS.findIndex((m) => m.route === id);
  if (index === -1) notFound();

  const map = MAPS[index];
  const prevMap = index > 0 ? MAPS[index - 1] : null;
  const nextMap = index < MAPS.length - 1 ? MAPS[index + 1] : null;

  const descriptionMarkdown = map.descriptionFile
    ? fs.readFileSync(
        path.join(process.cwd(), "content/descriptions", map.descriptionFile),
        "utf-8",
      )
    : "";
  const descriptionHtml = descriptionMarkdown
    ? await marked.parse(descriptionMarkdown)
    : "";

  return (
    <MapView
      map={map}
      descriptionHtml={descriptionHtml}
      index={index}
      total={MAPS.length}
      prevMap={prevMap}
      nextMap={nextMap}
    />
  );
}
