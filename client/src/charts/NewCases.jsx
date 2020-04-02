import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import BaseOptions from './BaseOptions';

const id = 'chart-new-cases';

export default function NewCases({ data }) {
  console.log('NewCases', data);

  const options = {
    ...BaseOptions,
    chart: {
      type: 'column',
    },
    title: {
      text: 'Daily New Cases',
    },
    xAxis: {
      type: 'datetime',
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: 'New Cases',
        data: data.map((record) => [record.date, record.new_cases]),
      },
    ],
  };

  return (
    <div className="NewCases chart" id={id}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
