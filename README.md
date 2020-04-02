# Coronavirus Prediction Model

## Purpose

This model tracks the new coronavirus cases in the United States, analyzes the growth rate, and predicts the eventual course of the pandemic within the United States. The raw data for daily new cases comes from [Worldometer](https://www.worldometers.info/coronavirus/country/us/).

## How The Model Works

This model uses the following techniques:

- Start with the daily new cases as raw data.
- Compute the total new cases over time.
- Take a moving average of total new cases over a seven-day window.
- Compute the daily growth rate (_r_) of the coronavirus.
- Compute the second derivative, (_Δr_). This value should reflect measures that society has taken to reduce the spread of the virus, or "flatten the curve."
- Extend the sample time series by:
  - Computing daily growth rate (r) for future dates using the formula r*t* = r*0* x (1 + Δr)^t
  - Computing the new cases using the formula p*t* = p*0* x (1 + r)^t
  - Subtracting the resolved cases, which would be the total active cases from 20 days prior. The resolved cases are those patients
    who would have either recovered or died.

## Deployment

The application consists of two main components, the back-end data service and a front-end client.

### Back-end

The back-end data service is created using Express. To serve the data, open a command line at the root of this project and run the command `npm start`. This will start the service at port 3001.

### Front-end

The front-end client is created using React. To serve the client, open a command line at the root directory of this repository, and run the following commands:

```
cd client
yarn install
yarn build
npx serve -s build
```

Alternatively, you can serve in development mode with the commands:

```
cd client
yarn install
yarn start
```

## Data file

The data file is a CSV file located at the path [data/coronavirus.csv](./data/coronavirus.csv). The columns for this file are `date,new_cases,total_cases`. The `total_cases` column will be automatically computed if no value exists in the CSV.
