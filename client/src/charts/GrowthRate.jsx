import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import BaseOptions from './BaseOptions';
import Utility from 'util/Utility';
import Constants from 'util/Constants';

const id = 'chart-growth-rate';

export default function GrowthRate({ data }) {
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
      text: 'Growth Rates',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        enabled: false,
      },
    },

    series: [
      {
        name: 'Daily Growth Rate',
        data: data.map((record) => [record.date, record.rate]),
      },
      {
        name: 'Δ Growth',
        data: data.map((record) => [record.date, record.rate2]),
      },
    ],
  };

  return (
    <section className="GrowthRate chart" id={id}>
      <h2>Growth Rates</h2>
      <div className="summary">
        <p>
          As of {date}, the <em>Daily Growth Rate</em> is <b>{rate}</b> and the <em>Δ Growth</em> is{' '}
          <b>{rate2}</b> .
        </p>
        <ul>
          <li>
            <em>Daily Growth Rate</em> is the change from one day to the next. Total cases are first
            smoothed using a moving average with a window size of {Constants.WINDOW_SIZE} days.
          </li>
          <li>
            <em>Δ Growth</em> is the change in the growth rate itself, i.e. the second derivative of
            the number of cases.
          </li>
        </ul>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
}
