import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import BaseOptions from './BaseOptions';

const id = 'chart-total-cases';

export default function TotalCases({ data }) {
  console.log('TotalCases', data);

  const options = {
    ...BaseOptions,
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Total Cases',
    },
    xAxis: {
      type: 'datetime',
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
    <div className="TotalCases chart" id={id}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
