# 🧾 farsi-text-extractor

## 🚀 Usage (No install required)

Run directly using [npx](https://www.npmjs.com/package/npx):

````bash
npx farsi-text-extractor

A simple CLI tool that extracts Persian (Farsi) UI strings from `.js`, `.jsx`, `.ts`, and `.tsx` files in your `src/` folder — ideal for preparing your app for translation (`i18n`).

## ✨ Features

- Detects Farsi text in:
  - JavaScript / TypeScript string literals
  - JSX elements like `<span>توضیح</span>`
- Transforms template variables from `${variable}` into `{{variable}}` for translator-friendly formatting
- Outputs all strings into a single `extractedTexts.json` file in your project root

---

## 🚀 Quick Start

### Without installing anything (via `npx`):

```bash
npx farsi-text-extractor
````
