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
      <Async promiseFn={fetchData}>
        {({ data, err, isLoading }) => {
          if (isLoading) return 'Loading...';
          if (err) return `Something went wrong: ${err.message}`;
          if (data)
            return (
              <>
                <TotalCases data={data} />
                <NewCases data={data} />
                <GrowthRate data={data} />
                <Prediction data={data} />
              </>
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
