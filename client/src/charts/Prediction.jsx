import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import Constants from 'util/Constants';
import Utility from 'util/Utility';
import BaseOptions from './BaseOptions';

const id = 'chart-prediction';

export default function Prediction({ data }) {
  const prediction = extrapolate(data);
  console.log('Prediction', prediction);
  const last = Utility.getLastRecord(data);
  const date = Utility.formatDate(last.date);
  const rate = Utility.formatPercent(last.rate);
  const rate2 = Utility.formatPercent(last.rate2);

  const options = {
    ...BaseOptions,
    chart: {
      type: 'spline',
      zoomType: 'x',
    },
    title: {
      text: 'Predicted Cases',
    },
    xAxis: {
      type: 'datetime',
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
        data: prediction.map((record) => [record.date, record.active_cases]),
      },
    ],
  };

  return (
    <section className="Prediction chart" id={id}>
      <h2>Prediction, As Of {date}</h2>

      <div className="summary">
        <p>
          This chart shows the predicted number of active cases over time, based on a
          <em>Daily Growth Rate</em> of <b>{rate}</b> and a <em>Δ Growth</em> of
          <b>{rate2}</b> .
        </p>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
}

function extrapolate(data) {
  const tMax = 365 * 2;

  const resolutionDays = Constants.RESOLUTION_DAYS; // the number of days for a case to resolve
  const resolvedCount = 1; // the number of cases before we end the graph

  const last = Utility.getLastRecord(data);
  const date = Utility.formatDate(last.date);
  const rate = Utility.formatPercent(last.rate);
  const rate2 = Utility.formatPercent(last.rate2);

  if (data.length) {
    const results = [...data];

    const last = results.slice(-1)[0];
    // calculate active cases by subtracting the cases that would have resolved;
    for (let t = 0; t < results.length; t++) {
      const resolved = t < resolutionDays ? 0 : results[t - resolutionDays].active_cases;
      results[t].active_cases = results[t].total_cases - resolved;
    }

    const d = new Date(last.date);
    const p = last.active_cases;
    const r1 = last.rate;
    const r2 = last.rate2;

    // add predicted dates
    for (let t = 1; t < tMax; t++) {
      const r = r1 * Math.pow(1 + r2, t);
      const date = new Date(d);

      const base_cases = p * Math.pow(1 + r, t);
      const resolved_cases = p * Math.pow(1 + r, t - resolutionDays);
      const active_cases = Math.round(base_cases - resolved_cases);

      date.setDate(d.getDate() + t);
      results.push({
        date: date.getTime(),
        active_cases,
        rate: r1,
        rate2: r2,
      });

      if (active_cases < resolvedCount) {
        break;
      }
    }

    return results;
  } else {
    return data;
  }
}
