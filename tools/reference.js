import { createReadStream } from "fs";
import * as readline from "readline";

const phrase = process.argv[2];

if (!phrase) {
  console.error('Usage: bun run reference "PHRASE"');
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
        if (title !== current) console.log("[END]", current);
        capturing = false;
        continue;
      }

      if (titleLower.includes(phraseLower)) {
        if (title !== current) console.log("[START]", title);
        current = title;
        capturing = true;
        continue;
      }
    }

    if (capturing) {
      console.log(line);
    }
  }
}

extractSection("./docs/abl-reference.txt", phrase);
