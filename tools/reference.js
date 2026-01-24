import { createReadStream } from "fs";
import * as readline from "readline";

const phrase = process.argv[2];

if (!phrase) {
  console.error('Usage: bun run reference:search "PHRASE"');
  process.exit(1);
}

async function extractSection(path, phrase) {
  const stream = createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream });

  let capturing = false;
  let current;
  const phraseLower = phrase.toLowerCase();

  for await (const line of rl) {
    // Section header starts with form feed (^L)
    if (line.startsWith("\f")) {
      const title = line.slice(1).trim();
      const titleLower = title.toLowerCase();

      if (capturing) {
        console.log("[END]", current.trim());
        capturing = false;
        current = "";
        continue;
      }

      if (titleLower.includes(phraseLower)) {
        current = title.trim();
        console.log("[START]", current);
        capturing = true;
        continue; // skip header (remove if you want it included)
      }
    }

    if (capturing) {
      console.log(line);
    }
  }
}

extractSection("./docs/abl-reference.txt", phrase);
