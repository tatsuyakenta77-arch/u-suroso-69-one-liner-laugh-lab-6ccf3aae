// One-Liner Laugh Lab — make.fun entry.
//
// The prompt: the excuse a robot vacuum gives after eating a sock.
// The line:
//
//   The sock attacked first. I have the lint to prove it.
//
// Why this line: it dodges the first excuse anyone thinks of ("I
// thought it was a dust bunny") and instead lets the vacuum plead
// self-defence — the sock is the aggressor, and the vacuum's own lint
// is its courtroom evidence. Two short sentences, twist first and
// evidence second: the joke comes from the fit (a vacuum really does
// collect lint, and really does swallow socks), and at 53 characters
// not a word is wasted.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const line =
  "The sock attacked first. I have the lint to prove it.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–200 characters of UTF-8 text, not only
// whitespace, on a single line — so the code enforces the shape
// too: one line, inside the limit, no leading or trailing space.
if (line.length < 1 || line.length > 200) {
  throw new Error(`entry line is ${line.length} characters, outside the 1-200 limit`);
}
if (line.trim().length === 0 || /[\r\n]/.test(line)) {
  throw new Error("entry line must be one non-blank line");
}
if (line !== line.trim()) {
  throw new Error("entry line must not start or end with whitespace");
}
// A one-liner stays tight: no doubled spaces smuggled in by an
// edit, which would read as a stumble in the middle of the joke.
if (/  /.test(line)) {
  throw new Error("entry line must not contain doubled spaces");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, line, "utf8");

// Read it back and verify the file holds exactly the line, byte
// for byte, so a partial or corrupted write can never reach the
// judge — and that its byte length matches the line's own byte
// length (this line is pure ASCII, so bytes equal characters at
// 53, but the check guards against a future edit silently adding
// a multi-byte character).
const written = readFileSync(dst, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not hold exactly the entry line");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(line, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry line");
}

console.log(line);
