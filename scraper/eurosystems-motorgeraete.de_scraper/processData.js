import Apify from "apify";
import { writeToPath } from "fast-csv";
import { writeFile } from "fs/promises";
import path from "path";

const filenameJSON = path.join("data", "data.json");
const filenameCSV = path.join("data", "data.csv");

export async function saveFile() {
  const dataset = await Apify.openDataset();
  let { items } = await dataset.getData();
  items = items.filter((v, i, a) => a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i);
  console.log(items.length);

  writeFile(filenameJSON, JSON.stringify(items)).then(() => console.log("file written"));
  writeToPath(filenameCSV, items, { headers: true, writeBOM: true });
}
