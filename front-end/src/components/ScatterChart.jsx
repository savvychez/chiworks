import React from "react";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto"; // Import to register controllers, elements, scales and plugins.

function ScatterChart({ chartData, options }) {
  return <Scatter data={chartData} options={options} />;
}

export default ScatterChart;
