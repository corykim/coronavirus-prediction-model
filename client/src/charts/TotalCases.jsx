import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import BaseOptions from './BaseOptions';
import Utility from '../util/Utility';

const id = 'chart-total-cases';

export default function TotalCases({ data }) {
  console.log('TotalCases', data);
  const last = Utility.getLastRecord(data);
  const date = Utility.formatDate(last.date);
  const total = Utility.formatInteger(last.total_cases);

  const options = {
    ...BaseOptions,
    chart: {
      type: 'spline',
      zoomType: 'x',
    },
    title: {
      text: 'Total Cases',
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
        name: 'Total Cases',
        data: data.map((record) => [record.date, record.total_cases]),
      },
    ],
  };

  return (
    <section className="TotalCases chart" id={id}>
      <h2>Total Cases</h2>
      <div className="summary">
        <p>
          As of {date}, there have been {total} total cases of coronavirus in the United States.
        </p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
}
