const parse = require("csv-parser");
const { Readable } = require("stream");

/**
 * Validates if the uploaded CSV file has the required columns.
 * @param {string} csvContent - The raw CSV file content.
 * @returns {Promise<boolean>} - Returns true if valid, otherwise false.
 */
async function validateCSV(csvContent) {
  return new Promise((resolve, reject) => {
    const requiredColumns = ["Address", "City", "State", "Country"];
    const receivedColumns = [];

    Readable.from(csvContent)
      .pipe(parse())
      .on("headers", (headers) => {
        receivedColumns.push(...headers);
        const isValid = requiredColumns.every((col) =>
          receivedColumns.includes(col)
        );
        resolve(isValid);
      })
      .on("error", (error) => reject(error));
  });
}

module.exports = { validateCSV };
