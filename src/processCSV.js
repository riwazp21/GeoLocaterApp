const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const fetch = require("node-fetch");
const REQUIRED_COLUMNS = ["Address", "City", "State", "Country"];

function validateColumns(headers) {
  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(`CSV is missing required columns: ${missing.join(", ")}`);
  }
}

async function processCSV(filePath, apiKey) {
  const input = fs.readFileSync(filePath);
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  const headers = Object.keys(records[0]);
  validateColumns(headers);

  for (let row of records) {
    const fullAddress = `${row.Address}, ${row.City}, ${row.State}, ${row.Country}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      fullAddress
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK" || !data.results[0]) {
      throw new Error(`Google Maps API returned an error: ${data.status}`);
    }
    if (data.results && data.results[0]) {
      row.Latitude = data.results[0].geometry.location.lat;
      row.Longitude = data.results[0].geometry.location.lng;
    } else {
      row.Latitude = "N/A";
      row.Longitude = "N/A";
    }
  }

  const output = stringify(records, { header: true });
  const outputPath = path.join(path.dirname(filePath), "processed.csv");
  fs.writeFileSync(outputPath, output);
  return outputPath;
}

module.exports = processCSV;
