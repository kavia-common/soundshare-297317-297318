const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

const csvPath = path.resolve(__dirname, "tests/data/functional_scenarios.csv");
console.log("Reading CSV from:", csvPath);
const csvText = fs.readFileSync(csvPath, "utf8");

const parsed = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => {
    const cc = toCamelCase((h || "").trim());
    console.log(`Header '${h}' -> '${cc}'`);
    return cc;
  },
  transform: (v) => (typeof v === "string" ? v.trim() : v),
});

if (parsed.data.length > 0) {
    console.log("Parsed keys:", Object.keys(parsed.data[0]));
    console.log("Parsed first row:", parsed.data[0]);
} else {
    console.log("No data parsed");
}
if (parsed.errors.length > 0) {
    console.log("Errors:", parsed.errors);
}
