import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import BaseOptions from './BaseOptions';

const id = 'chart-growth-rate';

export default function GrowthRate({ data }) {
  console.log('GrowthRate', data);

  const options = {
    ...BaseOptions,
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Growth Rates',
    },
    xAxis: {
      type: 'datetime',
    },

    series: [
      {
        name: 'Daily Growth Rate',
        data: data.map((record) => [record.date, record.rate]),
      },
      {
        name: 'Second Derivative',
        data: data.map((record) => [record.date, record.rate2]),
      },
    ],
  };

  return (
    <div className="GrowthRate chart" id={id}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
