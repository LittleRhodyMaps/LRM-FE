import { redirect } from "next/navigation";
import MAPS from "@/content/maps.json";

export default function Home() {
  const latest = MAPS[MAPS.length - 1];
  redirect(`/${latest.route}`);
}
