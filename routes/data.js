const express = require("express");
const router = express.Router();
const csv = require("csvtojson");

const filePath = "data/coronavirus.csv";

/**
 * Parse a number to an integer, ignoring comma separators
 * @param {string} value
 */
function parseNumber(value) {
  return Number.parseInt(value.replace(/,/, ""));
}

/**
 * Number of days to look back
 */
const windowSize = 7;

/**
 * Calculate all the statistics in one pass
 * @param {object} data
 */
function calculateStatistics(data) {
  const results = new Array(data.length);
  let movingTotal = 0;
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    results[i] = {};

    // update the total cases
    if (i > 0) {
      record.total_cases = (data[i - 1].total_cases || 0) + record.new_cases;
    } else {
      if (!record.total_cases) record.total_cases = record.new_cases;
    }

    // moving average looking back n days
    movingTotal += record.total_cases;
    if (i > windowSize - 2) {
      const back = data[i - windowSize + 1];
      results[i].moving_average = movingTotal / windowSize;
      movingTotal -= back.total_cases;
    }

    // calculate the rate of growth (of the moving average)
    if (i > 0) {
      results[i].rate =
        (results[i].moving_average - results[i - 1].moving_average) /
        results[i - 1].moving_average;
    }

    // calculate the second derivative
    if (i > 1) {
      results[i].rate2 =
        (results[i].rate - results[i - 1].rate) / results[i - 1].rate;
    }
  }

  return data.map((record, i) => {
    return { ...record, ...results[i] };
  });
}

/* GET coronavirus data. */
router.get("/", function(req, res, next) {
  csv({
    colParser: {
      new_cases: parseNumber,
      total_cases: parseNumber
    },
    trim: true
  })
    .fromFile(filePath)
    .then(json => {
      // strip out empty rows
      data = json.filter(record => record.date);
      data = calculateStatistics(data);

      res.set("Cache-Control", "max-age=60");
      res.json(data);
    })
    .catch(e => {
      console.error(`Error loading data from path ${filePath}`, e);
      throw e;
    });
});

module.exports = router;
