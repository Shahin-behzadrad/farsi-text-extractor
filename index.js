#!/usr/bin/env node

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const SRC_DIR = resolve(process.cwd(), "src");
const OUTPUT_FILE = resolve(process.cwd(), "extractedTexts.json");

const result = {};
let counter = 1;

function extractFarsiStrings(content) {
  const found = new Set();

  // 1. Extract from string literals (single/double/backticks)
  const stringLiteralRegex = /["'`]((?:\\.|[^"'\\`])*)["'`]/g;
  const stringMatches = Array.from(content.matchAll(stringLiteralRegex));

  stringMatches.forEach((match) => {
    const text = match[1].trim();
    if (
      text.length > 1 &&
      /[\u0080-\uFFFF]/.test(text) && // contains Farsi
      !text.includes("=>") &&
      !text.startsWith("//") &&
      !text.startsWith("*")
    ) {
      found.add(text);
    }
  });

  // 2. Extract raw JSX text between tags (e.g. <span>سلام</span>)
  const jsxTextRegex = />\s*([^<=>{}]+?)\s*</g;
  const jsxMatches = Array.from(content.matchAll(jsxTextRegex));

  jsxMatches.forEach((match) => {
    const text = match[1].trim();
    if (text.length > 1 && /[\u0080-\uFFFF]/.test(text)) {
      found.add(text);
    }
  });

  return [...found];
}

function processDirectory(directory) {
  const files = readdirSync(directory);

  files.forEach((file) => {
    const fullPath = join(directory, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = readFileSync(fullPath, "utf8");
      const extracted = extractFarsiStrings(content);

      extracted.forEach((text) => {
        const transformed = text.replaceAll(/\${([^}]+)}/g, "{{$1}}");
        if (!Object.values(result).includes(transformed)) {
          result[`text_${(counter += 1)}`] = transformed;
        }
      });
    }
  });
}

processDirectory(SRC_DIR);
writeFileSync(OUTPUT_FILE, JSON.stringify(result, undefined, 2), "utf8");

console.log(
  `✅ Extracted ${Object.keys(result).length} UI texts to ${OUTPUT_FILE}`
);
