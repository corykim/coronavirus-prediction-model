import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import BaseOptions from './BaseOptions';
import Utility from 'util/Utility';

const id = 'chart-new-cases';

export default function NewCases({ data }) {
  const last = Utility.getLastRecord(data);
  const date = Utility.formatDate(last.date);
  const newCases = Utility.formatInteger(last.new_cases);

  const options = {
    ...BaseOptions,
    chart: {
      type: 'column',
      zoomType: 'x',
    },
    title: {
      text: 'Daily New Cases',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      floor: 0,
      title: {
        enabled: false,
      },
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
    <section className="NewCases chart" id={id}>
      <h2>Daily New Cases</h2>
      <div className="summary">
        <p>
          On {date}, there were <b>{newCases}</b> new cases of coronavirus in the United States.
        </p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
}
