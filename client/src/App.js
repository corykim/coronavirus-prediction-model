import React from 'react';
import './App.scss';
import NewCases from './charts/NewCases';
import TotalCases from './charts/TotalCases';
import Prediction from './charts/Prediction';
import GrowthRate from './charts/GrowthRate';
import Async from 'react-async';

require('./util/HighChartTheme');

function App() {
  return (
    <div className="App">
      <h1>How Long Will The Coronavirus Last?</h1>

      <p>
        This model tracks the new coronavirus cases in the United States, analyzes the growth rate,
        and predics the eventual course of the pandemic within the US. Raw data for daily new cases
        comes from{' '}
        <a
          href="https://www.worldometers.info/coronavirus/country/us/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Worldometer
        </a>
        .
      </p>

      <Async promiseFn={fetchData}>
        {({ data, err, isLoading }) => {
          if (isLoading) return 'Loading...';
          if (err) return `Something went wrong: ${err.message}`;
          if (data)
            return (
              <div className="chart-container">
                <TotalCases data={data} />
                <NewCases data={data} />
                <GrowthRate data={data} />
                <Prediction data={data} />
              </div>
            );
        }}
      </Async>
    </div>
  );
}

export default App;

async function fetchData() {
  return window
    .fetch('/data')
    .then((result) => result.json())
    .then((data) =>
      data.map((record) => ({
        ...record,
        date: Date.parse(record.date),
      }))
    );
}
