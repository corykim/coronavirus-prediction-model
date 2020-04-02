import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import Constants from 'util/Constants';
import Utility from 'util/Utility';
import BaseOptions from './BaseOptions';
require('highcharts/modules/annotations')(Highcharts);

const id = 'chart-prediction';

export default function Prediction({ data }) {
  const predictions = extrapolate(data);

  const { results, peak, doublingMilestones = [], halvingMilestones = [] } = predictions;
  const last = Utility.getLastRecord(data);
  const date = Utility.formatDate(last.date);
  const rate = Utility.formatPercent(last.rate);
  const rate2 = Utility.formatPercent(last.rate2);

  const predictionStartDate = new Date(last.date);
  predictionStartDate.setDate(predictionStartDate.getDate() + 1);
  const predictionStart = Utility.formatDate(predictionStartDate);

  const colorInterval = '#888888';
  const colorPredictionStart = '#22ff22';
  const colorPeak = '#cc3333';

  const plotLines = [];
  const basePlotLine = {
    color: colorInterval,
    dashStyle: 'ShortDot',
  };

  // annotate the dividing point
  plotLines.push({
    ...basePlotLine,
    color: colorPredictionStart,
    value: last.date,
  });

  // annotate the peak
  if (peak) {
    plotLines.push({
      ...basePlotLine,
      color: colorPeak,
      value: peak.date,
    });
  }

  // annotate the doubles
  doublingMilestones.forEach((record) => {
    plotLines.push({
      ...basePlotLine,
      value: record.date,
    });
  });

  // annotate the halvings
  halvingMilestones.forEach((record) => {
    plotLines.push({
      ...basePlotLine,
      value: record.date,
    });
  });

  const options = {
    ...BaseOptions,
    chart: {
      type: 'spline',
      zoomType: 'x',
    },
    title: {
      text: 'Predicted Active Cases',
    },
    xAxis: {
      type: 'datetime',
      plotLines,
    },
    yAxis: {
      title: {
        enabled: false,
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: 'Active Cases (predicted)',
        data: results.map((record) => [record.date, record.active_cases]),
      },
    ],
  };

  return (
    <section className="Prediction chart" id={id}>
      <h2>Model Prediction, as of {date}</h2>

      <div className="summary">
        <p>
          This chart shows the predicted number of active cases over time, based on a{' '}
          <em>Daily Growth Rate</em> of <b>{rate}</b> and a <em>ΔGrowth</em> of <b>{rate2}</b> .
        </p>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="legend">
        The vertical lines indicate salient points within the model's prediction:
        <ul>
          <li>
            <div className="color-code" style={{ backgroundColor: colorPredictionStart }} />
            The green line indicates the starting point of the prediction, which is{' '}
            {predictionStart}.
          </li>
          <li>
            <div className="color-code" style={{ backgroundColor: colorPeak }} />
            The red line indicates the peak number of active cases, if the curve peaks at all.
          </li>
          <li>
            <div className="color-code" style={{ backgroundColor: colorInterval }} />
            The grey lines indicate intervals at which the number of cases double or half.
          </li>
        </ul>
      </div>
      <div className="description">
        <h2>How The Model Works</h2>
        <p>This model uses the following techniques:</p>
        <ol>
          <li>Start with the daily new cases as raw data.</li>
          <li>Compute the total new cases over time.</li>
          <li>Take a moving average of total new cases over a seven-day window.</li>
          <li>
            Compute the daily growth rate (<em>r</em>) of the coronavirus.
          </li>
          <li>
            Compute the second derivative, (<em>Δr</em>). This value should reflect measures that
            society has taken to reduce the spread of the virus, or "flatten the curve."
          </li>
          <li>
            Extend the sample time series by:
            <ol>
              <li>
                Computing daily growth rate (r) for future dates, using the formula:
                <div>
                  r<sub>t</sub> ={' '}
                  <em>
                    r<sub>0</sub>
                  </em>
                  (1 + <em>Δr</em>)<sup>t</sup>
                </div>
              </li>
              <li>
                Compute the total new cases using the formula{' '}
                <div>
                  p<sub>t</sub> = p<sub>0</sub>(1 + <em>r</em>)<sup>t</sup>
                </div>
              </li>
              <li>
                Subtract the estimated resolved cases by subtracting the active cases from{' '}
                {Constants.RESOLUTION_DAYS} days prior. These cases would have been resolved either
                by the patient's recovery or death.
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </section>
  );
}

function extrapolate(data) {
  const tMax = 365 * 2;

  const resolutionDays = Constants.RESOLUTION_DAYS; // the number of days for a case to resolve
  const resolvedCount = 0; // the number of cases before we end the graph

  if (data.length) {
    const results = [...data];
    const last = results.slice(-1)[0];

    // calculate active cases by subtracting the cases that would have resolved;
    for (let t = 0; t < results.length; t++) {
      const resolved = t < resolutionDays ? 0 : results[t - resolutionDays].active_cases;
      results[t].active_cases = results[t].total_cases - resolved;
    }

    const doublingMilestones = [last];
    const halvingMilestones = [];

    // each time the number of cases doubled
    let lastDoubling = last.active_cases;

    // each time the number of cases halved
    let lastHalving;

    let peak;

    // the date of the last observation
    const d = new Date(last.date);

    // the starting value for p, population of active cases
    const p = last.active_cases;

    // the value for r1, the last observed growth rate
    const r1 = last.rate;

    // the value for r2, the last observed delta growth rate
    const r2 = last.rate2;

    // store the previous record for comparison
    let previous;

    // add predicted dates
    for (let t = 1; t < tMax; t++) {
      const r = r1 * Math.pow(1 + r2, t);
      const date = new Date(d);

      const base_cases = p * Math.pow(1 + r, t);
      const resolved_cases = p * Math.pow(1 + r, t - resolutionDays);
      const active_cases = Math.round(base_cases - resolved_cases);

      if (Math.round(active_cases) <= resolvedCount) {
        break;
      }

      date.setDate(d.getDate() + t);
      const record = {
        date: date.getTime(),
        active_cases,
        rate: r1,
        rate2: r2,
      };
      results.push(record);

      // see if this passed a doubling milestone
      if (r > 0 && active_cases >= lastDoubling * 2) {
        lastDoubling = active_cases;
        doublingMilestones.push(record);
      }

      // see if this record is a peak
      if (
        previous &&
        active_cases < previous.active_cases &&
        (!peak || previous.active_cases > peak.active_cases)
      ) {
        peak = previous;
        lastHalving = peak;
      }

      // see if this record is a halving milestone
      if (lastHalving && active_cases <= lastHalving.active_cases / 2) {
        halvingMilestones.push(record);
        lastHalving = record;
      }

      previous = record;
    }

    return {
      results: results,
      doublingMilestones: doublingMilestones.length ? doublingMilestones.slice(1) : undefined,
      halvingMilestones: halvingMilestones.length ? halvingMilestones.slice(1) : undefined,
      peak,
    };
  } else {
    return { cases: data };
  }
}
