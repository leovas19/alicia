import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type VisitedPlace = {
  id: string;
  name: string;
  country: string;
  note: string;
  latitude: number;
  longitude: number;
};

const placesFilePath = path.join(process.cwd(), "data/visited-places.json");

export async function readVisitedPlaces() {
  try {
    const content = await readFile(placesFilePath, "utf8");
    const parsed = JSON.parse(content) as VisitedPlace[];
    return parsed;
  } catch {
    return [];
  }
}

export async function writeVisitedPlaces(places: VisitedPlace[]) {
  await mkdir(path.dirname(placesFilePath), { recursive: true });
  await writeFile(placesFilePath, `${JSON.stringify(places, null, 2)}\n`, "utf8");
}
