import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

function PieChart1({ chartData, options }) {
  return <Pie data={chartData} options={options} />;
}

export default PieChart1;
