import { spawnSync } from "node:child_process";

const proc = spawnSync(
  "tree-sitter",
  ["generate", "--report-states-for-rule", "statement"],
  {
    encoding: "utf8",
    stdio: ["inherit", "inherit", "pipe"], // --report-states-for-rule returns result in stderr
  },
);

if (proc.status !== 0) {
  console.error(proc.stderr);
  process.exit(proc.status);
}

console.log(
  proc.stderr
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/))
    .filter(([name, value]) => !name.startsWith("_") && Number(value) >= 10)
    .map(([statement, states]) => `${statement}: ${states}`)
    .join("\n"),
);
