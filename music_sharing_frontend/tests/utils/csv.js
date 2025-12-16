const fs = require("node:fs");
const path = require("node:path");
const Papa = require("papaparse");

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function readCsvRecords(relativePath) {
  const resolved = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(__dirname, "..", relativePath);

  const csvText = fs.readFileSync(resolved, "utf8");

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => {
        // console.log(`Header input: "${h}"`);
        return toCamelCase((h || "").trim());
    },
    transform: (v) => (typeof v === "string" ? v.trim() : v),
  });

  if (parsed.errors && parsed.errors.length > 0) {
    const msg = parsed.errors
      .map((e) => `${e.type || "ParseError"} at row ${e.row}: ${e.message}`)
      .join("\n");
    throw new Error(`CSV parse failed for ${resolved}:\n${msg}`);
  }

  return parsed.data || [];
}

module.exports = {
  readCsvRecords,
};
