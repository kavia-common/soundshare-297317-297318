const fs = require("node:fs/promises");
const path = require("node:path");
const Papa = require("papaparse");

/**
 * PUBLIC_INTERFACE
 * Reads a CSV file and returns an array of objects (header row -> keys).
 *
 * - Trims values
 * - Skips empty lines
 * - Throws on parse errors
 *
 * @param {string} relativePath - Path relative to the tests/ directory OR an absolute path.
 * @returns {Promise<Record<string, string>[]>} Parsed rows.
 */
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

async function readCsvRecords(relativePath) {
  /** Read and parse CSV records for data-driven tests. */
  const resolved = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(__dirname, "..", relativePath);

  const csvText = await fs.readFile(resolved, "utf8");

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => toCamelCase((h || "").trim()),
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
